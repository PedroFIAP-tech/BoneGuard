import React, { useCallback, useEffect, useState } from 'react';
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
import { colors } from '../../src/styles/theme';
import { styles } from './plano.styles';
import { PlanoSaude } from '../../src/types';

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
      // Tenta buscar planos existentes (cache do backend)
      let lista = await planoService.buscarPorPaciente(paciente.id);

      // Se não tiver planos, busca última avaliação e gera
      if (lista.length === 0) {
        const historico = await avaliacaoService.buscarHistorico(paciente.id);
        const avaliacoes = historico.avaliacoes ?? [];
        if (avaliacoes.length > 0) {
          const ultima = avaliacoes[avaliacoes.length - 1];
          setUltimaClassificacao(ultima.classificacao);
          lista = await planoService.gerarPlanos(ultima.id);
        }
      } else {
        // Pega classificação da última avaliação para o badge
        try {
          const historico = await avaliacaoService.buscarHistorico(paciente.id);
          const avaliacoes = historico.avaliacoes ?? [];
          if (avaliacoes.length > 0) {
            setUltimaClassificacao(avaliacoes[avaliacoes.length - 1].classificacao);
          }
        } catch {
          // não bloqueia se falhar
        }
      }

      setPlanos(lista);
    } catch {
      // silencia — lista permanece vazia
    } finally {
      setIsLoading(false);
    }
  }, [paciente]);

  useEffect(() => {
    carregarPlanos();
  }, [carregarPlanos]);

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
                <Text style={styles.itemDescricao}>{plano.descricao}</Text>
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
                <Text style={styles.itemDescricao}>{plano.descricao}</Text>
                <Text style={styles.itemData}>Gerado em {plano.dataCriacao}</Text>
              </Card>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
