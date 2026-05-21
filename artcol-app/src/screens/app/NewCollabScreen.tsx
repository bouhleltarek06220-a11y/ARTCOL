import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { createCollab } from '@/lib/collabs';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { Profile } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'NewCollab'>;

const MAX_TITLE = 120;
const MAX_DESC = 2000;

export function NewCollabScreen({ route, navigation }: Props) {
  const { recipientId } = route.params;
  const { user } = useAuth();
  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();
      if (cancelled) return;
      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        setRecipient(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [recipientId]);

  async function handleSubmit() {
    if (!user || !recipient) return;
    if (title.trim().length < 3) {
      Alert.alert('Titre trop court', 'Au moins 3 caractères.');
      return;
    }
    setSubmitting(true);
    try {
      await createCollab({
        initiatorId: user.id,
        recipientId: recipient.id,
        title,
        description: description.trim() || null,
      });
      Alert.alert(
        'Invitation envoyée 🌸',
        `${recipient.display_name} recevra ta proposition. Tu peux suivre l'avancée dans l'onglet Collabs.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Envoi impossible';
      Alert.alert('Erreur', msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.neonLime} size="large" />
        </View>
      </Screen>
    );
  }

  if (!recipient) {
    return (
      <Screen>
        <Text style={styles.error}>Artiste introuvable.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Nouvelle collab</Text>

      <View style={styles.recipientCard}>
        <Avatar
          uri={recipient.avatar_url}
          displayName={recipient.display_name}
          size={48}
          ring={false}
        />
        <View style={styles.recipientText}>
          <Text style={styles.recipientLabel}>POUR</Text>
          <Text style={styles.recipientName}>{recipient.display_name}</Text>
          <Text style={styles.recipientHandle}>@{recipient.username}</Text>
        </View>
      </View>

      <Input
        label="Titre"
        value={title}
        onChangeText={setTitle}
        placeholder="Concert à 4 mains, performance live, clip vidéo..."
        maxLength={MAX_TITLE}
        hint={`${title.length}/${MAX_TITLE}`}
      />

      <Input
        label="Description (optionnel)"
        value={description}
        onChangeText={setDescription}
        placeholder="Détaille ton idée, les conditions, la date..."
        multiline
        numberOfLines={6}
        style={styles.textarea}
        maxLength={MAX_DESC}
        hint={`${description.length}/${MAX_DESC}`}
      />

      <Button
        title="Envoyer l'invitation"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting || title.trim().length < 3}
        style={{ marginTop: spacing['2xl'] }}
      />
      <Button title="Annuler" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  recipientText: {
    flex: 1,
  },
  recipientLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.2,
  },
  recipientName: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginTop: 2,
  },
  recipientHandle: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.neonViolet,
    marginTop: 2,
  },
  textarea: {
    height: 140,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing['4xl'],
  },
});
