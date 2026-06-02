import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../styles/theme';
import { styles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={styles.input} placeholderTextColor={colors.text3} {...props} />
    </View>
  );
}
