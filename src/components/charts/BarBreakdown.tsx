/**
 * BarBreakdown — horizontal bars for "value by sport" style breakdowns.
 * Pure views (no SVG needed for straight bars).
 */
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { formatUSD } from '../../utils/format';

export interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  items: BarItem[];
}

export function BarBreakdown({ items }: Props) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.max((item.value / max) * 100, 2)}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <Text style={styles.value}>{formatUSD(item.value)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.caption, color: colors.textSecondary, width: 84 },
  track: {
    flex: 1,
    height: 14,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radii.pill },
  value: { ...typography.caption, color: colors.textPrimary, fontWeight: '600', width: 76, textAlign: 'right' },
});
