import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from './theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  back: { marginBottom: 16 },
  backText: { fontFamily: fonts.body, fontSize: 14, color: colors.accent2 },
  backLink: { fontFamily: fonts.body, fontSize: 14, color: colors.accent2 },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 4 },
  date: { fontFamily: fonts.body, fontSize: 12, color: colors.text3, marginBottom: 24 },
  scoreCard: { marginBottom: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreInfo: { flex: 1, gap: 10 },
  scoreLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.text3 },
  scoreDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.text2, lineHeight: 18 },
  iaCard: { marginBottom: 16, backgroundColor: colors.bg3 },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: colors.text2,
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  iaText: { fontFamily: fonts.body, fontSize: 13, color: colors.text, lineHeight: 20 },
  detalhesCard: { marginBottom: 24, gap: 16 },
  barItem: { gap: 8 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.text2 },
  barValue: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.danger },
  planoBtn: {},
});
