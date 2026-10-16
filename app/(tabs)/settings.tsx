/** Settings — legal, privacy, data sources, demo controls. Nothing here is a dead button. */
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { useCollectionStore } from '../../src/store/collectionStore';
import { SectionHeader } from '../../src/components/SectionHeader';

export default function SettingsScreen() {
  const router = useRouter();
  const resetDemo = useCollectionStore((s) => s.resetDemo);

  const confirmReset = () => {
    Alert.alert(
      'Reset demo data?',
      'This wipes your collections and restores the 3 sample cards. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => void resetDemo() },
      ],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <SectionHeader title="Trust & legal" />
      <SettingRow
        icon="document-text"
        title="Legal & disclaimers"
        subtitle="Estimates, data sources, trademarks"
        onPress={() => router.push('/legal')}
      />
      <SettingRow
        icon="lock-closed"
        title="Privacy"
        subtitle="How your collection is kept private"
        onPress={() =>
          Alert.alert(
            'Privacy',
            'Your collection is private by default and stored only on this device in Phase 1. Nothing is uploaded anywhere. A public profile will be strictly opt-in when sharing ships.',
          )
        }
      />
      <SettingRow
        icon="pricetag"
        title="Where prices come from"
        subtitle="Sample data today, real market data later"
        onPress={() =>
          Alert.alert(
            'Price data',
            'Phase 1 uses built-in sample data so the app works with no accounts or keys. Phase 5 will plug in real sold listings (starting with free eBay sold comps) behind the same interface — every number will keep showing its source and date.',
          )
        }
      />

      <SectionHeader title="Data" />
      <SettingRow
        icon="refresh"
        title="Reset demo data"
        subtitle="Restore the 3 sample cards"
        onPress={confirmReset}
        danger
      />

      <SectionHeader title="About" />
      <SettingRow
        icon="information-circle"
        title="SlabVault"
        subtitle="Phase 1 · v1.0.0 · Expo + TypeScript"
        onPress={() =>
          Alert.alert(
            'SlabVault (working name)',
            'Phase 1: scaffold, design system, sample catalog, mock pricing, collection manager, dashboard.\n\nNext: camera scanning (Phase 2), valuation screens (Phase 3), wantlist & checklists (Phase 4), real market data (Phase 5).',
          )
        }
      />
    </ScrollView>
  );
}

function SettingRow({
  icon, title, subtitle, onPress, danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconDanger]}>
        <Ionicons name={icon} size={20} color={danger ? colors.loss : colors.accent} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 64,
  },
  pressed: { opacity: 0.7 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDanger: { backgroundColor: colors.lossDim },
  textWrap: { flex: 1 },
  rowTitle: { ...typography.subheading, color: colors.textPrimary },
  rowTitleDanger: { color: colors.loss },
  rowSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
