/**
 * Types Supabase générés (Phase 1 — manuels, à régénérer plus tard avec `supabase gen types`)
 * Reflète le schéma SQL dans supabase/schema.sql
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
    };
  };
}
