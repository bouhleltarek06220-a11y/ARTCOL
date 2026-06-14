import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import { timeAgo } from '@/lib/time';
import type { CommentWithAuthor } from '@/types/database';

interface CommentItemProps {
  comment: CommentWithAuthor;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.row}>
      <Avatar
        uri={comment.author?.avatar_url}
        displayName={comment.author?.display_name ?? '?'}
        size={36}
        ring={false}
      />
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.authorName} numberOfLines={1}>
            {comment.author?.display_name ?? 'Artiste'}
          </Text>
          <Text style={styles.time}>{timeAgo(comment.created_at)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubble: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: 2,
  },
  authorName: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    lineHeight: fontSize.sm * 1.5,
  },
});
