import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { avaliacaoService } from '../src/services/avaliacaoService';
import { Avaliacao } from '../src/types';
import { ScoreRing } from '../src/components/ui/ScoreRing';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { colors } from '../src/styles/theme';
import { styles } from '../src/styles/resultado.styles';

export default function ResultadoScreen() {
  const { avaliacaoId } = useLocalSearchParams<{ avaliacaoId: string }>();
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!avaliacaoId) return;
      try {
        const data = await avaliacaoService.buscarPorId(Number(avaliacaoId));
        setAvaliacao(data);
      } catch {
        setError('Não foi possível carregar o resultado.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [avaliacaoId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !avaliacao) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Avaliação não encontrada.'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const densidadeScore = 100 - avaliacao.scoreRisco;
  const fatoresScore = avaliacao.scoreRisco;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Seu diagnóstico ósseo</Text>
      <Text style={styles.date}>
        {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Text>

      {/* Score principal */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <ScoreRing score={avaliacao.scoreRisco} size={150} />
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Risco calculado</Text>
            <Badge label={avaliacao.classificacao} variant={avaliacao.classificacao} />
            <Text style={styles.scoreDesc}>
              {avaliacao.classificacao === 'BAIXO'
                ? 'Seus ossos estão em ótimo estado. Mantenha os hábitos saudáveis e continue monitorando.'
                : avaliacao.classificacao === 'MODERADO'
                  ? 'Há pontos de atenção, mas tudo tem solução. Seu plano personalizado foi criado para isso.'
                  : 'Detectamos sinais importantes. Siga o plano e consulte um especialista — prevenção funciona.'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Explicação baseada na classificação */}
      <Card style={styles.iaCard}>
        <Text style={styles.sectionTitle}>🤖 O que a IA encontrou</Text>
        <Text style={styles.iaText}>
          {avaliacao.classificacao === 'BAIXO'
            ? 'Sua análise indica baixo risco de osteoporose. Seus hábitos estão contribuindo positivamente para a saúde óssea. Continue monitorando regularmente e mantenha a rotina saudável.'
            : avaliacao.classificacao === 'MODERADO'
              ? 'Foram identificados fatores de risco moderado. Com as recomendações do seu plano personalizado e acompanhamento médico, é possível reverter ou estabilizar esse quadro.'
              : 'Foram detectados fatores de risco elevado para osteoporose. É fundamental seguir o plano de saúde gerado e consultar um especialista o quanto antes para avaliação clínica.'}
        </Text>
      </Card>

      {/* Detalhamento em barras */}
      <Card style={styles.detalhesCard}>
        <Text style={styles.sectionTitle}>Detalhamento</Text>

        <View style={styles.barItem}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>Densidade óssea</Text>
            <Text style={styles.barValue}>{densidadeScore}%</Text>
          </View>
          <ProgressBar progress={densidadeScore / 100} color={colors.accent3} />
        </View>

        <View style={styles.barItem}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>Fatores de risco</Text>
            <Text style={styles.barValue}>{fatoresScore}%</Text>
          </View>
          <ProgressBar
            progress={fatoresScore / 100}
            color={
              fatoresScore <= 35
                ? colors.accent3
                : fatoresScore <= 65
                  ? colors.warn
                  : colors.danger
            }
          />
        </View>

        <View style={styles.barItem}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>Score geral</Text>
            <Text style={styles.barValue}>{avaliacao.scoreRisco}/100</Text>
          </View>
          <ProgressBar
            progress={avaliacao.scoreRisco / 100}
            color={
              avaliacao.scoreRisco <= 35
                ? colors.accent3
                : avaliacao.scoreRisco <= 65
                  ? colors.warn
                  : colors.danger
            }
          />
        </View>
      </Card>

      <Button
        title="Ver meu plano de saúde personalizado"
        onPress={() => router.push('/(tabs)/plano')}
        style={styles.planoBtn}
      />
    </ScrollView>
  );
}
