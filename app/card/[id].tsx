/**
 * Card detail — stylized art with flip + zoom, raw vs graded values,
 * comps with source + date on every figure, and trend chart.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATALOG, CATEGORY_LABELS, getCardById } from '../../src/data/catalog';
import { GRADE_LABELS, type CardValuation, type CollectionItem, type GradeLabel, type GradeValue } from '../../src/data/types';
import { getPriceProvider } from '../../src/pricing';
import { trendPercent } from '../../src/pricing/valuation';
import { MOCK_AS_OF_LABEL, formatMonthYear, formatPercent } from '../../src/utils/format';
import { colors, minTouchTarget, radii, spacing, typography } from '../../src/theme/tokens';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { CardFace } from '../../src/components/CardFace';
import { ValueLabel } from '../../src/components/ValueLabel';
import { SectionHeader } from '../../src/components/SectionHeader';
import { SkeletonLoader } from '../../src/components/SkeletonLoader';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { LineChart } from '../../src/components/charts/LineChart';
import { useCollectionStore } from '../../src/store/collectionStore';

// Static export: pre-render one page per catalog card.
export async function generateStaticParams() {
  return CATALOG.map((c) => ({ id: c.id }));
}

const CONFIDENCE_TONE: Record<string, 'gain' | 'accent' | 'loss'> = {
  high: 'gain',
  medium: 'accent',
  low: 'loss',
};

export default function CardDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId?: string }>();
  const card = getCardById(id ?? '');

  const [valuation, setValuation] = useState<CardValuation | null>(null);
  const [grade, setGrade] = useState<GradeLabel>('PSA 10');
  const [flipped, setFlipped] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);

  const flip = useRef(new Animated.Value(0)).current;
  const zoom = useRef(new Animated.Value(1)).current;
  const zoomed = useRef(false);

  const items = useCollectionStore((s) => s.items);
  const deleteItem = useCollectionStore((s) => s.deleteItem);
  const item: CollectionItem | undefined = items.find((i) => i.id === itemId);

  useEffect(() => {
    let cancelled = false;
    if (card) {
      void getPriceProvider()
        .getValuation(card.id)
        .then((v) => {
          if (!cancelled) setValuation(v);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [card]);

  if (!card) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Card not found" />
        <Text style={styles.error}>This card isn't in the catalog.</Text>
      </SafeAreaView>
    );
  }

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    Animated.timing(flip, { toValue: next ? 1 : 0, duration: 450, useNativeDriver: true }).start();
  };

  const toggleZoom = () => {
    zoomed.current = !zoomed.current;
    Animated.timing(zoom, {
      toValue: zoomed.current ? 1.7 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const allGrades: GradeValue[] = valuation ? [valuation.raw, ...valuation.graded] : [];
  const selected: GradeValue | undefined = allGrades.find((g) => g.gradeLabel === grade);
  const raw = valuation?.raw;
  const gradeComps = (valuation?.comps ?? []).filter((c) => c.gradeLabel === grade).slice(0, 8);
  const change90 = selected ? trendPercent(selected.trend90) : 0;

  const cardWidth = Math.min(Dimensions.get('window').width - 96, 280);

  const confirmRemove = () => {
    if (!item) return;
    Alert.alert('Remove this card?', 'It will be removed from your collection.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          void deleteItem(item.id).then(() => router.back());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader
        title={card.player}
        right={
          <Pressable
            onPress={toggleFlip}
            accessibilityRole="button"
            accessibilityLabel="Flip card"
            style={styles.flipButton}
          >
            <Ionicons name="repeat" size={22} color={colors.accent} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card art with flip + zoom */}
        <View style={styles.stage}>
          <Animated.View style={{ transform: [{ scale: zoom }] }}>
            <Pressable onPress={toggleZoom} accessibilityLabel="Tap to zoom the card">
              <Animated.View style={{ transform: [{ rotateY: frontRotate }], backfaceVisibility: 'hidden' }}>
                <CardFace card={card} width={cardWidth} side="front" />
              </Animated.View>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { transform: [{ rotateY: backRotate }], backfaceVisibility: 'hidden' },
                ]}
              >
                <CardFace card={card} width={cardWidth} side="back" />
              </Animated.View>
            </Pressable>
          </Animated.View>
        </View>
        <Text style={styles.stageHint}>Tap the card to zoom · tap the flip icon to see the back</Text>

        {/* Identity */}
        <Text style={styles.player}>{card.player}</Text>
        <Text style={styles.identity}>
          {card.year} {card.brand} {card.set} #{card.number} · {card.variant}
        </Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CATEGORY_LABELS[card.category]}</Text>
          </View>
          {card.rookie && (
            <View style={[styles.badge, styles.badgeAccent]}>
              <Text style={[styles.badgeText, styles.badgeTextAccent]}>Rookie</Text>
            </View>
          )}
          {card.serialNumbered && card.printRun && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>/{card.printRun}</Text>
            </View>
          )}
        </View>

        {/* Grade picker */}
        <SectionHeader title="Grade" subtitle="Values update per grade" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeChips}>
          {GRADE_LABELS.map((g) => (
            <Pressable
              key={g}
              onPress={() => setGrade(g)}
              accessibilityRole="button"
              style={[styles.gradeChip, grade === g && styles.gradeChipSelected]}
            >
              <Text style={[styles.gradeChipText, grade === g && styles.gradeChipTextSelected]}>
                {g}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Raw vs graded side by side */}
        <SectionHeader title="Value" subtitle="Median of recent sold listings" />
        {!valuation || !selected || !raw ? (
          <SkeletonLoader height={110} />
        ) : (
          <View style={styles.vsRow}>
            <View style={styles.vsBox}>
              <Text style={styles.vsLabel}>Raw</Text>
              <ValueLabel value={raw.median} source={valuation.source} date={MOCK_AS_OF_LABEL} size="md" />
              <Text style={styles.vsRange}>
                Range ${Math.round(raw.low).toLocaleString()}–${Math.round(raw.high).toLocaleString()}
              </Text>
            </View>
            <View style={styles.vsBox}>
              <Text style={styles.vsLabel}>{grade}</Text>
              <ValueLabel value={selected.median} source={valuation.source} date={MOCK_AS_OF_LABEL} size="md" tone="accent" />
              <Text style={styles.vsRange}>
                Range ${Math.round(selected.low).toLocaleString()}–${Math.round(selected.high).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        {selected && (
          <View style={styles.confRow}>
            <View style={[styles.confChip, { borderColor: colors.border }]}>
              <Text style={styles.confText}>
                Confidence: <Text style={{ color: colors[CONFIDENCE_TONE[selected.confidence] ?? 'accent'], fontWeight: '700' }}>
                  {selected.confidence.toUpperCase()}
                </Text> · {selected.volume} sold comps
              </Text>
            </View>
          </View>
        )}
        <Text style={styles.estimateNote}>Estimated value, not a guarantee.</Text>

        {/* Trend */}
        <SectionHeader title="90-day trend" subtitle={`${grade} · ${formatPercent(change90)}`} />
        <View
          style={styles.card}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - spacing.lg * 2)}
        >
          {selected && chartWidth > 0 ? (
            <LineChart
              data={selected.trend90}
              width={chartWidth}
              height={130}
              color={change90 >= 0 ? colors.gain : colors.loss}
            />
          ) : (
            <SkeletonLoader height={130} />
          )}
        </View>

        {/* Comps */}
        <SectionHeader
          title="Recent sold comps"
          subtitle={`${grade} · newest first · sold prices only, never asking prices`}
        />
        {!valuation ? (
          <SkeletonLoader height={200} />
        ) : gradeComps.length === 0 ? (
          <Text style={styles.noComps}>No sold comps for this grade yet — check back later.</Text>
        ) : (
          gradeComps.map((comp) => (
            <View key={comp.id} style={[styles.compRow, comp.flagged && styles.compFlagged]}>
              <View style={styles.compLeft}>
                <ValueLabel
                  value={comp.price}
                  source={comp.platform}
                  date={formatMonthYear(comp.date)}
                  size="sm"
                />
                {comp.flagged && (
                  <View style={styles.flagRow}>
                    <Ionicons name="warning" size={14} color={colors.loss} />
                    <Text style={styles.flagText}>{comp.flagged}</Text>
                  </View>
                )}
              </View>
              <Ionicons name={comp.flagged ? 'flag' : 'checkmark-circle'} size={18} color={comp.flagged ? colors.loss : colors.gain} />
            </View>
          ))
        )}

        {/* Your copy / add */}
        {item ? (
          <>
            <SectionHeader title="Your copy" />
            <View style={styles.card}>
              <DetailLine label="Grade" value={item.gradeLabel} />
              {item.certNumber && <DetailLine label="Cert #" value={item.certNumber} />}
              {item.purchasePrice !== undefined && (
                <DetailLine
                  label="You paid"
                  value={`$${item.purchasePrice.toLocaleString()}${item.acquiredDate ? ` · ${item.acquiredDate}` : ''}`}
                />
              )}
              {item.source && <DetailLine label="Source" value={item.source} />}
              {item.storageLocation && <DetailLine label="Stored" value={item.storageLocation} />}
              {item.notes ? <DetailLine label="Notes" value={item.notes} /> : null}
            </View>
            <View style={styles.buttonRow}>
              <View style={styles.buttonFlex}>
                <PrimaryButton
                  title="Edit details"
                  variant="secondary"
                  onPress={() => router.push({ pathname: '/add-card', params: { itemId: item.id } })}
                />
              </View>
              <View style={styles.buttonFlex}>
                <PrimaryButton title="Remove" variant="danger" onPress={confirmRemove} />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.addWrap}>
            <PrimaryButton
              title="Add to collection"
              onPress={() => router.push({ pathname: '/add-card', params: { cardId: card.id } })}
              icon={<Ionicons name="add" size={20} color={colors.accentText} />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  error: { ...typography.body, color: colors.textSecondary, padding: spacing.lg },
  flipButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: { alignItems: 'center', paddingVertical: spacing.md },
  stageHint: { ...typography.micro, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  player: { ...typography.title, color: colors.textPrimary, textAlign: 'center' },
  identity: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  badges: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    backgroundColor: colors.surface,
  },
  badgeAccent: { backgroundColor: colors.accent, borderColor: colors.accent },
  badgeText: { ...typography.micro, color: colors.textSecondary, fontWeight: '700' },
  badgeTextAccent: { color: colors.accentText },
  gradeChips: { gap: spacing.sm, paddingRight: spacing.lg },
  gradeChip: {
    minHeight: minTouchTarget - 8,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  gradeChipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  gradeChipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  gradeChipTextSelected: { color: colors.accentText },
  vsRow: { flexDirection: 'row', gap: spacing.sm },
  vsBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  vsLabel: { ...typography.micro, color: colors.textMuted, fontWeight: '700', marginBottom: 4 },
  vsRange: { ...typography.micro, color: colors.textMuted, marginTop: 6 },
  confRow: { marginTop: spacing.sm },
  confChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  confText: { ...typography.caption, color: colors.textSecondary },
  estimateNote: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  compFlagged: { borderColor: colors.loss },
  compLeft: { flex: 1 },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  flagText: { ...typography.micro, color: colors.loss, flex: 1 },
  noComps: { ...typography.body, color: colors.textSecondary, textAlign: 'center', padding: spacing.lg },
  detailLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: { ...typography.caption, color: colors.textMuted },
  detailValue: { ...typography.caption, color: colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: spacing.md },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  buttonFlex: { flex: 1 },
  addWrap: { marginTop: spacing.lg },
});
