/**
 * Scan tab — Phase 1: camera scanning arrives in Phase 2. This screen shows
 * what's coming AND the fully working manual "add a card" flow, so there
 * are no dead ends.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SectionHeader } from '../../src/components/SectionHeader';
import { CatalogSearch } from '../../src/components/CatalogSearch';
import { getCardById } from '../../src/data/catalog';

const COMING_SOON = [
  'Point the camera at a card — edge detection and auto-crop',
  'Glare warnings so the photo is actually usable',
  'Batch mode: scan 50 cards back to back',
  'Slab label OCR — reads the grader, grade, and cert number',
  'Top-3 matches with confidence scores; your corrections improve it',
];

export default function ScanScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Scan a card</Text>

      <View style={styles.panel}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera" size={40} color={colors.accent} />
        </View>
        <Text style={styles.panelTitle}>Camera scanning arrives in Phase 2</Text>
        <Text style={styles.panelSub}>
          The north star: point your camera at a card and in under 3 seconds see what it is,
          what it's worth raw and graded, and whether it's going up or down.
        </Text>
        {COMING_SOON.map((line) => (
          <View key={line} style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
            <Text style={styles.bullet}>{line}</Text>
          </View>
        ))}
        <View style={styles.buttonWrap}>
          <PrimaryButton
            title="Add a card manually"
            onPress={() => router.push('/add-card')}
            icon={<Ionicons name="add" size={20} color={colors.accentText} />}
          />
        </View>
        <Text style={styles.manualNote}>
          Manual add works today: search the catalog, pick your card and grade, log what you paid.
        </Text>
      </View>

      <SectionHeader
        title="Browse the catalog"
        subtitle="Tap any card to see its values, comps, and trends"
      />
      <CatalogSearch
        onSelect={(card) => {
          const full = getCardById(card.id);
          if (full) router.push(`/card/${full.id}`);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.md },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  panelTitle: { ...typography.heading, color: colors.textPrimary, textAlign: 'center' },
  panelSub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.sm,
  },
  bullet: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  buttonWrap: { width: '100%', marginTop: spacing.sm },
  manualNote: {
    ...typography.micro,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
