import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../src/styles/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 24 },
  avatarArea: { alignItems: 'center', marginBottom: 28, gap: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.heading, fontSize: 28, color: colors.accent2 },
  nome: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  dadosCard: { marginBottom: 16 },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 12,
    color: colors.text3,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  campo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  campoLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.text2 },
  campoValor: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  menuCard: { padding: 0, marginBottom: 24, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  menuChevron: { fontFamily: fonts.body, fontSize: 18, color: colors.text3 },
  divider: { height: 0.5, backgroundColor: colors.border, marginHorizontal: 16 },
});
