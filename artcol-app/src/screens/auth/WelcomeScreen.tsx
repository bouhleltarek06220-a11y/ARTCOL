import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <LinearGradient
        colors={['rgba(123, 97, 255, 0.08)', 'transparent', 'rgba(200, 245, 58, 0.04)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.hero}>
        <Logo size="lg" tagline />
        <Text style={styles.headline}>
          Connecte. Crée.{'\n'}
          <Text style={styles.headlineAccent}>Collabore.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Le réseau des artistes en quête de visibilité — musique, danse, dessin,
          vidéo, écriture, et plus.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Créer mon profil artiste"
          onPress={() => navigation.navigate('SignUp')}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="J'ai déjà un compte"
          variant="secondary"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  headline: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['4xl'],
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: fontSize['4xl'] * 1.15,
    letterSpacing: -0.5,
    marginTop: spacing.xl,
  },
  headlineAccent: {
    color: colors.neonLime,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
    paddingHorizontal: spacing.lg,
  },
  actions: {
    paddingBottom: spacing['2xl'],
  },
});
