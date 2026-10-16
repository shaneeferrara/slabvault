/** CatalogSearch — the manual search fallback: player / year / set / number. */
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { searchCatalog } from '../data/catalog';
import type { CardRecord } from '../data/types';
import { CardTile } from './CardTile';

interface Props {
  onSelect: (card: CardRecord) => void;
  autoFocus?: boolean;
}

export function CatalogSearch({ onSelect, autoFocus = false }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchCatalog(query), [query]);

  return (
    <View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search player, year, set, or card #…"
          placeholderTextColor={colors.textMuted}
          autoFocus={autoFocus}
          returnKeyType="search"
          style={styles.input}
          accessibilityLabel="Search the card catalog"
        />
        {query.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textMuted}
            onPress={() => setQuery('')}
          />
        )}
      </View>
      <Text style={styles.count}>
        {results.length} {results.length === 1 ? 'card' : 'cards'}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => <CardTile card={item} onPress={() => onSelect(item)} />}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            No matches. Try just the player's last name, or the set name.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: spacing.sm },
  count: { ...typography.micro, color: colors.textMuted, marginVertical: spacing.sm },
  noResults: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
