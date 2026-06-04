import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}
