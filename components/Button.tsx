import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'tertiary';
}

export function Button({ title, variant = 'primary', ...rest }: ButtonProps) {
  const getButtonStyle = () => {
    if (variant === 'outline') return styles.buttonOutline;
    if (variant === 'tertiary') return styles.buttonTertiary;
    return styles.buttonPrimary;
  };

  const getTextStyle = () => {
    if (variant === 'outline') return styles.textOutline;
    if (variant === 'tertiary') return styles.textTertiary;
    return styles.textPrimary;
  };

  return (
    <TouchableOpacity style={[styles.button, getButtonStyle()]} {...rest}>
      <Text style={[styles.text, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  buttonPrimary: { backgroundColor: theme.colors.primary },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.colors.primary },
  buttonTertiary: { backgroundColor: 'rgba(240, 122, 58, 0.12)' },
  text: { fontFamily: theme.fonts.bodyBold, fontSize: 14 },
  textPrimary: { color: theme.colors.white },
  textOutline: { color: theme.colors.primary },
  textTertiary: { color: theme.colors.tertiary },
});