/** Collection — browse collections, manage items, add new cards. */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchTarget, radii, spacing, typography } from '../../src/theme/tokens';
import { useCollectionStore } from '../../src/store/collectionStore';
import { getCardById } from '../../src/data/catalog';
import { getPriceProvider } from '../../src/pricing';
import { MOCK_AS_OF_LABEL } from '../../src/utils/format';
import { CardTile } from '../../src/components/CardTile';
import { EmptyState } from '../../src/components/EmptyState';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SectionHeader } from '../../src/components/SectionHeader';
import { SkeletonLoader } from '../../src/components/SkeletonLoader';

export default function CollectionScreen() {
  const router = useRouter();
  const collections = useCollectionStore((s) => s.collections);
  const items = useCollectionStore((s) => s.items);
  const loaded = useCollectionStore((s) => s.loaded);
  const activeCollectionId = useCollectionStore((s) => s.activeCollectionId);
  const setActiveCollection = useCollectionStore((s) => s.setActiveCollection);
  const createCollection = useCollectionStore((s) => s.createCollection);
  const deleteCollection = useCollectionStore((s) => s.deleteCollection);

  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  // Current value per item (for the list rows).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const provider = getPriceProvider();
      const unique = [...new Set(items.map((i) => i.cardId))];
      const vals = await Promise.all(unique.map((id) => provider.getValuation(id)));
      if (cancelled) return;
      const map = new Map<string, number>();
      for (const item of items) {
        const v = vals.find((x) => x.cardId === item.cardId);
        if (!v) continue;
        const gv =
          v.raw.gradeLabel === item.gradeLabel
            ? v.raw
            : v.graded.find((g) => g.gradeLabel === item.gradeLabel) ?? v.raw;
        map.set(item.id, gv.median);
      }
      setValues(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  const activeName = useMemo(
    () =>
      activeCollectionId
        ? collections.find((c) => c.id === activeCollectionId)?.name ?? 'Collection'
        : 'All collections',
    [activeCollectionId, collections],
  );

  const submitNewCollection = async () => {
    if (!newName.trim()) return;
    await createCollection(newName);
    setNewName('');
    setModalOpen(false);
  };

  const confirmDeleteCollection = (id: string, name: string) => {
    Alert.alert(
      `Delete "${name}"?`,
      'This also removes every card inside it. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void deleteCollection(id),
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Collection</Text>
          <Text style={styles.subtitle}>{activeName} · {items.length} {items.length === 1 ? 'card' : 'cards'}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/add-card')}
          accessibilityRole="button"
          accessibilityLabel="Add a card"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={24} color={colors.accentText} />
        </Pressable>
      </View>

      {/* Collection picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        <Chip
          label="All"
          selected={activeCollectionId === null}
          onPress={() => setActiveCollection(null)}
        />
        {collections.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            selected={activeCollectionId === c.id}
            onPress={() => setActiveCollection(c.id)}
            onLongPress={() => confirmDeleteCollection(c.id, c.name)}
          />
        ))}
        <Chip label="+ New" selected={false} onPress={() => setModalOpen(true)} dashed />
      </ScrollView>
      <Text style={styles.hint}>Tip: long-press a collection to delete it.</Text>

      {!loaded ? (
        <View style={styles.list}>
          <SkeletonLoader height={92} style={{ marginBottom: spacing.sm }} />
          <SkeletonLoader height={92} style={{ marginBottom: spacing.sm }} />
          <SkeletonLoader height={92} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.list}>
          <EmptyState
            icon="add-circle"
            title={activeCollectionId ? 'This collection is empty' : 'No cards yet'}
            message="Search the sample catalog by player, year, set, or card number, then add cards with their grade and what you paid."
            actionTitle="Add a card"
            onAction={() => router.push('/add-card')}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => {
            const card = getCardById(item.cardId);
            if (!card) return null;
            return (
              <CardTile
                card={card}
                value={values.get(item.id)}
                valueSource="SlabVault estimate"
                valueDate={MOCK_AS_OF_LABEL}
                valueCaption={`${item.gradeLabel}${item.purchasePrice ? ` · paid $${item.purchasePrice}` : ''}`}
                onPress={() => router.push(`/card/${card.id}?itemId=${item.id}`)}
              />
            );
          }}
        />
      )}

      {/* New collection modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setModalOpen(false)}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.modalTitle}>New collection</Text>
            <Text style={styles.modalSub}>Name it anything — "Jordan PC", "For Sale", "Wax Box Pulls".</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Collection name"
              placeholderTextColor={colors.textMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => void submitNewCollection()}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <PrimaryButton title="Cancel" variant="secondary" onPress={() => setModalOpen(false)} />
              <PrimaryButton title="Create" onPress={() => void submitNewCollection()} disabled={!newName.trim()} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Chip({
  label, selected, onPress, onLongPress, dashed = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  dashed?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        dashed && styles.chipDashed,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  addButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: minTouchTarget / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  chips: { maxHeight: 56, marginTop: spacing.md },
  chipsContent: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  chip: {
    minHeight: minTouchTarget - 8,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipDashed: { borderStyle: 'dashed' },
  chipLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  chipLabelSelected: { color: colors.accentText },
  hint: { ...typography.micro, color: colors.textMuted, paddingHorizontal: spacing.lg, marginTop: spacing.xs },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  modalTitle: { ...typography.heading, color: colors.textPrimary },
  modalSub: { ...typography.caption, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: minTouchTarget,
    marginBottom: spacing.md,
  },
  modalButtons: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
});
