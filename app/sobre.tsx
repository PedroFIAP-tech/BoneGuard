import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../src/components/ui/Card';
import { COMMIT_HASH, APP_VERSION } from '../src/utils/commitHash';
import { styles } from '../src/styles/sobre.styles';

const EQUIPE = [
  { nome: 'Pedro Henrique da Silva', rm: 'RM 560393', area: 'Mobile (React Native)' },
  { nome: 'Lucas Borges de Souza', rm: 'RM 560027', area: 'Back-end (Java/.NET)' },
  { nome: 'Bruno Carlos Soares', rm: 'RM 559250', area: 'IA + Arquitetura' },
];

const STACK = ['React Native', 'Expo Router', 'TypeScript', 'Axios + JWT', 'Expo SecureStore', 'react-native-svg'];

export default function SobreScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>BG</Text>
        </View>
        <Text style={styles.appName}>BoneGuard</Text>
        <Text style={styles.tagline}>Saúde óssea com ciência espacial</Text>
      </View>

      {/* Versão e commit */}
      <Card style={styles.versionCard}>
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>Versão</Text>
          <Text style={styles.versionValue}>{APP_VERSION}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>Commit</Text>
          <Text style={styles.commitHash}>{COMMIT_HASH}</Text>
        </View>
      </Card>

      {/* Equipe */}
      <Text style={styles.sectionTitle}>Equipe — 2TDSPS FIAP 2026</Text>
      {EQUIPE.map((membro) => (
        <Card key={membro.rm} style={styles.membroCard}>
          <View style={styles.membroAvatar}>
            <Text style={styles.membroAvatarText}>{membro.nome[0]}</Text>
          </View>
          <View>
            <Text style={styles.membroNome}>{membro.nome}</Text>
            <Text style={styles.membroRm}>{membro.rm}</Text>
            <Text style={styles.membroArea}>{membro.area}</Text>
          </View>
        </Card>
      ))}

      {/* Stack */}
      <Text style={styles.sectionTitle}>Stack de tecnologias</Text>
      <View style={styles.stackGrid}>
        {STACK.map((tech) => (
          <View key={tech} style={styles.stackTag}>
            <Text style={styles.stackTagText}>{tech}</Text>
          </View>
        ))}
      </View>

      {/* Sobre */}
      <Card style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>Sobre o projeto</Text>
        <Text style={styles.aboutText}>
          O BoneGuard é uma plataforma de saúde preventiva que detecta risco de osteoporose
          utilizando IA de visão computacional e protocolos de saúde óssea desenvolvidos pela NASA
          para monitoramento de astronautas, adaptados para uso clínico preventivo.
        </Text>
      </Card>

      <Text style={styles.footer}>Global Solution FIAP 2026</Text>
    </ScrollView>
  );
}
