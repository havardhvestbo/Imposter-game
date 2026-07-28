import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';
import type { WordPack } from '../types';

type WordPackSelectorProps = {
  onSelectPack: (packId: string) => void;
  packs: WordPack[];
  selectedPackId: string;
};

export function WordPackSelector({
  onSelectPack,
  packs,
  selectedPackId,
}: WordPackSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Ordvalg</Text>
      <View style={styles.packRow}>
        {packs.map((pack) => {
          const selected = pack.id === selectedPackId;
          return (
            <Pressable
              key={pack.id}
              accessibilityRole="button"
              onPress={() => onSelectPack(pack.id)}
              style={({ pressed }) => [
                styles.packButton,
                selected && { backgroundColor: pack.color },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.packText, selected && styles.packTextSelected]}>
                {pack.label}
                {pack.id === 'droy' && <Text style={styles.ageBadge}> 18+</Text>}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
