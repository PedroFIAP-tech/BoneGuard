import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/theme';
import { styles } from './ProgressBar.styles';

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export function ProgressBar({ progress, color = colors.accent }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}
