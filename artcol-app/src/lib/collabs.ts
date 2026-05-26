import { supabase } from '@/lib/supabase';
import type { CollabStatus, CollaborationWithUsers } from '@/types/database';

const COLLAB_EMBED = `
  *,
  initiator:profiles!collaborations_initiator_id_fkey(*),
  recipient:profiles!collaborations_recipient_id_fkey(*)
`;

/**
 * Liste les collabs visibles par l'utilisateur (initiator OU recipient).
 * Triées par date desc.
 */
export async function fetchMyCollabs(
  userId: string
): Promise<CollaborationWithUsers[]> {
  const { data, error } = await supabase
    .from('collaborations')
    .select(COLLAB_EMBED)
    .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalize);
}

export async function fetchCollabDetail(collabId: string): Promise<CollaborationWithUsers> {
  const { data, error } = await supabase
    .from('collaborations')
    .select(COLLAB_EMBED)
    .eq('id', collabId)
    .single();
  if (error) throw error;
  return normalize(data);
}

export async function createCollab(params: {
  initiatorId: string;
  recipientId: string;
  title: string;
  description: string | null;
}): Promise<string> {
  if (params.initiatorId === params.recipientId) {
    throw new Error('Tu ne peux pas proposer une collab à toi-même.');
  }
  const { data, error } = await supabase
    .from('collaborations')
    .insert({
      initiator_id: params.initiatorId,
      recipient_id: params.recipientId,
      title: params.title.trim(),
      description: params.description?.trim() || null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function respondToCollab(
  collabId: string,
  status: Extract<CollabStatus, 'accepted' | 'declined'>
): Promise<void> {
  const { error } = await supabase
    .from('collaborations')
    .update({ status })
    .eq('id', collabId);
  if (error) throw error;
}

export async function cancelCollab(collabId: string): Promise<void> {
  const { error } = await supabase
    .from('collaborations')
    .update({ status: 'cancelled' })
    .eq('id', collabId);
  if (error) throw error;
}

/**
 * PostgREST renvoie les embeds en array même quand la FK est unique : on normalise.
 */
function normalize(row: any): CollaborationWithUsers {
  return {
    ...row,
    initiator: Array.isArray(row.initiator) ? row.initiator[0] : row.initiator,
    recipient: Array.isArray(row.recipient) ? row.recipient[0] : row.recipient,
  };
}
