import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { planoService } from '../../src/services/planoService';
import { avaliacaoService } from '../../src/services/avaliacaoService';
import { Badge } from '../../src/components/ui/Badge';
import { Card } from '../../src/components/ui/Card';
import { colors, fonts } from '../../src/styles/theme';
import { styles } from '../../src/styles/plano.styles';
import { PlanoSaude } from '../../src/types';

const EXERCICIO_ICONS = ['🏋️', '🚴', '🧘', '🚶', '⚖️', '💪', '🏃'];
const NUTRICAO_ICONS  = ['🥛', '☀️', '🥩', '🫐', '🐟', '💊', '🥦'];

const GARBAGE_PATTERNS = [
  /^(nome|idade|sexo|peso|atividade|histórico familiar|cálcio na dieta|data|score|classificação)\s*:/i,
  /^(perfil do paciente|histórico de avaliações)/i,
  /paciente id=/i,
  /^com base nos resultados da busca/i,
  /^podemos gerar um plano/i,
];

function isGarbage(line: string): boolean {
  const content = line.trim().replace(/^[*\-+]\s+/, '');
  return GARBAGE_PATTERNS.some((p) => p.test(content));
}

function parseBullets(descricao: string): { bullets: string[]; intro: string } {
  const linhas = descricao.split('\n').filter((l) => !isGarbage(l));
  const bullets: string[] = [];
  const introParts: string[] = [];

  for (const linha of linhas) {
    const t = linha.trim();
    if (t.startsWith('* ') || t.startsWith('- ')) {
      bullets.push(t.slice(2).trim());
    } else if (bullets.length === 0 && t && !t.startsWith('**') && !t.startsWith('+')) {
      introParts.push(t);
    }
  }

  return { bullets, intro: introParts.join(' ') };
}

function PlanoConteudo({ descricao, categoria }: { descricao: string; categoria: string }) {
  const { bullets: allBullets, intro } = parseBullets(descricao);
  const bullets = allBullets.slice(0, 7);

  if (categoria === 'EXERCICIO') {
    return (
      <View style={{ gap: 10 }}>
        {!!intro && (
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text3, lineHeight: 19, fontStyle: 'italic' }}>
            {intro}
          </Text>
        )}
        {bullets.map((item, i) => {
          const commaIdx = item.indexOf(',');
          const hasTitle = commaIdx > 0 && commaIdx < 55;
          const titulo = hasTitle ? item.slice(0, commaIdx).trim() : item;
          const detalhe = hasTitle ? item.slice(commaIdx + 1).trim() : '';
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.bg2, borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.accent }}>
              <Text style={{ fontSize: 22, lineHeight: 28 }}>{EXERCICIO_ICONS[i % EXERCICIO_ICONS.length]}</Text>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, lineHeight: 20 }}>{titulo}</Text>
                {!!detalhe && <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.text2, lineHeight: 18 }}>{detalhe}</Text>}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // Nutrição — lista fluida sem cards pesados
  return (
    <View style={{ gap: 0 }}>
      {!!intro && (
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text3, lineHeight: 19, fontStyle: 'italic', marginBottom: 12 }}>
          {intro}
        </Text>
      )}
      {bullets.map((item, i) => {
        const colonIdx = item.indexOf(':');
        const hasLabel = colonIdx > 0 && colonIdx < 40;
        const label = hasLabel ? item.slice(0, colonIdx).trim() : null;
        const valor = hasLabel ? item.slice(colonIdx + 1).trim() : item;
        return (
          <View key={i}>
            {i > 0 && <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <Text style={{ fontSize: 18, lineHeight: 24, marginTop: 1 }}>{NUTRICAO_ICONS[i % NUTRICAO_ICONS.length]}</Text>
              <View style={{ flex: 1 }}>
                {label && (
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, lineHeight: 20 }}>{label}</Text>
                )}
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text2, lineHeight: 20 }}>{valor}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function PlanoScreen() {
  const { paciente } = useAuth();
  const [planos, setPlanos] = useState<PlanoSaude[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'exercicios' | 'nutricao'>('exercicios');
  const [ultimaClassificacao, setUltimaClassificacao] = useState<'BAIXO' | 'MODERADO' | 'ALTO' | null>(null);

  const carregarPlanos = useCallback(async () => {
    if (!paciente) return;
    try {
      const historico = await avaliacaoService.buscarHistorico(paciente.id);
      const avaliacoes = historico.avaliacoes ?? [];

      if (avaliacoes.length === 0) {
        setPlanos([]);
        return;
      }

      const ultima = avaliacoes[0];
      setUltimaClassificacao(ultima.classificacao);

      // Tenta gerar plano para a avaliação mais recente se ainda não foi gerado
      if (!ultima.planoGerado) {
        try {
          const novos = await planoService.gerarPlanos(ultima.id);
          setPlanos(novos);
          return;
        } catch {
          // Geração falhou — cai para mostrar planos anteriores
        }
      }

      // Busca todos os planos e filtra pela avaliação mais recente com plano
      const todos = await planoService.buscarPorPaciente(paciente.id);
      const ultimaComPlano = avaliacoes.find((a) => a.planoGerado);
      if (ultimaComPlano) {
        setPlanos(todos.filter((p) => p.avaliacaoId === ultimaComPlano.id));
      } else {
        setPlanos(todos);
      }
    } catch {
      // silencia
    } finally {
      setIsLoading(false);
    }
  }, [paciente]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      carregarPlanos();
    }, [carregarPlanos])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarPlanos();
    setRefreshing(false);
  }, [carregarPlanos]);

  const exercicios = planos.filter((p) => p.categoria === 'EXERCICIO');
  const nutricao = planos.filter((p) => p.categoria === 'NUTRICAO');

  if (isLoading) {
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
    >
      <Text style={styles.title}>Plano de Saúde</Text>

      {ultimaClassificacao && (
        <View style={styles.badge}>
          <Badge label={ultimaClassificacao} variant={ultimaClassificacao} />
          <Text style={styles.badgeLabel}>Baseado na sua última avaliação</Text>
        </View>
      )}

      {/* Abas */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'exercicios' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('exercicios')}
        >
          <Text style={[styles.tabLabel, abaAtiva === 'exercicios' && styles.tabLabelAtiva]}>
            Exercícios ({exercicios.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'nutricao' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('nutricao')}
        >
          <Text style={[styles.tabLabel, abaAtiva === 'nutricao' && styles.tabLabelAtiva]}>
            Nutrição ({nutricao.length})
          </Text>
        </TouchableOpacity>
      </View>

      {abaAtiva === 'exercicios' && (
        <View style={styles.lista}>
          {exercicios.length === 0 ? (
            <Text style={styles.semDados}>Nenhum plano de exercícios disponível ainda.</Text>
          ) : (
            exercicios.map((plano) => (
              <Card key={plano.id} style={styles.itemCard}>
                <PlanoConteudo descricao={plano.descricao} categoria={plano.categoria} />
                <Text style={styles.itemData}>Gerado em {plano.dataCriacao}</Text>
              </Card>
            ))
          )}
        </View>
      )}

      {abaAtiva === 'nutricao' && (
        <View style={styles.lista}>
          {nutricao.length === 0 ? (
            <Text style={styles.semDados}>Nenhum plano nutricional disponível ainda.</Text>
          ) : (
            nutricao.map((plano) => (
              <Card key={plano.id} style={styles.itemCard}>
                <PlanoConteudo descricao={plano.descricao} categoria={plano.categoria} />
                <Text style={styles.itemData}>Gerado em {plano.dataCriacao}</Text>
              </Card>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
