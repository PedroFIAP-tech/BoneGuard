import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { visionService } from '../src/services/visionService';
import { avaliacaoService } from '../src/services/avaliacaoService';
import { useAuth } from '../src/context/AuthContext';
import { storage } from '../src/utils/storage';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { Card } from '../src/components/ui/Card';
import { colors, fonts } from '../src/styles/theme';
import { styles } from '../src/styles/upload-raio-x.styles';

const MENSAGENS = ['Baixando imagem...', 'Detectando densidade óssea...', 'Gerando diagnóstico...'];

export default function UploadRaioXScreen() {
  const { avaliacaoId } = useLocalSearchParams<{ avaliacaoId: string }>();
  const { paciente } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const buscarAvaliacaoExistente = async (): Promise<number | null> => {
    if (avaliacaoId) return Number(avaliacaoId);
    const historico = await avaliacaoService.buscarHistorico(paciente!.id);
    return historico.avaliacoes?.[0]?.id ?? null;
  };

  const analisarExemplo = async () => {
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
      const [idAvaliacao, radiografia] = await Promise.all([
        buscarAvaliacaoExistente(),
        visionService.analisarExemplo(),
      ]);
      await storage.setItem('boneguard_ultima_radiografia', JSON.stringify(radiografia));
      clearInterval(intervalo);
      setProgresso(1);
      const params: Record<string, string> = { radiografia: JSON.stringify(radiografia), source: 'raio-x' };
      if (idAvaliacao) params.avaliacaoId = String(idAvaliacao);
      router.push({ pathname: '/resultado', params });
    } catch (error: any) {
      clearInterval(intervalo);
      Alert.alert('Erro', error?.message ?? 'Não foi possível analisar o exemplo.');
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
        Nossa IA detecta a densidade óssea em segundos — como a NASA faz com astronautas.
      </Text>

      {/* Botão principal */}
      {!loading && (
        <TouchableOpacity
          style={[styles.uploadBtn, {
            width: '100%',
            paddingVertical: 20,
            flexDirection: 'row',
            gap: 16,
            borderColor: colors.accent,
            borderWidth: 1.5,
          }]}
          activeOpacity={0.7}
          onPress={analisarExemplo}
        >
          <Text style={{ fontSize: 32 }}>🩻</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.uploadLabel, { fontSize: 16 }]}>Analisar raio-X de exemplo</Text>
            <Text style={styles.uploadSub}>Baixa uma imagem real e analisa com a IA</Text>
          </View>
        </TouchableOpacity>
      )}

      {loading && (
        <Card style={styles.loadingCard}>
          <Text style={styles.loadingMsg}>{MENSAGENS[msgIndex]}</Text>
          <ProgressBar progress={progresso} />
          <ActivityIndicator color={colors.accent} style={{ marginTop: 8 }} />
        </Card>
      )}

      {/* Em breve */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, opacity: 0.4 }}>
        <View style={[styles.uploadBtn, { flex: 1, paddingVertical: 14 }]}>
          <Text style={styles.uploadIcon}>📷</Text>
          <Text style={styles.uploadLabel}>Câmera</Text>
          <Text style={[styles.uploadSub, { color: colors.warn, fontSize: 10 }]}>Em breve</Text>
        </View>
        <View style={[styles.uploadBtn, { flex: 1, paddingVertical: 14 }]}>
          <Text style={styles.uploadIcon}>🖼️</Text>
          <Text style={styles.uploadLabel}>Galeria</Text>
          <Text style={[styles.uploadSub, { color: colors.warn, fontSize: 10 }]}>Em breve</Text>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🚀 Precisão de astronauta, para você</Text>
        <Text style={styles.infoText}>
          Nossa IA foi treinada com os mesmos protocolos usados pela NASA para monitorar a saúde óssea de astronautas — agora disponível como diagnóstico preventivo para qualquer pessoa.
        </Text>
      </Card>
    </View>
  );
}
