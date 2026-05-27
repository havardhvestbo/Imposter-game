import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

type CounterCardProps = {
  decrementDisabled: boolean;
  decrementLabel: string;
  incrementDisabled: boolean;
  incrementLabel: string;
  label: string;
  onDecrement: () => void;
  onIncrement: () => void;
  value: number;
};

export function CounterCard({
  decrementDisabled,
  decrementLabel,
  incrementDisabled,
  incrementLabel,
  label,
  onDecrement,
  onIncrement,
  value,
}: CounterCardProps) {
  return (
    <View style={styles.counterCard}>
      <View>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.counterValue}>{value}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={decrementLabel}
          disabled={decrementDisabled}
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.iconButton,
            decrementDisabled && styles.disabledButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.iconButtonText}>-</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={incrementLabel}
          disabled={incrementDisabled}
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.iconButton,
            incrementDisabled && styles.disabledButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.iconButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
