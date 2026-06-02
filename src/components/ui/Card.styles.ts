import { StyleSheet } from 'react-native';
import { colors, radius } from '../../styles/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
});
