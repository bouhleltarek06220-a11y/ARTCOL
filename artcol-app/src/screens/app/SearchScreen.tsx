import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArtistRow } from '@/components/ArtistRow';
import { useAuth } from '@/context/AuthContext';
import { searchArtists } from '@/lib/follows';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { Profile } from '@/types/database';

const DEBOUNCE_MS = 300;

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [touched, setTouched] = useState(false);

  // Debounce manuel
  const doSearch = useCallback(
    async (term: string) => {
      if (!user) return;
      if (term.trim().length === 0) {
        setResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        const data = await searchArtists(term, user.id);
        setResults(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Recherche impossible';
        Alert.alert('Recherche', msg);
      } finally {
        setSearching(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!touched) return;
    const t = setTimeout(() => doSearch(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, touched, doSearch]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Découvrir</Text>
        <TextInput
          value={query}
          onChangeText={(t) => {
            setTouched(true);
            setQuery(t);
          }}
          placeholder="Recherche un artiste, un nom, un pseudo..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {searching ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {touched && query.trim().length > 0
                  ? 'Aucun artiste trouvé'
                  : 'Trouve ta tribu'}
              </Text>
              <Text style={styles.emptyText}>
                {touched && query.trim().length > 0
                  ? 'Essaie un autre nom ou pseudo.'
                  : 'Tape un nom ou un pseudo pour découvrir des artistes sur ARTCOL.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ArtistRow
              artist={item}
              onPress={() =>
                navigation.navigate('UserProfile', { userId: item.id })
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
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSize.base,
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
