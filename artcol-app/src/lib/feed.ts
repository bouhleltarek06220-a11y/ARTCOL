import { supabase } from '@/lib/supabase';
import type { PostWithMeta, CommentWithAuthor } from '@/types/database';

const FEED_PAGE_SIZE = 50;

/**
 * Récupère le feed global (tous les posts) avec auteur, compteurs likes/comments
 * et l'info « est-ce que l'utilisateur courant a liké ce post ».
 *
 * Stratégie :
 * 1. Un seul SELECT sur posts avec embed de profiles + count(post_likes) + count(post_comments)
 * 2. Un SELECT séparé sur post_likes pour mes likes (sur les ids retournés)
 * 3. Merge des deux en mémoire
 */
export async function fetchFeed(currentUserId: string): Promise<PostWithMeta[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      author_id,
      text,
      photo_url,
      created_at,
      updated_at,
      author:profiles!posts_author_id_fkey(*),
      likes:post_likes(count),
      comments:post_comments(count)
    `
    )
    .order('created_at', { ascending: false })
    .limit(FEED_PAGE_SIZE);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const postIds = data.map((p) => p.id);
  const { data: likedRows, error: likedErr } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', currentUserId)
    .in('post_id', postIds);
  if (likedErr) throw likedErr;
  const likedSet = new Set((likedRows ?? []).map((r) => r.post_id));

  return data.map((p) => {
    // PostgREST renvoie author en array si la relation n'est pas marquée "unique",
    // ici la FK l'est mais on normalise par sécurité.
    const author = Array.isArray(p.author) ? p.author[0] : p.author;
    const likesCount = Array.isArray(p.likes) ? p.likes[0]?.count ?? 0 : 0;
    const commentsCount = Array.isArray(p.comments)
      ? p.comments[0]?.count ?? 0
      : 0;
    return {
      id: p.id,
      author_id: p.author_id,
      text: p.text,
      photo_url: p.photo_url,
      created_at: p.created_at,
      updated_at: p.updated_at,
      author,
      likes_count: likesCount,
      comments_count: commentsCount,
      liked_by_me: likedSet.has(p.id),
    } as PostWithMeta;
  });
}

/**
 * Récupère un post unique avec ses méta + commentaires + auteurs des commentaires.
 */
export async function fetchPostWithComments(
  postId: string,
  currentUserId: string
): Promise<{ post: PostWithMeta; comments: CommentWithAuthor[] }> {
  const { data: postRow, error: postErr } = await supabase
    .from('posts')
    .select(
      `
      id,
      author_id,
      text,
      photo_url,
      created_at,
      updated_at,
      author:profiles!posts_author_id_fkey(*),
      likes:post_likes(count),
      comments:post_comments(count)
    `
    )
    .eq('id', postId)
    .single();

  if (postErr) throw postErr;

  const { data: likedRow } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', currentUserId)
    .eq('post_id', postId)
    .maybeSingle();

  const { data: commentsRows, error: commentsErr } = await supabase
    .from('post_comments')
    .select(
      `
      id,
      post_id,
      author_id,
      text,
      created_at,
      author:profiles!post_comments_author_id_fkey(*)
    `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (commentsErr) throw commentsErr;

  const author = Array.isArray(postRow.author) ? postRow.author[0] : postRow.author;
  const likesCount = Array.isArray(postRow.likes)
    ? postRow.likes[0]?.count ?? 0
    : 0;
  const commentsCount = Array.isArray(postRow.comments)
    ? postRow.comments[0]?.count ?? 0
    : 0;

  const post: PostWithMeta = {
    id: postRow.id,
    author_id: postRow.author_id,
    text: postRow.text,
    photo_url: postRow.photo_url,
    created_at: postRow.created_at,
    updated_at: postRow.updated_at,
    author,
    likes_count: likesCount,
    comments_count: commentsCount,
    liked_by_me: likedRow != null,
  };

  const comments: CommentWithAuthor[] = (commentsRows ?? []).map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    text: c.text,
    created_at: c.created_at,
    author: Array.isArray(c.author) ? c.author[0] : c.author,
  }));

  return { post, comments };
}

/**
 * Crée un nouveau post (texte et/ou photo). Renvoie l'id du post créé.
 */
export async function createPost(params: {
  authorId: string;
  text: string | null;
  photoUrl: string | null;
}): Promise<string> {
  if (!params.text && !params.photoUrl) {
    throw new Error('Un post doit contenir au moins du texte ou une photo.');
  }
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: params.authorId,
      text: params.text,
      photo_url: params.photoUrl,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

/**
 * Like ou unlike un post (idempotent). Renvoie le nouvel état.
 */
export async function toggleLike(
  postId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<boolean> {
  if (currentlyLiked) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId });
  if (error) throw error;
  return true;
}

/**
 * Ajoute un commentaire et renvoie l'objet enrichi (avec auteur).
 */
export async function addComment(params: {
  postId: string;
  authorId: string;
  text: string;
}): Promise<CommentWithAuthor> {
  const trimmed = params.text.trim();
  if (trimmed.length === 0) throw new Error('Le commentaire est vide.');

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: params.postId,
      author_id: params.authorId,
      text: trimmed,
    })
    .select(
      `
      id,
      post_id,
      author_id,
      text,
      created_at,
      author:profiles!post_comments_author_id_fkey(*)
    `
    )
    .single();

  if (error) throw error;

  return {
    id: data.id,
    post_id: data.post_id,
    author_id: data.author_id,
    text: data.text,
    created_at: data.created_at,
    author: Array.isArray(data.author) ? data.author[0] : data.author,
  };
}
