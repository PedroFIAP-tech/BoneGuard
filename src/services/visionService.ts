import { Platform } from 'react-native';
import { api } from './api';
import { Radiografia } from '../types';

const PYTHON_API_URL = 'http://147.15.115.61:8000';

async function getBlob(imageUri: string): Promise<Blob> {
  const response = await fetch(imageUri);
  return response.blob();
}

async function buildFormDataJava(imageUri: string): Promise<FormData> {
  const formData = new FormData();
  if (Platform.OS === 'web') {
    const blob = await getBlob(imageUri);
    formData.append('imagem', blob, 'raio_x.jpg');
  } else {
    formData.append('imagem', { uri: imageUri, name: 'raio_x.jpg', type: 'image/jpeg' } as any);
  }
  return formData;
}

async function chamarPythonDireto(imageUri: string): Promise<Radiografia> {
  const formData = new FormData();
  // Python API espera o campo "file"
  if (Platform.OS === 'web') {
    const blob = await getBlob(imageUri);
    formData.append('file', blob, 'raio_x.jpg');
  } else {
    formData.append('file', { uri: imageUri, name: 'raio_x.jpg', type: 'image/jpeg' } as any);
  }

  const response = await fetch(`${PYTHON_API_URL}/analisar-radiografia`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error(`Python API: ${response.status}`);

  const data = await response.json();
  // Mapeia resposta Python → tipo Radiografia
  return {
    id: 0,
    avaliacaoId: 0,
    resultadoIA: data.classificacao,
    confianca: data.confianca,
    densitometria: null,
    dataAnalise: new Date().toISOString().split('T')[0],
  };
}

export const visionService = {
  async analisarRaioX(imageUri: string, avaliacaoId: number): Promise<Radiografia> {
    const formData = await buildFormDataJava(imageUri);
    formData.append('avaliacaoId', String(avaliacaoId));

    try {
      // Tenta via Java backend (persiste no banco)
      const res = await api.post<Radiografia>('/radiografias/upload', formData, {
        headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return res.data;
    } catch {
      // Java falhou (provavelmente erro no repasse à Python API)
      // Chama Python diretamente para obter o resultado de IA
      return chamarPythonDireto(imageUri);
    }
  },
};
