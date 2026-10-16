/** Legal & disclaimers — plain-English trust screen. */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '../src/theme/tokens';
import { ScreenHeader } from '../src/components/ScreenHeader';

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: 'Values are estimates, not financial advice',
    body: 'Every dollar figure in SlabVault is an estimate built from recent sold listings. The market moves, individual cards vary, and no estimate is a guarantee of what your card will sell for. SlabVault is a tracking tool, not a financial advisor — don\'t buy, sell, or grade a card based solely on these numbers.',
  },
  {
    title: 'Where the numbers come from',
    body: 'Phase 1 runs on built-in sample data so the app works with no accounts, keys, or network. Every figure shows its source and date. When real market data is connected (starting with free eBay sold comps), each value will keep naming its exact source and sale dates — never asking prices, only completed sales.',
  },
  {
    title: 'Your photos stay yours',
    body: 'Card photos you add in later phases are stored as your private data. SlabVault will never use your photos to train models or share them without your explicit action.',
  },
  {
    title: 'Trademarks and card data',
    body: 'Player names, teams, card sets, and prices are factual data. Card artwork in this app is original stylized art rendered in code — no copied card images, and no unlicensed league or brand logos. Pokémon, baseball, basketball, football, hockey, and soccer marks belong to their respective owners.',
  },
  {
    title: 'Privacy: private by default',
    body: 'Your collection is private. In Phase 1 it lives only on this device. Any future public profile or sharing feature will be strictly opt-in, with values hideable.',
  },
  {
    title: 'Offline',
    body: 'Your collection is stored on-device and stays viewable without a signal. When you\'re back online, it syncs — no full-offline gymnastics required in v1.',
  },
];

export default function LegalScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title="Legal & disclaimers" />
      <ScrollView contentContainerStyle={styles.content}>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.card}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardBody}>{s.body}</Text>
          </View>
        ))}
        <Text style={styles.footer}>SlabVault (working name) · Phase 1 · October 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.subheading, color: colors.accent, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textSecondary },
  footer: { ...typography.micro, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
});
