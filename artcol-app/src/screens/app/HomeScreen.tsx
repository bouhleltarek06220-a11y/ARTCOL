import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { fetchFeed, toggleLike } from '@/lib/feed';
import { colors, fonts, fontSize, shadows, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { PostWithMeta } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { profile, user, signOut } = useAuth();
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: 'initial' | 'pull') => {
      if (!user) return;
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      try {
        const data = await fetchFeed(user.id);
        setPosts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de chargement';
        Alert.alert('Feed', message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  // Initial load
  useEffect(() => {
    load('initial');
  }, [load]);

  // Refresh quand on revient sur l'écran (après création/détail d'un post)
  useFocusEffect(
    useCallback(() => {
      load('pull');
    }, [load])
  );

  async function handleToggleLike(post: PostWithMeta) {
    if (!user) return;
    try {
      const nowLiked = await toggleLike(post.id, user.id, post.liked_by_me);
      // On met à jour seulement la ligne concernée pour éviter le refetch complet
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                liked_by_me: nowLiked,
                likes_count: p.likes_count + (nowLiked ? 1 : -1),
              }
            : p
        )
      );
    } catch (err) {
      // PostCard fait son rollback optimiste si onToggleLike throw
      throw err;
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.greeting}>Salut</Text>
          <Text style={styles.name} numberOfLines={1}>
            {profile?.display_name ?? 'Artiste'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={signOut}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
          >
            <Text style={styles.signOut}>Déco</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Voir mon profil"
          >
            <Avatar
              uri={profile?.avatar_url}
              displayName={profile?.display_name ?? 'A'}
              size={44}
              ring={false}
            />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load('pull')}
              tintColor={colors.neonLime}
              colors={[colors.neonLime]}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Feed vide</Text>
              <Text style={styles.emptyText}>
                Sois le premier à poster ! Tap le bouton + pour partager une
                performance, une photo, ou une pensée.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              onPressComments={() =>
                navigation.navigate('PostDetail', { postId: item.id, focusComment: true })
              }
              onToggleLike={() => handleToggleLike(item)}
            />
          )}
        />
      )}

      <Pressable
        onPress={() => navigation.navigate('CreatePost')}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Créer un post"
      >
        <Text style={styles.fabPlus}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTitleBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  signOut: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  listContent: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: 96,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['5xl'],
  },
  emptyTitle: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.lg,
    color: colors.neonLime,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  fab: {
    position: 'absolute',
    bottom: spacing['3xl'],
    right: spacing['2xl'],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.neonLime,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glowMd,
  },
  fabPlus: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    color: colors.bgDeep,
    lineHeight: 36,
  },
});
