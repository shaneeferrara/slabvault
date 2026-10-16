/**
 * AddCard — the Phase 1 manual "add a card" flow.
 * Step 1: search the catalog and pick a card.
 * Step 2: collection, grade, purchase details → one tap to add.
 * Also handles edit mode (?itemId=) for an existing collection item.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, minTouchTarget, radii, spacing, typography } from '../src/theme/tokens';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { CatalogSearch } from '../src/components/CatalogSearch';
import { CardTile } from '../src/components/CardTile';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SectionHeader } from '../src/components/SectionHeader';
import { GRADE_LABELS, type CardRecord, type GradeLabel } from '../src/data/types';
import { getCardById } from '../src/data/catalog';
import { useCollectionStore } from '../src/store/collectionStore';
import { MOCK_AS_OF_ISO } from '../src/utils/format';

const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good'];

export default function AddCardScreen() {
  const router = useRouter();
  const { cardId, itemId } = useLocalSearchParams<{ cardId?: string; itemId?: string }>();

  const collections = useCollectionStore((s) => s.collections);
  const items = useCollectionStore((s) => s.items);
  const addItem = useCollectionStore((s) => s.addItem);
  const updateItem = useCollectionStore((s) => s.updateItem);

  const editingItem = useMemo(() => items.find((i) => i.id === itemId), [items, itemId]);
  const preselectedCard = cardId ? getCardById(cardId) : editingItem ? getCardById(editingItem.cardId) : undefined;

  const [card, setCard] = useState<CardRecord | undefined>(preselectedCard);
  const [collectionId, setCollectionId] = useState(editingItem?.collectionId ?? collections[0]?.id ?? '');
  const [grade, setGrade] = useState<GradeLabel>(editingItem?.gradeLabel ?? 'Raw');
  const [certNumber, setCertNumber] = useState(editingItem?.certNumber ?? '');
  const [purchasePrice, setPurchasePrice] = useState(editingItem?.purchasePrice?.toString() ?? '');
  const [acquiredDate, setAcquiredDate] = useState(editingItem?.acquiredDate ?? MOCK_AS_OF_ISO);
  const [source, setSource] = useState(editingItem?.source ?? '');
  const [condition, setCondition] = useState(editingItem?.condition ?? '');
  const [location, setLocation] = useState(editingItem?.storageLocation ?? '');
  const [notes, setNotes] = useState(editingItem?.notes ?? '');
  const [saving, setSaving] = useState(false);

  // Keep the prefill in sync once the store finishes loading.
  useEffect(() => {
    if (!card && preselectedCard) setCard(preselectedCard);
    if (editingItem) {
      setCollectionId(editingItem.collectionId);
      setGrade(editingItem.gradeLabel);
      setCertNumber(editingItem.certNumber ?? '');
      setPurchasePrice(editingItem.purchasePrice?.toString() ?? '');
      setAcquiredDate(editingItem.acquiredDate ?? MOCK_AS_OF_ISO);
      setSource(editingItem.source ?? '');
      setCondition(editingItem.condition ?? '');
      setLocation(editingItem.storageLocation ?? '');
      setNotes(editingItem.notes ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedCard, editingItem]);

  const isGraded = grade !== 'Raw';

  const save = async () => {
    if (!card) return;
    if (!collectionId) {
      Alert.alert('Pick a collection', 'Choose which collection this card belongs to.');
      return;
    }
    const price = purchasePrice.trim() === '' ? undefined : Number(purchasePrice);
    if (price !== undefined && (!Number.isFinite(price) || price < 0)) {
      Alert.alert('Check the price', 'Purchase price must be a positive number.');
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          gradeLabel: grade,
          certNumber: certNumber.trim() || undefined,
          purchasePrice: price,
          acquiredDate: acquiredDate.trim() || undefined,
          source: source.trim() || undefined,
          condition: !isGraded && condition ? condition : undefined,
          storageLocation: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await addItem({
          collectionId,
          cardId: card.id,
          gradeLabel: grade,
          certNumber: certNumber.trim() || undefined,
          purchasePrice: price,
          acquiredDate: acquiredDate.trim() || undefined,
          source: source.trim() || undefined,
          condition: !isGraded && condition ? condition : undefined,
          storageLocation: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      router.back();
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title={editingItem ? 'Edit card' : card ? 'Add to collection' : 'Find your card'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!card ? (
          <>
            <Text style={styles.lead}>
              Search the sample catalog — camera scanning arrives in Phase 2.
            </Text>
            <CatalogSearch onSelect={setCard} autoFocus />
          </>
        ) : (
          <>
            <CardTile card={card} onPress={() => !editingItem && setCard(undefined)} />
            {!editingItem && (
              <Text style={styles.changeCard}>Not the right card? Tap it to search again.</Text>
            )}

            <SectionHeader title="Collection" />
            <View style={styles.chipRow}>
              {collections.map((c) => (
                <Chip key={c.id} label={c.name} selected={collectionId === c.id} onPress={() => setCollectionId(c.id)} />
              ))}
            </View>

            <SectionHeader title="Grade" subtitle={isGraded ? 'Add the cert number if you have it' : 'Raw = ungraded'} />
            <View style={styles.chipRow}>
              {GRADE_LABELS.map((g) => (
                <Chip key={g} label={g} selected={grade === g} onPress={() => setGrade(g)} />
              ))}
            </View>

            {isGraded && (
              <LabeledInput
                label="Cert number (optional)"
                value={certNumber}
                onChangeText={setCertNumber}
                placeholder="e.g. 84120397"
              />
            )}

            <SectionHeader title="Purchase details" subtitle="Optional — powers cost basis and profit tracking" />
            <LabeledInput
              label="What you paid ($)"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="e.g. 250"
              keyboardType="decimal-pad"
            />
            <LabeledInput
              label="Date acquired"
              value={acquiredDate}
              onChangeText={setAcquiredDate}
              placeholder="YYYY-MM-DD"
            />
            <LabeledInput
              label="Where from"
              value={source}
              onChangeText={setSource}
              placeholder="e.g. eBay, card show, trade"
            />

            {!isGraded && (
              <>
                <Text style={styles.fieldLabel}>Condition</Text>
                <View style={styles.chipRow}>
                  {CONDITIONS.map((c) => (
                    <Chip key={c} label={c} selected={condition === c} onPress={() => setCondition(c)} />
                  ))}
                </View>
              </>
            )}

            <LabeledInput
              label="Storage location"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Slab case, Binder 2"
            />
            <LabeledInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Anything worth remembering"
              multiline
            />

            <View style={styles.saveWrap}>
              <PrimaryButton
                title={editingItem ? 'Save changes' : 'Add to collection'}
                onPress={() => void save()}
                loading={saving}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function LabeledInput({
  label, value, onChangeText, placeholder, keyboardType, multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'decimal-pad' | 'default';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  lead: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  changeCard: { ...typography.micro, color: colors.textMuted, marginTop: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: minTouchTarget - 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  chipTextSelected: { color: colors.accentText },
  field: { marginTop: spacing.md },
  fieldLabel: { ...typography.caption, color: colors.textMuted, fontWeight: '600', marginBottom: 6 },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: minTouchTarget,
  },
  inputMultiline: { minHeight: 88, paddingVertical: spacing.sm, textAlignVertical: 'top' },
  saveWrap: { marginTop: spacing.xl },
});
