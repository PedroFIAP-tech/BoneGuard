import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { colors } from '../../src/styles/theme';
import { styles } from './cadastro.styles';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CadastroScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [historicoFamiliar, setHistoricoFamiliar] = useState(false);
  const [nivelAtividade, setNivelAtividade] = useState<'SEDENTARIO' | 'MODERADO' | 'ATIVO'>('MODERADO');
  const [alimentacaoCalcio, setAlimentacaoCalcio] = useState(false);
  const [loading, setLoading] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(formTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha || !idade || !peso) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para criar sua conta.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha muito curta', 'Escolha uma senha com pelo menos 6 caracteres.');
      return;
    }
    const idadeNum = Number(idade);
    if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) {
      Alert.alert('Idade inválida', 'Digite uma idade entre 1 e 120 anos.');
      return;
    }
    const pesoNum = Number(peso);
    if (isNaN(pesoNum) || pesoNum < 20 || pesoNum > 300) {
      Alert.alert('Peso inválido', 'Digite um peso entre 20 e 300 kg.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        sexo,
        idade: idadeNum,
        peso: pesoNum,
        historicoFamiliar,
        nivelAtividade,
        alimentacaoCalcio,
      });
    } catch (error: any) {
      const msg =
        error.response?.status === 409
          ? 'Este e-mail já está cadastrado. Tente fazer login.'
          : error.response?.data?.message ?? 'Não foi possível criar sua conta. Tente novamente.';
      Alert.alert('Erro ao criar conta', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.titleArea}>
            <LinearGradient
              colors={['rgba(58,155,220,0.12)', 'transparent']}
              style={styles.titleGlow}
            />
            <Text style={styles.title}>Criar minha conta</Text>
            <Text style={styles.subtitle}>
              Seu diagnóstico ósseo personalizado começa aqui
            </Text>
          </View>
        </Animated.View>

        {/* Formulário */}
        <Animated.View
          style={[
            styles.formCard,
            { opacity: formOpacity, transform: [{ translateY: formTranslate }] },
          ]}
        >
          {/* Dados pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Dados pessoais</Text>
            <Input
              label="Nome completo"
              value={nome}
              onChangeText={setNome}
              placeholder="Como você se chama?"
              autoCapitalize="words"
            />
            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="seu@email.com"
            />
            <Input
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="Mínimo 6 caracteres"
            />
          </View>

          {/* Sexo */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sexo biológico</Text>
            <Text style={styles.sectionHint}>Usado para calibrar o algoritmo de risco ósseo</Text>
            <View style={styles.rowBtns}>
              {(['M', 'F'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.selectBtn, sexo === s && styles.selectBtnAtivo]}
                  onPress={() => setSexo(s)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.selectBtnText, sexo === s && styles.selectBtnTextAtivo]}>
                    {s === 'M' ? '♂ Masculino' : '♀ Feminino'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Medidas */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Medidas corporais</Text>
            <View style={styles.duoRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Idade"
                  value={idade}
                  onChangeText={setIdade}
                  keyboardType="numeric"
                  placeholder="Ex: 34"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Peso (kg)"
                  value={peso}
                  onChangeText={setPeso}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 70"
                />
              </View>
            </View>
          </View>

          {/* Nível de atividade */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nível de atividade física</Text>
            <View style={styles.rowBtns}>
              {(['SEDENTARIO', 'MODERADO', 'ATIVO'] as const).map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.selectBtn, nivelAtividade === n && styles.selectBtnAtivo]}
                  onPress={() => setNivelAtividade(n)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.selectBtnText, nivelAtividade === n && styles.selectBtnTextAtivo]}>
                    {n === 'SEDENTARIO' ? 'Sedentário' : n === 'MODERADO' ? 'Moderado' : 'Ativo'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Histórico familiar */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Histórico familiar</Text>
            <TouchableOpacity
              style={[styles.toggleCard, historicoFamiliar && styles.toggleCardAtivo]}
              onPress={() => setHistoricoFamiliar((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleDot, historicoFamiliar && styles.toggleDotAtivo]} />
              <Text style={[styles.toggleText, historicoFamiliar && styles.toggleTextAtivo]}>
                Tenho histórico familiar de osteoporose
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alimentação com cálcio */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Consumo de cálcio</Text>
            <TouchableOpacity
              style={[styles.toggleCard, alimentacaoCalcio && styles.toggleCardAtivo]}
              onPress={() => setAlimentacaoCalcio((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleDot, alimentacaoCalcio && styles.toggleDotAtivo]} />
              <Text style={[styles.toggleText, alimentacaoCalcio && styles.toggleTextAtivo]}>
                Consumo cálcio adequado na minha dieta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botão */}
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.loadingText}>Criando sua conta...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={handleCadastro}
            >
              <LinearGradient
                colors={[colors.accent, colors.accent2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>Começar minha avaliação gratuita</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <Text style={styles.termos}>
            Ao criar sua conta, você concorda com os termos de uso e política de privacidade.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
