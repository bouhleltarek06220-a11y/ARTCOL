import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { pickPostPhotoFromLibrary, uploadPostPhoto } from '@/lib/storage';
import { createPost } from '@/lib/feed';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import type { AppStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'CreatePost'>;

const MAX_TEXT = 2000;

export function CreatePostScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    !submitting && (text.trim().length > 0 || photoUri !== null);

  async function handlePickPhoto() {
    const picked = await pickPostPhotoFromLibrary();
    if (picked.status === 'permission_denied') {
      Alert.alert(
        'Permission requise',
        "Autorise l'accès aux photos pour pouvoir ajouter une image."
      );
      return;
    }
    if (picked.status === 'picked') {
      setPhotoUri(picked.uri);
    }
  }

  async function handleSubmit() {
    if (!user) return;
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photoUri) {
        photoUrl = await uploadPostPhoto(user.id, photoUri);
      }
      await createPost({
        authorId: user.id,
        text: text.trim() || null,
        photoUrl,
      });
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Alert.alert('Publication impossible', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Nouveau post</Text>

      <Input
        label="Texte"
        value={text}
        onChangeText={setText}
        placeholder="Raconte ta performance, ton inspiration, ton actu..."
        multiline
        numberOfLines={6}
        style={styles.textarea}
        maxLength={MAX_TEXT}
        hint={`${text.length}/${MAX_TEXT}`}
      />

      <Text style={styles.sectionLabel}>PHOTO (OPTIONNEL)</Text>
      {photoUri ? (
        <View style={styles.photoWrapper}>
          <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
          <Pressable
            onPress={() => setPhotoUri(null)}
            style={styles.removeBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retirer la photo"
          >
            <Text style={styles.removeBtnText}>Retirer</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={handlePickPhoto}
          style={styles.pickerSlot}
          accessibilityRole="button"
          accessibilityLabel="Ajouter une photo"
        >
          <Text style={styles.pickerIcon}>＋</Text>
          <Text style={styles.pickerHint}>Choisir une photo</Text>
        </Pressable>
      )}

      <Button
        title="Publier"
        onPress={handleSubmit}
        loading={submitting}
        disabled={!canSubmit}
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
    height: 140,
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
  pickerSlot: {
    height: 180,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pickerIcon: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    color: colors.neonLime,
  },
  pickerHint: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    letterSpacing: 0.4,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSurface,
  },
  removeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(8, 11, 16, 0.85)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  removeBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
});
