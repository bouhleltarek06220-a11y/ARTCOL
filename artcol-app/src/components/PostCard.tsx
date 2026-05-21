import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import { timeAgo } from '@/lib/time';
import type { PostWithMeta } from '@/types/database';

interface PostCardProps {
  post: PostWithMeta;
  onPress?: () => void;
  onToggleLike?: () => void | Promise<void>;
  onPressComments?: () => void;
}

export function PostCard({
  post,
  onPress,
  onToggleLike,
  onPressComments,
}: PostCardProps) {
  // Optimistic local state pour le like — instantané au tap, rollback si erreur côté parent
  const [optimisticLiked, setOptimisticLiked] = useState(post.liked_by_me);
  const [optimisticCount, setOptimisticCount] = useState(post.likes_count);
  const [busy, setBusy] = useState(false);

  // Resync si le post prop change (refetch parent)
  React.useEffect(() => {
    setOptimisticLiked(post.liked_by_me);
    setOptimisticCount(post.likes_count);
  }, [post.liked_by_me, post.likes_count]);

  async function handleLikePress() {
    if (busy || !onToggleLike) return;
    const wasLiked = optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticCount(optimisticCount + (wasLiked ? -1 : 1));
    setBusy(true);
    try {
      await onToggleLike();
    } catch {
      // Rollback
      setOptimisticLiked(wasLiked);
      setOptimisticCount(optimisticCount);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Avatar
          uri={post.author?.avatar_url}
          displayName={post.author?.display_name ?? '?'}
          size={40}
          ring={false}
        />
        <View style={styles.headerText}>
          <Text style={styles.authorName} numberOfLines={1}>
            {post.author?.display_name ?? 'Artiste'}
          </Text>
          <Text style={styles.meta}>
            @{post.author?.username ?? '...'} · {timeAgo(post.created_at)}
          </Text>
        </View>
      </View>

      {post.text ? <Text style={styles.body}>{post.text}</Text> : null}

      {post.photo_url ? (
        <Image
          source={{ uri: post.photo_url }}
          style={styles.photo}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.actions}>
        <Pressable
          onPress={handleLikePress}
          disabled={busy}
          hitSlop={8}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={optimisticLiked ? 'Retirer le like' : 'Liker'}
        >
          <Text style={[styles.actionIcon, optimisticLiked && styles.actionIconActive]}>
            {optimisticLiked ? '♥' : '♡'}
          </Text>
          <Text style={[styles.actionCount, optimisticLiked && styles.actionCountActive]}>
            {optimisticCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={onPressComments}
          hitSlop={8}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel="Voir les commentaires"
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.comments_count}</Text>
        </Pressable>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
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
  body: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    lineHeight: fontSize.base * 1.45,
    marginBottom: spacing.md,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing['2xl'],
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  actionIconActive: {
    color: colors.neonLime,
  },
  actionCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionCountActive: {
    color: colors.neonLime,
  },
});
