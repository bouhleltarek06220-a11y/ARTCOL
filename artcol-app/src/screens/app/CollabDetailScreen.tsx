import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { fetchCollabDetail, respondToCollab, cancelCollab } from '@/lib/collabs';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import { timeAgo } from '@/lib/time';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { CollabStatus, CollaborationWithUsers } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'CollabDetail'>;

const STATUS_LABEL: Record<CollabStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  declined: 'Refusée',
  cancelled: 'Annulée',
};

const STATUS_COLOR: Record<CollabStatus, { bg: string; fg: string }> = {
  pending: { bg: 'rgba(123, 97, 255, 0.12)', fg: colors.neonViolet },
  accepted: { bg: 'rgba(74, 222, 128, 0.12)', fg: colors.success },
  declined: { bg: 'rgba(248, 113, 113, 0.12)', fg: colors.danger },
  cancelled: { bg: 'rgba(138, 150, 173, 0.12)', fg: colors.textSecondary },
};

export function CollabDetailScreen({ route, navigation }: Props) {
  const { collabId } = route.params;
  const { user } = useAuth();
  const [collab, setCollab] = useState<CollaborationWithUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchCollabDetail(collabId);
      setCollab(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Collab introuvable';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  }, [collabId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRespond(status: 'accepted' | 'declined') {
    if (!collab) return;
    setActing(true);
    try {
      await respondToCollab(collab.id, status);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Action impossible';
      Alert.alert('Erreur', msg);
    } finally {
      setActing(false);
    }
  }

  async function handleCancel() {
    if (!collab) return;
    Alert.alert(
      'Annuler cette invitation ?',
      'Tu peux toujours en relancer une nouvelle plus tard.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            setActing(true);
            try {
              await cancelCollab(collab.id);
              await load();
              navigation.goBack();
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Action impossible';
              Alert.alert('Erreur', msg);
            } finally {
              setActing(false);
            }
          },
        },
      ]
    );
  }

  if (loading || !collab) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.neonLime} size="large" />
      </View>
    );
  }

  const isInitiator = user?.id === collab.initiator_id;
  const isRecipient = user?.id === collab.recipient_id;
  const otherParty = isInitiator ? collab.recipient : collab.initiator;
  const statusStyle = STATUS_COLOR[collab.status];

  const canRespond = isRecipient && collab.status === 'pending';
  const canCancel = isInitiator && collab.status === 'pending';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.fg }]}>
          {STATUS_LABEL[collab.status]}
        </Text>
      </View>

      <Text style={styles.title}>{collab.title}</Text>

      <View style={styles.partiesCard}>
        <PartyBlock label="DE" profile={collab.initiator} />
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
        <PartyBlock label="À" profile={collab.recipient} />
      </View>

      <Text style={styles.meta}>Envoyée {timeAgo(collab.created_at)}</Text>
      {collab.responded_at && (
        <Text style={styles.meta}>
          Répondue {timeAgo(collab.responded_at)}
        </Text>
      )}

      {collab.description && (
        <View style={styles.descCard}>
          <Text style={styles.descLabel}>DESCRIPTION</Text>
          <Text style={styles.descValue}>{collab.description}</Text>
        </View>
      )}

      {canRespond && (
        <View style={styles.actions}>
          <Button
            title="Accepter"
            onPress={() => handleRespond('accepted')}
            loading={acting}
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title="Refuser"
            variant="secondary"
            onPress={() => handleRespond('declined')}
            disabled={acting}
          />
        </View>
      )}

      {canCancel && (
        <View style={styles.actions}>
          <Button
            title="Annuler l'invitation"
            variant="ghost"
            onPress={handleCancel}
            disabled={acting}
          />
        </View>
      )}

      {!canRespond && !canCancel && (
        <Text style={[styles.meta, { textAlign: 'center', marginTop: spacing.xl }]}>
          {isRecipient
            ? `Tu as ${collab.status === 'accepted' ? 'accepté' : collab.status === 'declined' ? 'refusé' : 'reçu'} cette invitation.`
            : isInitiator
            ? `${otherParty.display_name} a ${collab.status === 'accepted' ? 'accepté' : collab.status === 'declined' ? 'refusé' : 'reçu'} ton invitation.`
            : ''}
        </Text>
      )}
    </ScrollView>
  );
}

function PartyBlock({ label, profile }: { label: string; profile: CollaborationWithUsers['initiator'] }) {
  return (
    <View style={styles.party}>
      <Avatar
        uri={profile?.avatar_url}
        displayName={profile?.display_name ?? '?'}
        size={56}
        ring={false}
      />
      <Text style={styles.partyLabel}>{label}</Text>
      <Text style={styles.partyName} numberOfLines={1}>
        {profile?.display_name ?? '...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  content: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  statusText: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.lg,
  },
  partiesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  party: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  partyLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginTop: spacing.sm,
  },
  partyName: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  arrow: {
    paddingHorizontal: spacing.md,
  },
  arrowText: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.neonLime,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  descCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  descLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  descValue: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: fontSize.base * 1.5,
  },
  actions: {
    marginTop: spacing['2xl'],
  },
});
