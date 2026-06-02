import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../styles/theme';

export const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.text2,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.body,
  },
});
