import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../styles/theme';

export const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  outline: { borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
  danger: { borderWidth: 1, borderColor: 'rgba(255,77,106,0.3)', backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontFamily: fonts.bodyMedium, fontSize: 15, color: '#fff' },
  textOutline: { color: colors.accent2 },
  textDanger: { color: colors.danger },
});
