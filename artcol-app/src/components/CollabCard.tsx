import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import { timeAgo } from '@/lib/time';
import type { CollabStatus, CollaborationWithUsers, Profile } from '@/types/database';

interface CollabCardProps {
  collab: CollaborationWithUsers;
  currentUserId: string;
  onPress?: () => void;
}

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

export function CollabCard({ collab, currentUserId, onPress }: CollabCardProps) {
  const sentByMe = collab.initiator_id === currentUserId;
  const otherParty: Profile = sentByMe ? collab.recipient : collab.initiator;
  const direction = sentByMe ? 'À' : 'De';
  const statusStyle = STATUS_COLOR[collab.status];

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <Avatar
          uri={otherParty?.avatar_url}
          displayName={otherParty?.display_name ?? '?'}
          size={44}
          ring={false}
        />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {collab.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {direction} {otherParty?.display_name ?? '...'} · {timeAgo(collab.created_at)}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.fg }]}>
            {STATUS_LABEL[collab.status]}
          </Text>
        </View>
      </View>
      {collab.description ? (
        <Text style={styles.desc} numberOfLines={2}>
          {collab.description}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  body: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.xs,
    letterSpacing: 0.4,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: fontSize.sm * 1.4,
  },
});
