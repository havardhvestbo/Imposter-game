import { Text, TextInput, View } from 'react-native';

import { styles } from '../styles';

type PlayerNameFieldsProps = {
  onNameChange: (index: number, name: string) => void;
  players: string[];
};

export function PlayerNameFields({ onNameChange, players }: PlayerNameFieldsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Navn</Text>
      <View style={styles.nameGrid}>
        {players.map((player, index) => (
          <TextInput
            key={index}
            value={player}
            onChangeText={(name) => onNameChange(index, name)}
            placeholder={`Spiller ${index + 1}`}
            placeholderTextColor="#8D8174"
            autoCapitalize="words"
            returnKeyType="done"
            style={styles.nameInput}
          />
        ))}
      </View>
    </View>
  );
}
