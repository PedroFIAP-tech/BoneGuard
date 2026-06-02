import { api } from './api';

export const visionService = {
  async analisarRaioX(imageUri: string, avaliacaoId: number) {
    const formData = new FormData();
    formData.append('imagem', {
      uri: imageUri,
      name: 'raio_x.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('avaliacaoId', String(avaliacaoId));

    const res = await api.post('/radiografias/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return res.data;
  },
};
