import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface AvatarProps {
  uri?: string | null;
  displayName: string;
  size?: number;
  loading?: boolean;
  ring?: boolean;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({
  uri,
  displayName,
  size = 96,
  loading = false,
  ring = true,
}: AvatarProps) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: ring ? 2 : 0,
  };

  return (
    <View style={[styles.container, containerStyle, ring && styles.ring]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.32 }]}>
          {initialsOf(displayName)}
        </Text>
      )}
      {loading && (
        <View style={[styles.loadingOverlay, { borderRadius: size / 2 }]}>
          <ActivityIndicator color={colors.neonLime} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    borderColor: colors.neonLime,
    shadowColor: colors.neonLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  initials: {
    fontFamily: fonts.displayBold,
    color: colors.neonLime,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 16, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
