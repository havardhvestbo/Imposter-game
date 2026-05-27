import { Pressable, Text, View } from 'react-native';

import { MIN_IMPOSTERS } from '../constants';
import { styles } from '../styles';

type RoleSelectorProps = {
  imposterCount: number;
  maxHiddenRoleCount: number;
  maxImposterCount: number;
  maxSpyCount: number;
  onImposterCountChange: (count: number) => void;
  onSpyCountChange: (count: number) => void;
  playerCount: number;
  spyCount: number;
};

export function RoleSelector({
  imposterCount,
  maxHiddenRoleCount,
  maxImposterCount,
  maxSpyCount,
  onImposterCountChange,
  onSpyCountChange,
  playerCount,
  spyCount,
}: RoleSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Roller</Text>
      <View style={styles.roleGrid}>
        <RoleCountRow
          count={imposterCount}
          decrementDisabled={imposterCount === MIN_IMPOSTERS}
          description="Får ikke ord"
          incrementDisabled={imposterCount === maxImposterCount}
          label="Impostere"
          onDecrement={() => onImposterCountChange(imposterCount - 1)}
          onIncrement={() => onImposterCountChange(imposterCount + 1)}
        />
        <RoleCountRow
          count={spyCount}
          decrementDisabled={spyCount === 0}
          description="Får et lignende ord"
          incrementDisabled={spyCount === maxSpyCount}
          label="Spioner"
          onDecrement={() => onSpyCountChange(spyCount - 1)}
          onIncrement={() => onSpyCountChange(spyCount + 1)}
        />
      </View>
      <Text style={styles.helperText}>
        Du kan ha maks {maxHiddenRoleCount} skjulte roller med {playerCount} spillere. Sivile må
        alltid være i flertall.
      </Text>
    </View>
  );
}

function RoleCountRow({
  count,
  decrementDisabled,
  description,
  incrementDisabled,
  label,
  onDecrement,
  onIncrement,
}: {
  count: number;
  decrementDisabled: boolean;
  description: string;
  incrementDisabled: boolean;
  label: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View style={styles.roleCard}>
      <View style={styles.roleCopy}>
        <Text style={styles.roleName}>{label}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
      <View style={styles.roleStepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Fjern ${label.toLowerCase()}`}
          disabled={decrementDisabled}
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.roleButton,
            decrementDisabled && styles.disabledButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.roleButtonText}>-</Text>
        </Pressable>
        <Text style={styles.roleCount}>{count}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Legg til ${label.toLowerCase()}`}
          disabled={incrementDisabled}
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.roleButton,
            incrementDisabled && styles.disabledButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.roleButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
