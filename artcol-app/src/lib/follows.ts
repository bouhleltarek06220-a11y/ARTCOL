import { supabase } from '@/lib/supabase';
import type { Profile, ProfileWithStats } from '@/types/database';

const SEARCH_LIMIT = 30;

/**
 * Recherche d'artistes par username ou display_name (insensible à la casse).
 * On exclut volontairement l'utilisateur courant des résultats.
 */
export async function searchArtists(
  query: string,
  currentUserId: string
): Promise<Profile[]> {
  const term = query.trim();
  if (term.length === 0) return [];

  const pattern = `%${term}%`;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
    .neq('id', currentUserId)
    .order('display_name', { ascending: true })
    .limit(SEARCH_LIMIT);
  if (error) throw error;
  return data ?? [];
}

/**
 * Récupère un profil avec ses compteurs (followers / following / posts)
 * + l'info « est-ce que je le suis ? ».
 */
export async function fetchProfileWithStats(
  userId: string,
  currentUserId: string
): Promise<ProfileWithStats> {
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileErr) throw profileErr;

  // 3 head:true count queries en parallèle
  const [followersRes, followingRes, postsRes, iFollowRes] = await Promise.all([
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('followed_id', userId),
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId),
    userId === currentUserId
      ? Promise.resolve({ data: null, error: null })
      : supabase
          .from('follows')
          .select('follower_id')
          .eq('follower_id', currentUserId)
          .eq('followed_id', userId)
          .maybeSingle(),
  ]);

  if (followersRes.error) throw followersRes.error;
  if (followingRes.error) throw followingRes.error;
  if (postsRes.error) throw postsRes.error;
  if (iFollowRes.error) throw iFollowRes.error;

  return {
    ...profile,
    followers_count: followersRes.count ?? 0,
    following_count: followingRes.count ?? 0,
    posts_count: postsRes.count ?? 0,
    i_follow: iFollowRes.data != null,
  };
}

export async function followUser(followerId: string, followedId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, followed_id: followedId });
  if (error) throw error;
}

export async function unfollowUser(
  followerId: string,
  followedId: string
): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followed_id', followedId);
  if (error) throw error;
}

/**
 * Récupère les posts d'un user (pour affichage dans son profil).
 */
export async function fetchUserPosts(userId: string, limit = 30) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, photo_url, text, created_at')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
