import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { ArtDomain } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

const DOMAIN_LABELS: Record<ArtDomain, string> = {
  music: 'Musique',
  dance: 'Danse',
  visual_arts: 'Arts visuels',
  photography: 'Photographie',
  video: 'Vidéo',
  writing: 'Écriture',
  theater: 'Théâtre',
  craft: 'Artisanat',
  other: 'Autre',
};

export function ProfileScreen({ navigation }: Props) {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <Screen>
        <Text style={styles.empty}>Chargement du profil…</Text>
      </Screen>
    );
  }

  const domains = profile.art_domains?.length
    ? profile.art_domains.map((d) => DOMAIN_LABELS[d]).join(' · ')
    : 'Aucun domaine renseigné';

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Avatar
          uri={profile.avatar_url}
          displayName={profile.display_name}
          size={96}
        />
        <Text style={styles.displayName}>{profile.display_name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>BIO</Text>
        <Text style={styles.cardValue}>
          {profile.bio || 'Ajoute une bio pour te présenter aux autres artistes.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>DOMAINES ARTISTIQUES</Text>
        <Text style={styles.cardValue}>{domains}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>VILLE</Text>
        <Text style={styles.cardValue}>{profile.city || 'Non renseignée'}</Text>
      </View>

      <Button
        title="Éditer mon profil"
        onPress={() => navigation.navigate('EditProfile')}
        style={{ marginTop: spacing.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    marginBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  displayName: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
  },
  username: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    color: colors.neonViolet,
    marginTop: -spacing.md,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  cardValue: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: fontSize.base * 1.5,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing['5xl'],
  },
});
