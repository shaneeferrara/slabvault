/**
 * DonutChart — SVG donut for breakdowns (e.g. value by grader).
 * Cross-platform via react-native-svg.
 */
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, typography } from '../../theme/tokens';
import { formatUSD } from '../../utils/format';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: number;
}

export function DonutChart({ segments, size = 168, centerLabel, centerValue }: Props) {
  const thickness = 26;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  let offset = 0;
  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={colors.surfaceElevated} strokeWidth={thickness} fill="none"
          />
          {segments.map((seg) => {
            const frac = seg.value / total;
            const dash = frac * circumference;
            const el = (
              <Circle
                key={seg.label}
                cx={size / 2} cy={size / 2} r={radius}
                stroke={seg.color} strokeWidth={thickness} fill="none"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                rotation={-90}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
            offset += dash;
            return el;
          })}
        </Svg>
        <View style={styles.center}>
          {centerLabel ? <Text style={styles.centerLabel}>{centerLabel}</Text> : null}
          {centerValue !== undefined ? (
            <Text style={styles.centerValue}>{formatUSD(centerValue)}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.legend}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{seg.label}</Text>
            <Text style={styles.legendValue}>{formatUSD(seg.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: { ...typography.micro, color: colors.textMuted },
  centerValue: { ...typography.heading, color: colors.textPrimary },
  legend: { flex: 1, gap: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  legendValue: { ...typography.caption, color: colors.textPrimary, fontWeight: '600' },
});
