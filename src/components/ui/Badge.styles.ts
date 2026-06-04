import { StyleSheet } from 'react-native';
import { fonts, radius } from '../../styles/theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 0.5,
    alignSelf: 'flex-start',
  },
  text: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5 },
});
