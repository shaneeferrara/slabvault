/** CardTile — one tappable row for a card: art, identity, and value. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, radii, spacing, typography } from '../theme/tokens';
import type { CardRecord } from '../data/types';
import { CardFace } from './CardFace';
import { ValueLabel } from './ValueLabel';

interface Props {
  card: CardRecord;
  /** Current estimated value — omit to show a chevron instead (e.g. search results). */
  value?: number;
  valueSource?: string;
  valueDate?: string;
  /** Small line under the value, e.g. the grade or "+12% this month". */
  valueCaption?: string;
  valueTone?: 'default' | 'gain' | 'loss' | 'accent';
  onPress: () => void;
}

export function CardTile({
  card, value, valueSource, valueDate, valueCaption, valueTone = 'default', onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <CardFace card={card} width={56} />
      <View style={styles.textWrap}>
        <Text style={styles.name} numberOfLines={1}>
          {card.player}
          {card.rookie ? <Text style={styles.rc}> RC</Text> : null}
        </Text>
        <Text style={styles.meta} numberOfLines={2}>
          {card.year} {card.brand} {card.set} #{card.number}
          {card.variant !== 'Base' ? ` · ${card.variant}` : ''}
        </Text>
        {valueCaption ? <Text style={styles.caption}>{valueCaption}</Text> : null}
      </View>
      {value !== undefined ? (
        <ValueLabel
          value={value}
          source={valueSource ?? 'Sample data'}
          date={valueDate}
          size="sm"
          tone={valueTone}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    minHeight: minTouchTarget + 24,
  },
  pressed: { opacity: 0.75 },
  textWrap: { flex: 1 },
  name: { ...typography.subheading, color: colors.textPrimary },
  rc: { color: colors.accent, fontWeight: '800' },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  caption: { ...typography.micro, color: colors.textMuted, marginTop: 2 },
});
