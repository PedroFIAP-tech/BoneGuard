import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { showAlert } from '../../src/utils/alert';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { avaliacaoService } from '../../src/services/avaliacaoService';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/styles/theme';
import { styles } from '../../src/styles/questionario.styles';

interface QuestionarioRespostas {
  historicoFamiliar: boolean;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO';
  alimentacaoCalcio: boolean;
  exposicaoSolar: boolean;
  tabagismo: boolean;
  consumoCafeina: boolean;
  consumoAlcool: boolean;
}

interface Pergunta {
  id: keyof QuestionarioRespostas;
  texto: string;
  nasaInfo: string;
  opcoes: { label: string; value: any }[];
}

const PERGUNTAS: Pergunta[] = [
  {
    id: 'historicoFamiliar',
    texto: 'Alguém na sua família já teve osteoporose ou fraturou os ossos com frequência?',
    nasaInfo:
      'A NASA realiza triagem genética de risco familiar antes de cada missão — o histórico familiar é um dos fatores mais determinantes para a saúde óssea.',
    opcoes: [
      { label: 'Sim, tenho histórico familiar', value: true },
      { label: 'Não que eu saiba', value: false },
    ],
  },
  {
    id: 'nivelAtividade',
    texto: 'Como você descreveria seu nível de atividade física no dia a dia?',
    nasaInfo:
      'Astronautas fazem 2h de exercício diário em órbita para evitar perder até 1% da densidade óssea por mês. Na Terra, menos atividade = mais risco.',
    opcoes: [
      { label: 'Sedentário — fico mais parado', value: 'SEDENTARIO' },
      { label: 'Moderado — me exercito às vezes', value: 'MODERADO' },
      { label: 'Ativo — pratico exercícios regularmente', value: 'ATIVO' },
    ],
  },
  {
    id: 'alimentacaoCalcio',
    texto: 'Você consome alimentos ricos em cálcio regularmente (leite, queijo, brócolis)?',
    nasaInfo:
      'A NASA suplementa astronautas com 1.000mg de cálcio/dia. Sem cálcio suficiente, o corpo "rouba" dos próprios ossos para manter outras funções.',
    opcoes: [
      { label: 'Sim, faz parte da minha rotina', value: true },
      { label: 'Não, consumo pouco ou nenhum', value: false },
    ],
  },
  {
    id: 'exposicaoSolar',
    texto: 'Você costuma tomar sol por pelo menos 15 minutos por dia?',
    nasaInfo:
      'Em missões espaciais, a falta de luz solar é crítica: sem UV, o corpo não produz vitamina D, essencial para absorver o cálcio dos alimentos.',
    opcoes: [
      { label: 'Sim, costumo tomar sol diariamente', value: true },
      { label: 'Não, fico pouco exposto ao sol', value: false },
    ],
  },
  {
    id: 'tabagismo',
    texto: 'Você fuma ou já fumou no passado?',
    nasaInfo:
      'O tabagismo é proibido na NASA: nicotina reduz a absorção de cálcio e pode acelerar a perda óssea em até 25% ao longo da vida.',
    opcoes: [
      { label: 'Sim, fumo ou já fumei', value: true },
      { label: 'Nunca fumei', value: false },
    ],
  },
  {
    id: 'consumoCafeina',
    texto: 'Você consome mais de 3 xícaras de café ou bebidas com cafeína por dia?',
    nasaInfo:
      'A cafeína em excesso aumenta a excreção de cálcio pela urina, reduzindo a disponibilidade do mineral para os ossos.',
    opcoes: [
      { label: 'Sim, consumo bastante cafeína', value: true },
      { label: 'Não, consumo pouco ou nada', value: false },
    ],
  },
  {
    id: 'consumoAlcool',
    texto: 'Você consome bebidas alcoólicas com frequência (mais de 2x por semana)?',
    nasaInfo:
      'O álcool interfere na absorção de cálcio e vitamina D, e pode prejudicar as células responsáveis pela formação óssea.',
    opcoes: [
      { label: 'Sim, bebo com frequência', value: true },
      { label: 'Não, bebo raramente ou nunca', value: false },
    ],
  },
];

function calcularScore(r: QuestionarioRespostas): number {
  let score = 0;
  if (r.historicoFamiliar) score += 25;
  if (r.nivelAtividade === 'SEDENTARIO') score += 20;
  else if (r.nivelAtividade === 'MODERADO') score += 10;
  if (r.consumoCafeina) score += 10;
  if (r.tabagismo) score += 15;
  if (r.consumoAlcool) score += 10;
  if (!r.alimentacaoCalcio) score += 10;
  if (!r.exposicaoSolar) score += 10;
  return Math.min(score, 100);
}

export default function QuestionarioScreen() {
  const { paciente } = useAuth();
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<Partial<QuestionarioRespostas>>({});
  const [loading, setLoading] = useState(false);

  const perguntaAtual = PERGUNTAS[step];
  const progresso = (step + 1) / PERGUNTAS.length;
  const respostaAtual = respostas[perguntaAtual.id];

  const selecionar = (value: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: value }));
  };

  const avancar = async () => {
    if (respostaAtual === undefined) {
      showAlert('Escolha uma opção', 'Selecione uma resposta antes de continuar.');
      return;
    }

    if (step < PERGUNTAS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    if (!paciente) return;
    setLoading(true);
    try {
      const r = respostas as QuestionarioRespostas;
      const scoreRisco = calcularScore(r);
      const avaliacao = await avaliacaoService.criar({ pacienteId: paciente.id, scoreRisco });
      router.push({ pathname: '/resultado', params: { avaliacaoId: avaliacao.id } });
    } catch (error: any) {
      showAlert(
        'Erro ao salvar',
        error.response?.data?.message ?? 'Não foi possível registrar sua avaliação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Seu perfil de risco ósseo</Text>

      <View style={styles.progressArea}>
        <ProgressBar progress={progresso} />
        <Text style={styles.progressText}>
          {step + 1} de {PERGUNTAS.length}
        </Text>
      </View>

      <Card style={styles.nasaCard}>
        <Text style={styles.nasaTag}>🚀 Protocolo NASA</Text>
        <Text style={styles.nasaText}>{perguntaAtual.nasaInfo}</Text>
      </Card>

      <Text style={styles.pergunta}>{perguntaAtual.texto}</Text>

      <View style={styles.opcoes}>
        {perguntaAtual.opcoes.map((op) => {
          const selecionado = respostaAtual === op.value;
          return (
            <TouchableOpacity
              key={String(op.value)}
              style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
              activeOpacity={0.7}
              onPress={() => selecionar(op.value)}
            >
              <View style={[styles.radio, selecionado && styles.radioAtivo]}>
                {selecionado && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.opcaoLabel, selecionado && styles.opcaoLabelAtiva]}>
                {op.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        {step > 0 && (
          <Button
            title="Voltar"
            onPress={() => setStep((s) => s - 1)}
            variant="outline"
            style={{ flex: 1 }}
          />
        )}
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Button
            title={step === PERGUNTAS.length - 1 ? 'Finalizar' : 'Próxima'}
            onPress={avancar}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </ScrollView>
  );
}
