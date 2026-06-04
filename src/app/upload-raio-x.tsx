import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { visionService } from '@/services/visionService';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/styles/theme';
import { styles } from '@/styles/upload-raio-x.styles';

const MENSAGENS = ['Enviando imagem...', 'Detectando densidade óssea...', 'Gerando diagnóstico...'];

export default function UploadRaioXScreen() {
  const { avaliacaoId } = useLocalSearchParams<{ avaliacaoId: string }>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const solicitarPermissao = async (tipo: 'camera' | 'galeria') => {
    if (tipo === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à câmera para continuar.');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para continuar.');
        return false;
      }
    }
    return true;
  };

  const abrirCamera = async () => {
    const ok = await solicitarPermissao('camera');
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const abrirGaleria = async () => {
    const ok = await solicitarPermissao('galeria');
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const analisar = async () => {
    if (!imageUri || !avaliacaoId) return;
    setLoading(true);
    setProgresso(0);
    setMsgIndex(0);

    const intervalo = setInterval(() => {
      setProgresso((p) => (p >= 0.88 ? p : p + 0.1));
      setMsgIndex((i) => Math.min(i + 1, MENSAGENS.length - 1));
    }, 2800);

    try {
      await visionService.analisarRaioX(imageUri, Number(avaliacaoId));
      clearInterval(intervalo);
      setProgresso(1);
      router.push({ pathname: '/resultado', params: { avaliacaoId } });
    } catch (error: any) {
      clearInterval(intervalo);
      const msg =
        error.response?.data?.message ?? 'Não foi possível analisar a imagem. Tente novamente.';
      Alert.alert('Erro na análise', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Análise de Raio-X</Text>
      <Text style={styles.subtitle}>
        Envie uma radiografia e nossa IA detecta a densidade óssea em segundos — como a NASA faz com astronautas.
      </Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          <TouchableOpacity style={styles.trocar} onPress={() => setImageUri(null)}>
            <Text style={styles.trocarText}>Trocar imagem</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7} onPress={abrirCamera}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadLabel}>Câmera</Text>
            <Text style={styles.uploadSub}>Fotografar raio-X</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7} onPress={abrirGaleria}>
            <Text style={styles.uploadIcon}>🖼️</Text>
            <Text style={styles.uploadLabel}>Galeria</Text>
            <Text style={styles.uploadSub}>Selecionar arquivo</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <Card style={styles.loadingCard}>
          <Text style={styles.loadingMsg}>{MENSAGENS[msgIndex]}</Text>
          <ProgressBar progress={progresso} />
          <ActivityIndicator color={colors.accent} style={{ marginTop: 8 }} />
        </Card>
      )}

      {imageUri && !loading && (
        <Button title="Analisar com IA" onPress={analisar} style={styles.analisarBtn} />
      )}

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🚀 Precisão de astronauta, para você</Text>
        <Text style={styles.infoText}>
          Nossa IA foi treinada com os mesmos protocolos usados pela NASA para monitorar a saúde óssea de astronautas — agora disponível como diagnóstico preventivo para qualquer pessoa.
        </Text>
      </Card>
    </View>
  );
}
