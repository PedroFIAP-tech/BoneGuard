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
import { visionService } from '../src/services/visionService';
import { avaliacaoService } from '../src/services/avaliacaoService';
import { useAuth } from '../src/context/AuthContext';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { colors } from '../src/styles/theme';
import { styles } from '../src/styles/upload-raio-x.styles';

const MENSAGENS = ['Enviando imagem...', 'Detectando densidade óssea...', 'Gerando diagnóstico...'];

export default function UploadRaioXScreen() {
  const { avaliacaoId } = useLocalSearchParams<{ avaliacaoId: string }>();
  const { paciente } = useAuth();
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
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const abrirGaleria = async () => {
    const ok = await solicitarPermissao('galeria');
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const analisar = async () => {
    if (!imageUri) return;
    if (!paciente) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      return;
    }

    setLoading(true);
    setProgresso(0);
    setMsgIndex(0);

    const intervalo = setInterval(() => {
      setProgresso((p) => (p >= 0.88 ? p : p + 0.1));
      setMsgIndex((i) => Math.min(i + 1, MENSAGENS.length - 1));
    }, 2800);

    try {
      // Se veio sem avaliacaoId (acesso direto pela home), usa a avaliação mais recente
      let idAvaliacao = avaliacaoId ? Number(avaliacaoId) : null;
      if (!idAvaliacao) {
        const historico = await avaliacaoService.buscarHistorico(paciente.id);
        const ultima = historico.avaliacoes?.[0];
        if (ultima) {
          idAvaliacao = ultima.id;
        } else {
          // Nenhuma avaliação existe ainda — cria uma base para vincular o raio-X
          const avaliacao = await avaliacaoService.criar({ pacienteId: paciente.id, scoreRisco: 0 });
          idAvaliacao = avaliacao.id;
        }
      }

      // Tenta analisar o raio-X — se a API de visão estiver fora, navega sem o resultado
      let radiografiaParam: string | undefined;
      try {
        const radiografia = await visionService.analisarRaioX(imageUri, idAvaliacao);
        radiografiaParam = JSON.stringify(radiografia);
      } catch {
        Alert.alert(
          'Serviço de imagem indisponível',
          'A análise do raio-X está temporariamente fora do ar. Seu questionário foi salvo — veja seu resultado abaixo.',
          [{ text: 'OK' }]
        );
      }

      clearInterval(intervalo);
      setProgresso(1);
      router.push({
        pathname: '/resultado',
        params: radiografiaParam
          ? { avaliacaoId: idAvaliacao, radiografia: radiografiaParam }
          : { avaliacaoId: idAvaliacao },
      });
    } catch (error: any) {
      clearInterval(intervalo);
      const msg =
        error.response?.data?.message ?? 'Não foi possível registrar a avaliação. Tente novamente.';
      Alert.alert('Erro', msg);
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
