/**
 * ValueLabel — the ONLY way numbers are shown in SlabVault.
 * Every figure renders with its source and date, e.g. "$1,050 · eBay · Oct 2026".
 * If a number can't name its source, it doesn't ship.
 */
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme/tokens';
import { formatPercent, formatSignedUSD, formatUSD } from '../utils/format';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'default' | 'gain' | 'loss' | 'accent';

interface Props {
  value: number;
  /** Where the number came from, e.g. "eBay sold comps". */
  source: string;
  /** When, e.g. "Oct 2026" or "Oct 16, 2026". */
  date?: string;
  size?: Size;
  tone?: Tone;
  /** Render as +$250 / −$250. */
  signed?: boolean;
  /** Render as +12.4% instead of dollars. */
  percent?: boolean;
  /** Hide the source caption (only for tight spaces — the detail screen still shows it). */
  hideSource?: boolean;
}

const sizeStyles = {
  sm: typography.body,
  md: typography.heading,
  lg: typography.display,
} as const;

const toneColors: Record<Tone, string> = {
  default: colors.textPrimary,
  gain: colors.gain,
  loss: colors.loss,
  accent: colors.accent,
};

export function ValueLabel({
  value, source, date, size = 'md', tone = 'default',
  signed = false, percent = false, hideSource = false,
}: Props) {
  const text = percent
    ? formatPercent(value)
    : signed
      ? formatSignedUSD(value)
      : formatUSD(value);
  return (
    <View>
      <Text style={[sizeStyles[size], { color: toneColors[tone] }]}>{text}</Text>
      {!hideSource && (
        <Text style={styles.source}>
          {source}
          {date ? ` · ${date}` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  source: {
    ...typography.micro,
    color: colors.textMuted,
    marginTop: 2,
  },
});
