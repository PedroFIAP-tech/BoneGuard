import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', style, disabled }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        isPrimary && styles.primary,
        variant === 'outline' && styles.outline,
        isDanger && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, !isPrimary && styles.textOutline, isDanger && styles.textDanger]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
