/**
 * Types Supabase (Phase 1 + 3 — manuels, à régénérer plus tard avec `supabase gen types`)
 * Reflète les schémas SQL dans supabase/schema.sql et supabase/migrations/.
 */

export type ArtDomain =
  | 'music'
  | 'dance'
  | 'visual_arts'
  | 'photography'
  | 'video'
  | 'writing'
  | 'theater'
  | 'craft'
  | 'other';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  art_domains: ArtDomain[];
  city: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  text: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  text: string;
  created_at: string;
}

/**
 * Vues enrichies côté client (assemblées via select embed + merge manuel).
 */
export interface PostWithMeta extends Post {
  author: Profile;
  likes_count: number;
  comments_count: number;
  liked_by_me: boolean;
}

export interface CommentWithAuthor extends PostComment {
  author: Profile;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Post, 'id' | 'author_id' | 'created_at'>>;
      };
      post_likes: {
        Row: PostLike;
        Insert: Omit<PostLike, 'created_at'> & { created_at?: string };
        Update: never;
      };
      post_comments: {
        Row: PostComment;
        Insert: Omit<PostComment, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Pick<PostComment, 'text'>>;
      };
    };
  };
}
