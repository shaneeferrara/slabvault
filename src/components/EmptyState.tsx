/**
 * EmptyState — never a dead end. Every empty screen teaches the user
 * what to do next with a clear action button.
 */
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  /** 1–2 sentences that teach the user what this screen is for and what to do. */
  message: string;
  actionTitle: string;
  onAction: () => void;
}

export function EmptyState({ icon, title, message, actionTitle, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton title={actionTitle} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
