import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { followUser, unfollowUser } from '@/lib/follows';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';

interface FollowButtonProps {
  targetUserId: string;
  initialFollowed: boolean;
  onChange?: (followed: boolean) => void;
  compact?: boolean;
}

export function FollowButton({
  targetUserId,
  initialFollowed,
  onChange,
  compact = false,
}: FollowButtonProps) {
  const { user } = useAuth();
  const [followed, setFollowed] = useState(initialFollowed);
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    setFollowed(initialFollowed);
  }, [initialFollowed]);

  async function handlePress() {
    if (!user || busy) return;
    const wasFollowed = followed;
    setFollowed(!wasFollowed);
    setBusy(true);
    try {
      if (wasFollowed) {
        await unfollowUser(user.id, targetUserId);
      } else {
        await followUser(user.id, targetUserId);
      }
      onChange?.(!wasFollowed);
    } catch (err) {
      setFollowed(wasFollowed);
      const msg = err instanceof Error ? err.message : 'Action impossible';
      Alert.alert('Erreur', msg);
    } finally {
      setBusy(false);
    }
  }

  const label = followed ? 'Suivi' : 'Suivre';

  return (
    <Pressable
      onPress={handlePress}
      disabled={busy}
      style={[
        styles.btn,
        compact && styles.btnCompact,
        followed ? styles.btnFollowed : styles.btnNotFollowed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={followed ? 'Ne plus suivre' : 'Suivre'}
    >
      {busy ? (
        <ActivityIndicator
          size="small"
          color={followed ? colors.textPrimary : colors.bgDeep}
        />
      ) : (
        <Text
          style={[
            styles.label,
            compact && styles.labelCompact,
            followed ? styles.labelFollowed : styles.labelNotFollowed,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 40,
    minWidth: 96,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompact: {
    height: 32,
    minWidth: 80,
    paddingHorizontal: spacing.md,
  },
  btnNotFollowed: {
    backgroundColor: colors.neonLime,
  },
  btnFollowed: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  label: {
    fontFamily: fonts.bodySemibold,
    fontSize: fontSize.base,
    letterSpacing: 0.3,
  },
  labelCompact: {
    fontSize: fontSize.sm,
  },
  labelNotFollowed: {
    color: colors.bgDeep,
  },
  labelFollowed: {
    color: colors.textPrimary,
  },
});
