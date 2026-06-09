import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { pacienteService } from '../src/services/pacienteService';
import { authService } from '../src/services/authService';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { showAlert, showConfirm } from '../src/utils/alert';
import { colors } from '../src/styles/theme';
import { styles } from '../src/styles/editar-perfil.styles';

const NIVEL_OPTIONS: { label: string; value: 'SEDENTARIO' | 'MODERADO' | 'ATIVO' }[] = [
  { label: 'Sedentário', value: 'SEDENTARIO' },
  { label: 'Moderado', value: 'MODERADO' },
  { label: 'Ativo', value: 'ATIVO' },
];

const SEXO_OPTIONS: { label: string; value: 'M' | 'F' }[] = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
];

export default function EditarPerfilScreen() {
  const { paciente, setPaciente, logout } = useAuth();

  const [nome, setNome] = useState(paciente?.nome ?? '');
  const [idade, setIdade] = useState(paciente?.idade?.toString() ?? '');
  const [peso, setPeso] = useState(paciente?.peso?.toString() ?? '');
  const [sexo, setSexo] = useState<'M' | 'F'>(paciente?.sexo ?? 'M');
  const [nivelAtividade, setNivelAtividade] = useState<'SEDENTARIO' | 'MODERADO' | 'ATIVO'>(
    paciente?.nivelAtividade ?? 'SEDENTARIO',
  );
  const [historicoFamiliar, setHistoricoFamiliar] = useState(paciente?.historicoFamiliar ?? false);
  const [alimentacaoCalcio, setAlimentacaoCalcio] = useState(paciente?.alimentacaoCalcio ?? false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!nome.trim()) { setError('Informe seu nome.'); return; }
    const idadeNum = parseInt(idade, 10);
    if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) { setError('Idade inválida.'); return; }
    const pesoNum = parseFloat(peso.replace(',', '.'));
    if (isNaN(pesoNum) || pesoNum < 1) { setError('Peso inválido.'); return; }

    try {
      setSaving(true);
      const atualizado = await pacienteService.atualizar(paciente!.id, {
        nome: nome.trim(),
        idade: idadeNum,
        peso: pesoNum,
        sexo,
        nivelAtividade,
        historicoFamiliar,
        alimentacaoCalcio,
      });
      setPaciente(atualizado);
      showAlert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch {
      setError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Excluir conta',
      'Tem certeza? Esta ação é irreversível e todos os seus dados serão apagados permanentemente.',
      async () => {
        try {
          setDeleting(true);
          await pacienteService.deletar(paciente!.id);
          await authService.logout();
          logout();
        } catch {
          setDeleting(false);
          showAlert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
        }
      },
      'Excluir',
      'Cancelar',
    );
  };

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.toggleTrack, { backgroundColor: value ? colors.accent : colors.card }]}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.toggleThumb,
          { alignSelf: value ? 'flex-end' : 'flex-start' },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      {/* Dados básicos */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
        <View style={styles.fieldGap}>
          <Input
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            placeholder="Seu nome"
          />
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Idade"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                placeholder="Ex: 35"
                maxLength={3}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Peso (kg)"
                value={peso}
                onChangeText={setPeso}
                keyboardType="decimal-pad"
                placeholder="Ex: 70"
                maxLength={6}
              />
            </View>
          </View>

          {/* Sexo */}
          <View>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.optionRow}>
              {SEXO_OPTIONS.map((op) => (
                <TouchableOpacity
                  key={op.value}
                  style={[styles.option, sexo === op.value && styles.optionActive]}
                  onPress={() => setSexo(op.value)}
                >
                  <Text style={[styles.optionText, sexo === op.value && styles.optionTextActive]}>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* Saúde */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>SAÚDE E ESTILO DE VIDA</Text>

        {/* Nível de atividade */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Nível de atividade física</Text>
          <View style={styles.optionRow}>
            {NIVEL_OPTIONS.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={[styles.option, nivelAtividade === op.value && styles.optionActive]}
                onPress={() => setNivelAtividade(op.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    nivelAtividade === op.value && styles.optionTextActive,
                  ]}
                >
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Histórico familiar de osteoporose</Text>
          <Toggle value={historicoFamiliar} onToggle={() => setHistoricoFamiliar((v) => !v)} />
        </View>
        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.toggleLabel}>Alimentação rica em cálcio</Text>
          <Toggle value={alimentacaoCalcio} onToggle={() => setAlimentacaoCalcio((v) => !v)} />
        </View>
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {saving ? (
        <ActivityIndicator color={colors.accent} style={{ marginVertical: 12 }} />
      ) : (
        <Button title="Salvar alterações" onPress={handleSave} style={styles.saveBtn} />
      )}

      {deleting ? (
        <ActivityIndicator color={colors.danger} style={{ marginTop: 16 }} />
      ) : (
        <Button
          title="Excluir minha conta"
          onPress={handleDelete}
          variant="danger"
          style={styles.deleteBtn}
        />
      )}
    </ScrollView>
  );
}
