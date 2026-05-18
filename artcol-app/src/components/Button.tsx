import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { colors, fonts, fontSize, radius, shadows, spacing } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles[variant].container,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadows.glowSm,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.bgDeep : colors.neonLime}
          size="small"
        />
      ) : (
        <Text style={[styles.text, variantStyles[variant].text]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.base,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: colors.neonLime },
    text: { color: colors.bgDeep },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.bgSurface,
      borderWidth: 1,
      borderColor: colors.borderDefault,
    },
    text: { color: colors.textPrimary },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: colors.textSecondary },
  }),
};
