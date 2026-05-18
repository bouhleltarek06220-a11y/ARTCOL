import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (displayName.trim().length < 2) e.displayName = '2 caractères minimum';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Email invalide';
    if (password.length < 8) e.password = '8 caractères minimum';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Inscription impossible', error);
      return;
    }
    Alert.alert(
      'Bienvenue 🌸',
      'Ton compte est créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.',
      [{ text: 'OK', onPress: () => navigation.replace('SignIn') }]
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Crée ton profil</Text>
        <Text style={styles.subtitle}>
          Rejoins le réseau des artistes en quête de visibilité.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nom d'artiste"
          placeholder="DJ Tarkus, Sakura, ..."
          value={displayName}
          onChangeText={setDisplayName}
          error={errors.displayName}
          autoCapitalize="words"
          autoComplete="name"
        />
        <Input
          label="Email"
          placeholder="tarek@artcol.online"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <Input
          label="Mot de passe"
          placeholder="8 caractères minimum"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <Button
          title="Créer mon compte"
          onPress={handleSignUp}
          loading={loading}
          style={{ marginTop: spacing.md }}
        />
        <Button
          title="J'ai déjà un compte"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing['4xl'],
    marginBottom: spacing['3xl'],
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['3xl'],
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: fontSize.base * 1.5,
  },
  form: {
    gap: spacing.xs,
  },
});
