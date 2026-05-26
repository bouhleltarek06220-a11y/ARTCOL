import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { Profile } from '@/types/database';

interface ArtistRowProps {
  artist: Profile;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

const DOMAIN_LABELS_SHORT: Record<string, string> = {
  music: 'Musique',
  dance: 'Danse',
  visual_arts: 'Arts visuels',
  photography: 'Photo',
  video: 'Vidéo',
  writing: 'Écriture',
  theater: 'Théâtre',
  craft: 'Artisanat',
  other: 'Autre',
};

export function ArtistRow({ artist, onPress, trailing }: ArtistRowProps) {
  const subtitle =
    (artist.art_domains ?? []).slice(0, 2).map((d) => DOMAIN_LABELS_SHORT[d] ?? d).join(' · ') ||
    (artist.city ? `📍 ${artist.city}` : `@${artist.username}`);

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Avatar uri={artist.avatar_url} displayName={artist.display_name} size={48} ring={false} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {artist.display_name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.sm,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trailing: {
    marginLeft: spacing.sm,
  },
});
