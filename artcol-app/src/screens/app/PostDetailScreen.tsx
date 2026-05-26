import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PostCard } from '@/components/PostCard';
import { CommentItem } from '@/components/CommentItem';
import { useAuth } from '@/context/AuthContext';
import { fetchPostWithComments, addComment, toggleLike } from '@/lib/feed';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { CommentWithAuthor, PostWithMeta } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'PostDetail'>;

const MAX_COMMENT = 500;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId, focusComment } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithMeta | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const { post: p, comments: c } = await fetchPostWithComments(postId, user.id);
      setPost(p);
      setComments(c);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      Alert.alert('Post', message);
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (focusComment && !loading) {
      // Petit délai pour laisser le clavier monter proprement après le mount
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [focusComment, loading]);

  async function handleLikeToggle() {
    if (!post || !user) return;
    const nowLiked = await toggleLike(post.id, user.id, post.liked_by_me);
    setPost({
      ...post,
      liked_by_me: nowLiked,
      likes_count: post.likes_count + (nowLiked ? 1 : -1),
    });
  }

  async function handleSendComment() {
    if (!user || !post) return;
    const trimmed = draft.trim();
    if (trimmed.length === 0 || sending) return;
    setSending(true);
    try {
      const created = await addComment({
        postId: post.id,
        authorId: user.id,
        text: trimmed,
      });
      setComments((prev) => [...prev, created]);
      setPost({ ...post, comments_count: post.comments_count + 1 });
      setDraft('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Envoi impossible';
      Alert.alert('Commentaire', message);
    } finally {
      setSending(false);
    }
  }

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
      >
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <PostCard
                post={post}
                onToggleLike={handleLikeToggle}
                onPressAuthor={() =>
                  navigation.navigate('UserProfile', { userId: post.author_id })
                }
              />
              <Text style={styles.sectionLabel}>
                {post.comments_count > 0
                  ? `${post.comments_count} COMMENTAIRE${post.comments_count > 1 ? 'S' : ''}`
                  : 'AUCUN COMMENTAIRE'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Sois le premier à commenter.</Text>
          }
          renderItem={({ item }) => <CommentItem comment={item} />}
        />

        <View style={styles.composer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Écris un commentaire..."
            placeholderTextColor={colors.textMuted}
            maxLength={MAX_COMMENT}
            multiline
          />
          <Pressable
            onPress={handleSendComment}
            disabled={sending || draft.trim().length === 0}
            style={[
              styles.sendBtn,
              (sending || draft.trim().length === 0) && styles.sendBtnDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Envoyer le commentaire"
          >
            {sending ? (
              <ActivityIndicator color={colors.bgDeep} />
            ) : (
              <Text style={styles.sendBtnText}>Envoyer</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 44,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  sendBtn: {
    paddingHorizontal: spacing.lg,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.neonLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.sm,
    color: colors.bgDeep,
  },
});
