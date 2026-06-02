import { StyleSheet } from 'react-native';
import { radius } from '../../styles/theme';

export const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(58,155,220,0.1)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.full },
});
