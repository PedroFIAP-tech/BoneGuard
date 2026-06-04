import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../styles/theme';
import { styles } from './Badge.styles';

type BadgeVariant = 'BAIXO' | 'MODERADO' | 'ALTO' | 'OK' | 'ATENCAO' | 'RISCO';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const variantColors: Record<BadgeVariant, string> = {
  BAIXO: colors.accent3,
  OK: colors.accent3,
  MODERADO: colors.warn,
  ATENCAO: colors.warn,
  ALTO: colors.danger,
  RISCO: colors.danger,
};

export function Badge({ label, variant }: BadgeProps) {
  const color = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20`, borderColor: `${color}50` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}
