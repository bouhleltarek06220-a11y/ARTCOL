import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import type { ArtDomain } from '@/types/database';

type Props = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;

const ALL_DOMAINS: { value: ArtDomain; label: string }[] = [
  { value: 'music', label: 'Musique' },
  { value: 'dance', label: 'Danse' },
  { value: 'visual_arts', label: 'Arts visuels' },
  { value: 'photography', label: 'Photo' },
  { value: 'video', label: 'Vidéo' },
  { value: 'writing', label: 'Écriture' },
  { value: 'theater', label: 'Théâtre' },
  { value: 'craft', label: 'Artisanat' },
  { value: 'other', label: 'Autre' },
];

export function EditProfileScreen({ navigation }: Props) {
  const { profile, user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [domains, setDomains] = useState<ArtDomain[]>(profile?.art_domains ?? []);
  const [saving, setSaving] = useState(false);

  function toggleDomain(d: ArtDomain) {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  async function save() {
    if (!user) return;
    if (displayName.trim().length < 1) {
      Alert.alert('Erreur', 'Le nom d\'artiste est requis.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        city: city.trim() || null,
        art_domains: domains,
      })
      .eq('id', user.id);
    setSaving(false);

    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }
    await refreshProfile();
    navigation.goBack();
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Éditer mon profil</Text>

      <Input
        label="Nom d'artiste"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
      />
      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Quelques mots sur toi, ton univers..."
        multiline
        numberOfLines={4}
        style={styles.textarea}
        maxLength={500}
        hint={`${bio.length}/500`}
      />
      <Input
        label="Ville"
        value={city}
        onChangeText={setCity}
        placeholder="Vallauris, Paris, Tokyo..."
        autoCapitalize="words"
      />

      <Text style={styles.sectionLabel}>DOMAINES ARTISTIQUES</Text>
      <View style={styles.chips}>
        {ALL_DOMAINS.map((d) => {
          const active = domains.includes(d.value);
          return (
            <Pressable
              key={d.value}
              onPress={() => toggleDomain(d.value)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {d.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Enregistrer"
        onPress={save}
        loading={saving}
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
    marginBottom: spacing['2xl'],
  },
  textarea: {
    height: 100,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  chipActive: {
    backgroundColor: 'rgba(200, 245, 58, 0.1)',
    borderColor: colors.neonLime,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.neonLime,
  },
});
