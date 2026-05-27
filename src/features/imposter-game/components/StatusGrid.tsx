import { Text, View } from 'react-native';

import { styles } from '../styles';

type StatusGridProps = {
  civilianCount: number;
  hiddenRoleCount: number;
};

export function StatusGrid({ civilianCount, hiddenRoleCount }: StatusGridProps) {
  return (
    <View style={styles.statusGrid}>
      <View style={styles.statusBox}>
        <Text style={styles.statusValue}>{civilianCount}</Text>
        <Text style={styles.statusLabel}>Sivile igjen</Text>
      </View>
      <View style={styles.statusBox}>
        <Text style={styles.statusValue}>{hiddenRoleCount}</Text>
        <Text style={styles.statusLabel}>Skjulte igjen</Text>
      </View>
    </View>
  );
}
