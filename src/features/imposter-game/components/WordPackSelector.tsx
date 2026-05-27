import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';
import type { WordPack } from '../types';

type WordPackSelectorProps = {
  categoryPacks: WordPack[];
  isCategoryChoiceActive: boolean;
  isUsingAllWords: boolean;
  onSelectAll: () => void;
  onSelectCategory: (packId: string) => void;
  onToggleCategoryMenu: () => void;
  selectedPackId: string;
};

export function WordPackSelector({
  categoryPacks,
  isCategoryChoiceActive,
  isUsingAllWords,
  onSelectAll,
  onSelectCategory,
  onToggleCategoryMenu,
  selectedPackId,
}: WordPackSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Ordvalg</Text>
      <View style={styles.choiceRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onSelectAll}
          style={({ pressed }) => [
            styles.choiceButton,
            isUsingAllWords && styles.choiceButtonSelected,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.choiceText, isUsingAllWords && styles.choiceTextSelected]}>Alle</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleCategoryMenu}
          style={({ pressed }) => [
            styles.choiceButton,
            isCategoryChoiceActive && styles.choiceButtonSelected,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.choiceText, isCategoryChoiceActive && styles.choiceTextSelected]}>
            Velg kategori
          </Text>
        </Pressable>
      </View>

      {isCategoryChoiceActive && (
        <View style={styles.packRow}>
          {categoryPacks.map((pack) => {
            const selected = pack.id === selectedPackId;
            return (
              <Pressable
                key={pack.id}
                accessibilityRole="button"
                onPress={() => onSelectCategory(pack.id)}
                style={({ pressed }) => [
                  styles.packButton,
                  selected && { backgroundColor: pack.color },
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.packText, selected && styles.packTextSelected]}>
                  {pack.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
