import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../src/styles/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  badgeLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.text3 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  tabAtiva: { backgroundColor: colors.accent },
  tabLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text3 },
  tabLabelAtiva: { color: '#fff' },
  lista: { gap: 12 },
  itemCard: { gap: 8 },
  itemDescricao: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  itemData: { fontFamily: fonts.body, fontSize: 11, color: colors.text3 },
  semDados: { fontFamily: fonts.body, fontSize: 13, color: colors.text3, textAlign: 'center', marginTop: 20 },
});
