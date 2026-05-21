import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollabCard } from '@/components/CollabCard';
import { useAuth } from '@/context/AuthContext';
import { fetchMyCollabs } from '@/lib/collabs';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { CollaborationWithUsers, CollabStatus } from '@/types/database';
import type { AppStackParamList } from '@/navigation/AppNavigator';

type Filter = 'all' | 'pending' | 'accepted';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'accepted', label: 'Acceptées' },
];

export function CollabsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const [collabs, setCollabs] = useState<CollaborationWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(
    async (mode: 'initial' | 'pull') => {
      if (!user) return;
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      try {
        const data = await fetchMyCollabs(user.id);
        setCollabs(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur de chargement';
        Alert.alert('Collabs', msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    load('initial');
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load('pull');
    }, [load])
  );

  const visible = filter === 'all'
    ? collabs
    : collabs.filter((c) => c.status === (filter as CollabStatus));

  const pendingForMe = collabs.filter(
    (c) => c.status === 'pending' && user && c.recipient_id === user.id
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Collaborations</Text>
        {pendingForMe > 0 && (
          <Text style={styles.notice}>
            {pendingForMe} invitation{pendingForMe > 1 ? 's' : ''} en attente de ta réponse
          </Text>
        )}
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.filter, active && styles.filterActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} size="large" />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
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
              <Text style={styles.emptyTitle}>Aucune collab</Text>
              <Text style={styles.emptyText}>
                Va sur le profil d'un artiste et propose une collaboration.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CollabCard
              collab={item}
              currentUserId={user?.id ?? ''}
              onPress={() =>
                navigation.navigate('CollabDetail', { collabId: item.id })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  notice: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.neonLime,
    marginTop: spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.md,
  },
  filter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  filterActive: {
    backgroundColor: 'rgba(200, 245, 58, 0.1)',
    borderColor: colors.neonLime,
  },
  filterText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.neonLime,
  },
  listContent: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
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
    paddingTop: spacing['4xl'],
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
});
