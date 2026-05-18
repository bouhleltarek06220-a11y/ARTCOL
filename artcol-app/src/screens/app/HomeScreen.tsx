import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { profile, signOut } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Salut</Text>
          <Text style={styles.name}>{profile?.display_name ?? 'Artiste'}</Text>
        </View>
      </View>

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>Ton feed arrive bientôt</Text>
        <Text style={styles.placeholderText}>
          Phase 3 : performances, posts, et collaborations apparaîtront ici. Pour
          l'instant, complète ton profil pour qu'on te trouve.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Voir / éditer mon profil"
          onPress={() => navigation.navigate('Profile')}
        />
        <View style={{ height: spacing.md }} />
        <Button title="Se déconnecter" variant="ghost" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['3xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },
  placeholderCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing['2xl'],
    marginBottom: spacing['3xl'],
  },
  placeholderTitle: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.lg,
    color: colors.neonLime,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.5,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: spacing.lg,
  },
});
