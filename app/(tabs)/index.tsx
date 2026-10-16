/** Dashboard — portfolio value, movers, holdings, and breakdowns. */
import { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { useCollectionStore } from '../../src/store/collectionStore';
import { CATEGORY_LABELS, getCardById } from '../../src/data/catalog';
import { getPriceProvider } from '../../src/pricing';
import { companyOf, type CollectionItem, type GradeValue } from '../../src/data/types';
import { trendPercent } from '../../src/pricing/valuation';
import { MOCK_AS_OF_LABEL, formatPercent } from '../../src/utils/format';
import { ValueLabel } from '../../src/components/ValueLabel';
import { SectionHeader } from '../../src/components/SectionHeader';
import { EmptyState } from '../../src/components/EmptyState';
import { SkeletonLoader } from '../../src/components/SkeletonLoader';
import { CardTile } from '../../src/components/CardTile';
import { LineChart } from '../../src/components/charts/LineChart';
import { BarBreakdown } from '../../src/components/charts/BarBreakdown';
import { DonutChart } from '../../src/components/charts/DonutChart';

const CATEGORY_COLORS: Record<string, string> = {
  baseball: '#4ADE80',
  basketball: '#FB923C',
  football: '#60A5FA',
  hockey: '#22D3EE',
  soccer: '#A78BFA',
  tcg: '#F472B6',
};

const GRADER_COLORS: Record<string, string> = {
  PSA: colors.psa,
  BGS: colors.bgs,
  SGC: colors.sgc,
  CGC: colors.cgc,
  RAW: colors.textMuted,
};

interface ItemValue {
  item: CollectionItem;
  value: number;
  change30: number;
  gradeValue: GradeValue;
}

function gradeValueFor(valuation: { raw: GradeValue; graded: GradeValue[] }, label: string): GradeValue {
  if (valuation.raw.gradeLabel === label) return valuation.raw;
  return valuation.graded.find((g) => g.gradeLabel === label) ?? valuation.raw;
}

export default function DashboardScreen() {
  const router = useRouter();
  const items = useCollectionStore((s) => s.items);
  const loaded = useCollectionStore((s) => s.loaded);
  const reloadStore = useCollectionStore((s) => s.load);

  const [itemValues, setItemValues] = useState<ItemValue[]>([]);
  const [history, setHistory] = useState<number[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);

  const loadValues = async () => {
    if (items.length === 0) {
      setItemValues([]);
      setHistory(null);
      return;
    }
    const provider = getPriceProvider();
    const uniqueCards = [...new Set(items.map((i) => i.cardId))];
    const valuations = await Promise.all(uniqueCards.map((id) => provider.getValuation(id)));
    const byCard = new Map(valuations.map((v) => [v.cardId, v]));
    const computed: ItemValue[] = [];
    for (const item of items) {
      const valuation = byCard.get(item.cardId);
      if (!valuation) continue;
      const gv = gradeValueFor(valuation, item.gradeLabel);
      computed.push({
        item,
        value: gv.median,
        change30: trendPercent(gv.trend30),
        gradeValue: gv,
      });
    }
    setItemValues(computed);
    const total = computed.reduce((s, iv) => s + iv.value, 0);
    setHistory(await provider.getPortfolioHistory(total, 12));
  };

  useEffect(() => {
    if (loaded) void loadValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, items]);

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadStore();
    await loadValues();
    setRefreshing(false);
  };

  const totalValue = useMemo(() => itemValues.reduce((s, iv) => s + iv.value, 0), [itemValues]);
  const costBasis = useMemo(
    () => itemValues.reduce((s, iv) => s + (iv.item.purchasePrice ?? 0), 0),
    [itemValues],
  );
  const gainLoss = totalValue - costBasis;

  const movers = useMemo(
    () => [...itemValues].sort((a, b) => Math.abs(b.change30) - Math.abs(a.change30)).slice(0, 4),
    [itemValues],
  );
  const biggest = useMemo(
    () => [...itemValues].sort((a, b) => b.value - a.value).slice(0, 5),
    [itemValues],
  );

  const byCategory = useMemo(() => {
    const sums = new Map<string, number>();
    for (const iv of itemValues) {
      const card = getCardById(iv.item.cardId);
      if (!card) continue;
      sums.set(card.category, (sums.get(card.category) ?? 0) + iv.value);
    }
    return [...sums.entries()]
      .map(([category, value]) => ({
        label: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category,
        value,
        color: CATEGORY_COLORS[category] ?? colors.accent,
      }))
      .sort((a, b) => b.value - a.value);
  }, [itemValues]);

  const byGrader = useMemo(() => {
    const sums = new Map<string, number>();
    for (const iv of itemValues) {
      const company = companyOf(iv.item.gradeLabel);
      sums.set(company, (sums.get(company) ?? 0) + iv.value);
    }
    return [...sums.entries()]
      .map(([label, value]) => ({
        label: label === 'RAW' ? 'Raw' : label,
        value,
        color: GRADER_COLORS[label] ?? colors.accent,
      }))
      .sort((a, b) => b.value - a.value);
  }, [itemValues]);

  const dataReady = loaded && (items.length === 0 || itemValues.length > 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={styles.greeting}>Your vault</Text>
      <Text style={styles.subgreeting}>
        {items.length === 0
          ? 'Track what your cards are worth.'
          : `${items.length} ${items.length === 1 ? 'card' : 'cards'} · values update with the market`}
      </Text>

      {!loaded || !dataReady ? (
        <View style={styles.card}>
          <SkeletonLoader height={40} style={{ marginBottom: spacing.sm }} />
          <SkeletonLoader height={16} width="60%" />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon="albums"
          title="Your vault is empty"
          message="Add cards from the sample catalog and watch your portfolio value, gains, and trends appear here."
          actionTitle="Add your first card"
          onAction={() => router.push('/add-card')}
        />
      ) : (
        <>
          <View style={styles.card}>
            <ValueLabel
              value={totalValue}
              source="SlabVault estimate"
              date={MOCK_AS_OF_LABEL}
              size="lg"
            />
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <ValueLabel value={costBasis} source="Your purchase prices" size="sm" />
              </View>
              <View style={styles.stat}>
                <ValueLabel
                  value={gainLoss}
                  source="Unrealized gain/loss"
                  size="sm"
                  signed
                  tone={gainLoss >= 0 ? 'gain' : 'loss'}
                />
              </View>
            </View>
          </View>

          <SectionHeader title="Value over time" subtitle="Last 12 months · SlabVault estimate" />
          <View
            style={styles.card}
            onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - spacing.lg * 2)}
          >
            {history && chartWidth > 0 ? (
              <LineChart data={history} width={chartWidth} height={140} />
            ) : (
              <SkeletonLoader height={140} />
            )}
          </View>

          <SectionHeader title="Top movers" subtitle="Biggest 30-day moves in your vault" />
          {movers.map((m) => {
            const card = getCardById(m.item.cardId);
            if (!card) return null;
            const up = m.change30 >= 0;
            return (
              <View key={m.item.id} style={styles.tileWrap}>
                <CardTile
                  card={card}
                  value={m.value}
                  valueSource="SlabVault estimate"
                  valueDate={MOCK_AS_OF_LABEL}
                  valueCaption={`${m.item.gradeLabel} · ${formatPercent(m.change30)} past 30d`}
                  valueTone={up ? 'gain' : 'loss'}
                  onPress={() => router.push({ pathname: '/card/[id]', params: { id: card.id, itemId: m.item.id } })}
                />
              </View>
            );
          })}

          <SectionHeader title="Biggest holdings" />
          {biggest.map((b) => {
            const card = getCardById(b.item.cardId);
            if (!card) return null;
            return (
              <View key={b.item.id} style={styles.tileWrap}>
                <CardTile
                  card={card}
                  value={b.value}
                  valueSource="SlabVault estimate"
                  valueDate={MOCK_AS_OF_LABEL}
                  valueCaption={b.item.gradeLabel}
                  onPress={() => router.push({ pathname: '/card/[id]', params: { id: card.id, itemId: b.item.id } })}
                />
              </View>
            );
          })}

          <SectionHeader title="By category" />
          <View style={styles.card}>
            <BarBreakdown items={byCategory} />
          </View>

          <SectionHeader title="By grader" />
          <View style={styles.card}>
            <DonutChart segments={byGrader} centerLabel="Total value" centerValue={totalValue} />
          </View>

          <Text style={styles.disclaimer}>
            Estimated values, not a guarantee. Based on sample data in Phase 1 — not live market data.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { ...typography.title, color: colors.textPrimary },
  subgreeting: { ...typography.caption, color: colors.textMuted, marginTop: 4, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  statsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  stat: { flex: 1 },
  tileWrap: { marginBottom: spacing.sm },
  disclaimer: {
    ...typography.micro,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
