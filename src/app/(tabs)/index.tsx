import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { avaliacaoService } from '@/services/avaliacaoService';
import { Avaliacao } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { colors } from '@/styles/theme';
import { styles } from '@/styles/index.styles';

const ATALHOS = [
  { label: 'Avaliar risco', icon: '📋', route: '/(tabs)/questionario' },
  { label: 'Analisar raio-X', icon: '🦴', route: '/upload-raio-x' },
  { label: 'Ver resultado', icon: '📊', route: '/resultado' },
  { label: 'Meu plano', icon: '💪', route: '/(tabs)/plano' },
];

export default function HomeScreen() {
  const { paciente } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ultima = avaliacoes[0] ?? null;
  const historicoExibicao = avaliacoes.slice(0, 5).reverse();

  const fetchData = async () => {
    if (!paciente) return;
    setError(null);
    try {
      const result = await avaliacaoService.buscarHistorico(paciente.id);
      setAvaliacoes(result.avaliacoes ?? []);
    } catch {
      setError('Não foi possível carregar as avaliações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [paciente])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const iniciais = paciente?.nome
    ? paciente.nome
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'BG';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.name}>{paciente?.nome?.split(' ')[0] ?? 'Paciente'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
      </View>

      {/* Score Card */}
      <Card style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Risco de Osteoporose</Text>
        {ultima ? (
          <View style={styles.scoreContent}>
            <ScoreRing score={ultima.scoreRisco} size={140} />
            <View style={styles.scoreInfo}>
              <Badge label={ultima.classificacao} variant={ultima.classificacao} />
              <Text style={styles.scoreDate}>
                Avaliação em {new Date(ultima.dataAvaliacao).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.scoreDesc} numberOfLines={3}>
                {ultima.classificacao === 'BAIXO'
                  ? 'Baixo risco. Continue mantendo seus hábitos saudáveis.'
                  : ultima.classificacao === 'MODERADO'
                    ? 'Risco moderado detectado. Veja seu plano personalizado.'
                    : 'Risco elevado. Consulte um especialista e siga o plano.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noScore}>
            <Text style={styles.noScoreText}>Pronto para descobrir?</Text>
            <Text style={styles.noScoreSubtext}>
              Faça o questionário ou envie um raio-X para receber seu diagnóstico ósseo gratuito.
            </Text>
          </View>
        )}
      </Card>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Atalhos */}
      <Text style={styles.sectionTitle}>O que você quer fazer?</Text>
      <View style={styles.grid}>
        {ATALHOS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.gridItem}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.gridIcon}>{item.icon}</Text>
            <Text style={styles.gridLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Histórico de Evolução */}
      {historicoExibicao.length > 1 && (
        <>
          <Text style={styles.sectionTitle}>Evolução do score</Text>
          <Card>
            <View style={styles.barChart}>
              {historicoExibicao.map((av, i) => {
                const barColor =
                  av.classificacao === 'BAIXO'
                    ? colors.accent3
                    : av.classificacao === 'MODERADO'
                      ? colors.warn
                      : colors.danger;
                return (
                  <View key={av.id} style={styles.barItem}>
                    <Text style={styles.barValue}>{av.scoreRisco}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { height: `${av.scoreRisco}%`, backgroundColor: barColor },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{i + 1}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  );
}
