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
import { styles } from './login.styles';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Staggered entrance animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(logoTranslate, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(formTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha o e-mail e a senha para continuar.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), senha);
    } catch (error: any) {
      const msg =
        error.response?.status === 401
          ? 'E-mail não encontrado ou senha incorreta. Tente de novo.'
          : error.response?.data?.message ?? 'Algo deu errado. Tente novamente em instantes.';
      Alert.alert('Não foi possível entrar', msg);
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
        {/* Hero area com gradiente */}
        <View style={styles.heroArea}>
          <LinearGradient
            colors={['rgba(58,155,220,0.08)', 'transparent']}
            style={styles.heroBg}
          />

          <Animated.View
            style={[
              styles.logoWrapper,
              { opacity: logoOpacity, transform: [{ translateY: logoTranslate }] },
            ]}
          >
            <LinearGradient
              colors={[colors.bg3, colors.card2]}
              style={styles.logoGradient}
            >
              <View style={styles.logoInner}>
                <Text style={styles.logoLetter}>B</Text>
                <View style={styles.logoDivider} />
                <Text style={styles.logoLetter}>G</Text>
              </View>
            </LinearGradient>
            <View style={styles.logoOrbit} />
          </Animated.View>

          <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center' }}>
            <Text style={styles.appName}>BoneGuard</Text>
            <Text style={styles.tagline}>
              Monitore a saúde dos seus ossos{'\n'}com precisão de astronauta
            </Text>
          </Animated.View>
        </View>

        {/* Formulário */}
        <Animated.View
          style={[
            styles.formCard,
            { opacity: formOpacity, transform: [{ translateY: formTranslate }] },
          ]}
        >
          <Text style={styles.formTitle}>Acessar minha conta</Text>

          <View style={styles.fields}>
            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="seu@email.com"
              returnKeyType="next"
            />
            <Input
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="Mínimo 8 caracteres"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.loadingText}>Verificando credenciais...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.btnPrimary, (!email || !senha) && styles.btnDisabled]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={!email || !senha}
            >
              <LinearGradient
                colors={[colors.accent, colors.accent2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnPrimaryText}>Entrar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.btnOutline}
            activeOpacity={0.75}
            onPress={() => router.push('/(auth)/cadastro')}
          >
            <Text style={styles.btnOutlineText}>Criar minha conta grátis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotArea}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Rodapé */}
        <Text style={styles.footer}>
          Tecnologia baseada nos protocolos de saúde óssea da NASA
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
