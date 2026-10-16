/**
 * CardFace — stylized card art rendered entirely in code.
 * NO copyrighted photos or logos: an abstract premium design using the
 * team's colors, bold typography, and the card's real factual data
 * (player, year, brand, set, number).
 */
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme/tokens';
import type { CardRecord } from '../data/types';

interface Props {
  card: CardRecord;
  /** Width in logical pixels; height is derived (cards are 2.5" × 3.5"). */
  width: number;
  side?: 'front' | 'back';
}

function initials(name: string): string {
  const firstPerson = name.split('/')[0]?.trim() ?? name;
  const parts = firstPerson.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

/** Darken a hex color by a factor (0–1). */
function shade(hex: string, factor: number): string {
  const n = hex.replace('#', '');
  const r = Math.round(parseInt(n.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(n.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(n.slice(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function CardFace({ card, width, side = 'front' }: Props) {
  const height = width * 1.4;
  const scale = width / 180; // type scales with card size
  const [primary, secondary] = card.teamColors;

  if (side === 'back') {
    return (
      <View style={[styles.card, { width, height, backgroundColor: shade(primary, 0.35) }]}>
        <View style={[styles.backInner, { borderColor: colors.accent }]}>
          <Text style={[styles.backNumber, { fontSize: 44 * scale }]}>#{card.number}</Text>
          <Text style={[styles.backSet, { fontSize: 13 * scale }]}>
            {card.year} {card.brand} {card.set}
          </Text>
          <View style={styles.barcode}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { width: (i % 3 === 0 ? 3 : 1.5) * scale, backgroundColor: colors.textPrimary },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.backMicro, { fontSize: 8.5 * scale }]}>
            {card.player} · {card.team}
          </Text>
          <Text style={[styles.backMicro, { fontSize: 8.5 * scale, color: colors.accent }]}>
            Sample data — values are estimates, not a guarantee.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { width, height }]}>
      <LinearGradient
        colors={[shade(primary, 1.0), shade(primary, 0.45)]}
        style={StyleSheet.absoluteFill}
      />
      {/* Abstract "photo" medallion */}
      <View style={[styles.medallion, { borderColor: secondary }]}>
        <LinearGradient
          colors={[secondary, shade(secondary, 0.5)]}
          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
        />
        <Text style={[styles.initials, { fontSize: 40 * scale, color: shade(primary, 0.9) }]}>
          {initials(card.player)}
        </Text>
      </View>

      <View style={styles.frontBody}>
        <Text style={[styles.yearBrand, { fontSize: 10 * scale }]} numberOfLines={1}>
          {card.year} · {card.brand.toUpperCase()}
        </Text>
        <Text style={[styles.player, { fontSize: 19 * scale }]} numberOfLines={2}>
          {card.player}
        </Text>
        <Text style={[styles.team, { fontSize: 11 * scale, color: secondary }]} numberOfLines={1}>
          {card.team}
        </Text>
        <View style={styles.chips}>
          {card.rookie && (
            <View style={[styles.chip, styles.rcChip]}>
              <Text style={[styles.chipText, { fontSize: 9 * scale }]}>RC</Text>
            </View>
          )}
          {card.auto && (
            <View style={styles.chip}>
              <Text style={[styles.chipText, { fontSize: 9 * scale }]}>AUTO</Text>
            </View>
          )}
          {card.serialNumbered && card.printRun && (
            <View style={styles.chip}>
              <Text style={[styles.chipText, { fontSize: 9 * scale }]}>/{card.printRun}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.footStrip, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
        <Text style={[styles.footText, { fontSize: 9.5 * scale }]} numberOfLines={1}>
          {card.set} #{card.number} · {card.variant}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  medallion: {
    width: '52%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 3,
    alignSelf: 'center',
    marginTop: '14%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: { fontWeight: '800', letterSpacing: 1 },
  frontBody: { flex: 1, alignItems: 'center', paddingHorizontal: 8, marginTop: 8 },
  yearBrand: { color: colors.textSecondary, fontWeight: '600', letterSpacing: 1.5 },
  player: { color: '#FFFFFF', fontWeight: '800', textAlign: 'center', marginTop: 2 },
  team: { fontWeight: '600', marginTop: 2 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 8 },
  chip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rcChip: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  footStrip: { paddingVertical: 6, paddingHorizontal: 8 },
  footText: { color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  backInner: {
    flex: 1,
    margin: 8,
    borderWidth: 1.5,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
  },
  backNumber: { color: '#FFFFFF', fontWeight: '800' },
  backSet: { color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  barcode: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 34 },
  bar: { height: '100%' },
  backMicro: { color: colors.textMuted, textAlign: 'center', fontWeight: '500' },
});
