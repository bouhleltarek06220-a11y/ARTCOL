import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  tagline?: boolean;
}

export function Logo({ size = 'md', tagline = false }: LogoProps) {
  const sizes = {
    sm: { letter: 24, dot: 6 },
    md: { letter: 36, dot: 8 },
    lg: { letter: 56, dot: 12 },
  };
  const s = sizes[size];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.letters, { fontSize: s.letter }]}>ART</Text>
        <View
          style={[
            styles.dot,
            { width: s.dot, height: s.dot, borderRadius: s.dot / 2 },
          ]}
        />
        <Text style={[styles.letters, { fontSize: s.letter }]}>COL</Text>
      </View>
      {tagline && (
        <Text style={styles.tagline}>RÉSEAU D'ARTISTES</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  letters: {
    fontFamily: fonts.displayBold,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  dot: {
    backgroundColor: colors.neonLime,
    shadowColor: colors.neonLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.neonViolet,
    marginTop: spacing.md,
    letterSpacing: 4,
  },
});
