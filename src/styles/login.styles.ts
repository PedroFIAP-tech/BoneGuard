import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from './theme';

export const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

  heroArea: { alignItems: 'center', marginBottom: 36, position: 'relative' },
  heroBg: {
    position: 'absolute',
    top: -30,
    left: -80,
    right: -80,
    height: 280,
    borderRadius: 140,
  },

  logoWrapper: { marginBottom: 20, position: 'relative' },
  logoGradient: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  logoInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoLetter: { fontFamily: fonts.heading, fontSize: 30, color: colors.accent2 },
  logoDivider: { width: 1.5, height: 28, backgroundColor: colors.border },
  logoOrbit: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent3,
    borderWidth: 2,
    borderColor: colors.bg,
  },

  appName: { fontFamily: fonts.heading, fontSize: 30, color: colors.text, letterSpacing: 0.5 },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text2,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 22,
    gap: 0,
  },
  formTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.text,
    marginBottom: 18,
  },
  fields: { gap: 14, marginBottom: 20 },

  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 12 },
  loadingText: { fontFamily: fonts.body, fontSize: 13, color: colors.text2 },

  btnPrimary: { borderRadius: radius.md, overflow: 'hidden', marginBottom: 14 },
  btnDisabled: { opacity: 0.45 },
  btnGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: '#fff', letterSpacing: 0.2 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: colors.border },
  dividerText: { fontFamily: fonts.body, fontSize: 12, color: colors.text3 },

  btnOutline: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnOutlineText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.accent2 },

  forgotArea: { marginTop: 16, alignItems: 'center' },
  forgotText: { fontFamily: fonts.body, fontSize: 12, color: colors.text3 },

  footer: {
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text3,
    marginTop: 28,
    lineHeight: 16,
  },
});
