import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { showConfirm } from '@/utils/alert';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/styles/theme';
import { styles } from '@/styles/perfil.styles';

export default function PerfilScreen() {
  const { paciente, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    showConfirm(
      'Sair',
      'Deseja encerrar sua sessão?',
      async () => {
        setLoggingOut(true);
        await logout();
      },
      'Sair',
      'Cancelar',
    );
  };

  const iniciais = paciente?.nome
    ? paciente.nome
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'BG';

  const campos = [
    { label: 'Idade', valor: paciente?.idade ? `${paciente.idade} anos` : '-' },
    { label: 'Sexo', valor: paciente?.sexo === 'M' ? 'Masculino' : paciente?.sexo === 'F' ? 'Feminino' : '-' },
    { label: 'Peso', valor: paciente?.peso ? `${paciente.peso} kg` : '-' },
    { label: 'Atividade', valor: paciente?.nivelAtividade ?? '-' },
    { label: 'Histórico Familiar', valor: paciente?.historicoFamiliar ? 'Sim' : 'Não' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Avatar */}
      <View style={styles.avatarArea}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <Text style={styles.nome}>{paciente?.nome ?? 'Paciente'}</Text>
      </View>

      {/* Dados */}
      <Card style={styles.dadosCard}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>
        {campos.map((campo) => (
          <View key={campo.label} style={styles.campo}>
            <Text style={styles.campoLabel}>{campo.label}</Text>
            <Text style={styles.campoValor}>{campo.valor}</Text>
          </View>
        ))}
      </Card>

      {/* Atalhos */}
      <Card style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/sobre')}>
          <Text style={styles.menuLabel}>ℹ️  Sobre o BoneGuard</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/questionario')}
        >
          <Text style={styles.menuLabel}>📋  Nova avaliação</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/upload-raio-x')}>
          <Text style={styles.menuLabel}>🦴  Upload de Raio-X</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
      </Card>

      {loggingOut ? (
        <ActivityIndicator color={colors.danger} style={{ marginTop: 16 }} />
      ) : (
        <Button
          title="Sair da conta"
          onPress={handleLogout}
          variant="danger"
          style={{ marginTop: 8 }}
        />
      )}
    </ScrollView>
  );
}
