import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { FollowButton } from '@/components/FollowButton';
import { useAuth } from '@/context/AuthContext';
import { fetchProfileWithStats } from '@/lib/follows';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { ProfileWithStats, ArtDomain } from '@/types/database';
import type { AppStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'UserProfile'>;

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

export function UserProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchProfileWithStats(userId, user.id);
      setProfile(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Profil introuvable';
      Alert.alert('Profil', msg);
    } finally {
      setLoading(false);
    }
  }, [user, userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !profile) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} size="large" />
        </View>
      </Screen>
    );
  }

  const isMe = user?.id === profile.id;
  const domains = profile.art_domains?.length
    ? profile.art_domains.map((d) => DOMAIN_LABELS[d]).join(' · ')
    : 'Aucun domaine renseigné';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Avatar uri={profile.avatar_url} displayName={profile.display_name} size={96} />
        <Text style={styles.name}>{profile.display_name}</Text>
        <Text style={styles.handle}>@{profile.username}</Text>
      </View>

      <View style={styles.stats}>
        <StatBlock label="Posts" value={profile.posts_count} />
        <StatBlock label="Abonnés" value={profile.followers_count} />
        <StatBlock label="Abonnements" value={profile.following_count} />
      </View>

      <View style={styles.actions}>
        {isMe ? (
          <Button
            title="Éditer mon profil"
            onPress={() => navigation.navigate('EditProfile')}
          />
        ) : (
          <>
            <FollowButton
              targetUserId={profile.id}
              initialFollowed={profile.i_follow}
              onChange={(followed) =>
                setProfile((p) =>
                  p
                    ? {
                        ...p,
                        i_follow: followed,
                        followers_count: p.followers_count + (followed ? 1 : -1),
                      }
                    : p
                )
              }
            />
            <Button
              title="Propose une collab"
              variant="secondary"
              onPress={() =>
                navigation.navigate('NewCollab', { recipientId: profile.id })
              }
              style={{ marginTop: spacing.md }}
            />
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>BIO</Text>
        <Text style={styles.cardValue}>
          {profile.bio || (isMe ? 'Ajoute une bio depuis ton profil.' : 'Aucune bio.')}
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
    </ScrollView>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  content: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    gap: spacing.md,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
  },
  handle: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    color: colors.neonViolet,
    marginTop: -spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginTop: spacing['2xl'],
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.neonLime,
  },
  statLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  actions: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginTop: spacing.md,
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
});
