import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from './theme';

export const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },

  header: { marginBottom: 28 },
  backBtn: { marginBottom: 20 },
  backText: { fontFamily: fonts.body, fontSize: 14, color: colors.accent2 },
  titleArea: { position: 'relative' },
  titleGlow: {
    position: 'absolute',
    top: -20,
    left: -40,
    right: -40,
    height: 120,
    borderRadius: 60,
  },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text, marginBottom: 8 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.text2, lineHeight: 20 },

  formCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    gap: 20,
  },

  section: { gap: 12 },
  sectionLabel: {
    fontFamily: fonts.heading,
    fontSize: 12,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionHint: { fontFamily: fonts.body, fontSize: 11, color: colors.text3, marginTop: -6 },

  rowBtns: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  selectBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    alignItems: 'center',
    minWidth: 80,
  },
  selectBtnAtivo: { backgroundColor: 'rgba(58,155,220,0.15)', borderColor: colors.accent },
  selectBtnText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.text2 },
  selectBtnTextAtivo: { color: colors.accent2 },

  duoRow: { flexDirection: 'row', gap: 10 },

  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.card2,
  },
  toggleCardAtivo: { backgroundColor: 'rgba(58,155,220,0.1)', borderColor: colors.accent },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.text3,
    backgroundColor: 'transparent',
  },
  toggleDotAtivo: { backgroundColor: colors.accent, borderColor: colors.accent },
  toggleText: { fontFamily: fonts.body, fontSize: 13, color: colors.text2, flex: 1 },
  toggleTextAtivo: { color: colors.text },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  loadingText: { fontFamily: fonts.body, fontSize: 13, color: colors.text2 },

  btnPrimary: { borderRadius: radius.md, overflow: 'hidden' },
  btnGradient: { paddingVertical: 15, alignItems: 'center' },
  btnText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: '#fff', letterSpacing: 0.2 },

  termos: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 16,
  },
});
