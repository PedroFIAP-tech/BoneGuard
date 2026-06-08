import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { api } from './api';
import { Radiografia } from '../types';

const PYTHON_API_URL = 'http://147.15.115.61:8000';

export const SAMPLE_XRAY_URL =
  'https://www.gstatic.com/webp/gallery/1.jpg';

// Baixa uma URL para um arquivo local temporário e retorna a URI local
async function downloadToLocal(remoteUrl: string): Promise<string> {
  const dest = `${FileSystem.cacheDirectory}sample_xray_${Date.now()}.jpg`;
  const { uri } = await FileSystem.downloadAsync(remoteUrl, dest);
  return uri;
}

function buildNativeFormData(fieldName: string, imageUri: string): FormData {
  const formData = new FormData();
  formData.append(fieldName, { uri: imageUri, name: 'raio_x.jpg', type: 'image/jpeg' } as any);
  return formData;
}

async function chamarPythonComUri(imageUri: string): Promise<Radiografia> {
  const formData = buildNativeFormData('file', imageUri);

  const res = await api.post<any>(`${PYTHON_API_URL}/analisar-radiografia`, formData, {
    headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });

  return {
    id: 0,
    avaliacaoId: 0,
    resultadoIA: res.data.classificacao,
    confianca: res.data.confianca,
    densitometria: null,
    dataAnalise: new Date().toISOString().split('T')[0],
  };
}

export const visionService = {
  async analisarRaioX(imageUri: string, avaliacaoId: number): Promise<Radiografia> {
    const formData = new FormData();
    if (Platform.OS === 'web') {
      const blob = await (await fetch(imageUri)).blob();
      formData.append('imagem', blob, 'raio_x.jpg');
    } else {
      formData.append('imagem', { uri: imageUri, name: 'raio_x.jpg', type: 'image/jpeg' } as any);
    }
    formData.append('avaliacaoId', String(avaliacaoId));

    try {
      const res = await api.post<Radiografia>('/radiografias/upload', formData, {
        headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return res.data;
    } catch (javaErr: any) {
      // Java falhou (503) — chama Python diretamente com a URI local
      try {
        return await chamarPythonComUri(imageUri);
      } catch (pythonErr: any) {
        const detalhe = pythonErr?.message ?? String(pythonErr);
        throw new Error(`Java: ${javaErr?.response?.status ?? javaErr?.message} | Python: ${detalhe}`);
      }
    }
  },

  // Baixa uma imagem de exemplo da internet, salva local e analisa
  async analisarExemplo(): Promise<Radiografia> {
    const localUri = await downloadToLocal(SAMPLE_XRAY_URL);
    return chamarPythonComUri(localUri);
  },
};
