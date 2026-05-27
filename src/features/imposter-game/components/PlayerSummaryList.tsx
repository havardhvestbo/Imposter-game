import { Text, View } from 'react-native';

import { getPlayerColor } from '../game';
import { styles } from '../styles';

type PlayerSummaryListProps = {
  players: string[];
  playerIndexes: number[];
};

export function PlayerSummaryList({ playerIndexes, players }: PlayerSummaryListProps) {
  return (
    <View style={styles.playerList}>
      {playerIndexes.map((playerIndex, orderIndex) => (
        <View key={playerIndex} style={styles.playerPill}>
          <Text
            style={[
              styles.playerNumber,
              { backgroundColor: getPlayerColor(playerIndex) },
            ]}>
            {orderIndex + 1}
          </Text>
          <Text style={styles.playerName}>{players[playerIndex]}</Text>
        </View>
      ))}
    </View>
  );
}
