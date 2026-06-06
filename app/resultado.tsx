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
import { Avaliacao, Radiografia } from '../src/types';
import { ScoreRing } from '../src/components/ui/ScoreRing';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { colors } from '../src/styles/theme';
import { styles } from '../src/styles/resultado.styles';

function classificacaoColor(resultado: string): string {
  const r = resultado.toLowerCase();
  if (r === 'normal') return colors.accent3;
  if (r.includes('osteopenia')) return colors.warn;
  if (r.includes('osteoporose') || r.includes('osteoporosis')) return colors.danger;
  if (r === 'suspeito') return colors.warn;
  return colors.accent2;
}

function classificacaoPtBR(resultado: string): string {
  const r = resultado.toLowerCase();
  if (r === 'normal') return 'Normal';
  if (r.includes('osteopenia')) return 'Osteopenia';
  if (r.includes('osteoporose') || r.includes('osteoporosis')) return 'Osteoporose';
  if (r === 'suspeito') return 'Suspeito';
  return resultado;
}

function RaioxCard({ radiografia }: { radiografia: Radiografia }) {
  const cor = classificacaoColor(radiografia.resultadoIA);
  const label = classificacaoPtBR(radiografia.resultadoIA);
  const pct = Math.round(radiografia.confianca * 100);

  return (
    <Card style={styles.raioxCard}>
      <Text style={styles.sectionTitle}>🦴 Análise de Raio-X (IA)</Text>
      <View style={styles.raioxHeader}>
        <Text style={[styles.raioxClassificacao, { color: cor }]}>{label}</Text>
        <Text style={[styles.raioxConfiancaVal, { color: cor }]}>{pct}% confiança</Text>
      </View>
      <View style={styles.raioxConfiancaRow}>
        <Text style={styles.raioxConfiancaLabel}>Precisão do modelo</Text>
      </View>
      <ProgressBar progress={radiografia.confianca} color={cor} />
      {radiografia.densitometria != null && (
        <Text style={styles.raioxDensito}>
          Densitometria estimada: {radiografia.densitometria.toFixed(1)} T-score
        </Text>
      )}
    </Card>
  );
}

export default function ResultadoScreen() {
  const { avaliacaoId, radiografia: radiografiaParam } = useLocalSearchParams<{
    avaliacaoId: string;
    radiografia?: string;
  }>();
  const radiografia: Radiografia | null = radiografiaParam ? JSON.parse(radiografiaParam) : null;
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

      {/* Análise do raio-X pelo modelo de IA */}
      {radiografia && <RaioxCard radiografia={radiografia} />}

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
