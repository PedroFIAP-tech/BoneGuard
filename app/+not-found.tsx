import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../src/styles/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Página não encontrada</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ir para o início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 20 },
  title: { fontSize: 20, fontFamily: fonts.heading, color: colors.text },
  link: { marginTop: 20 },
  linkText: { fontSize: 14, color: colors.accent2, fontFamily: fonts.body },
});
