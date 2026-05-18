import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/lib/supabase';

const AVATARS_BUCKET = 'avatars';
const AVATAR_MAX_DIMENSION = 512;
const AVATAR_COMPRESS = 0.8;

export type PickAvatarResult =
  | { status: 'cancelled' }
  | { status: 'permission_denied' }
  | { status: 'picked'; uri: string };

/**
 * Demande la permission puis ouvre la galerie pour choisir un avatar.
 * Force un crop carré (aspect 1:1) côté natif.
 */
export async function pickAvatarFromLibrary(): Promise<PickAvatarResult> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return { status: 'permission_denied' };

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets?.[0]) return { status: 'cancelled' };
  return { status: 'picked', uri: result.assets[0].uri };
}

/**
 * Redimensionne et compresse l'image localement avant l'upload pour
 * limiter la bande passante et le coût storage.
 */
async function compressAvatar(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: AVATAR_MAX_DIMENSION, height: AVATAR_MAX_DIMENSION } }],
    { compress: AVATAR_COMPRESS, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

/**
 * Upload l'avatar dans le bucket Supabase `avatars` sous le chemin
 * `{userId}/avatar.jpg` (cohérent avec les policies RLS) et retourne la
 * public URL. Le `upsert: true` écrase l'ancien fichier.
 *
 * Note: on append un timestamp en query string pour casser le cache CDN
 * et que l'avatar mis à jour s'affiche immédiatement.
 */
export async function uploadAvatar(userId: string, localUri: string): Promise<string> {
  const compressedUri = await compressAvatar(localUri);
  const arrayBuffer = await fetch(compressedUri).then((r) => r.arrayBuffer());

  const path = `${userId}/avatar.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
