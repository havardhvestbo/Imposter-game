import { Pressable, Text, View } from 'react-native';

import { getPlayerColor } from '../game';
import { styles } from '../styles';

type VoteListProps = {
  onSelectVote: (playerIndex: number) => void;
  players: string[];
  selectedVoteIndex: number | null;
  speakingPlayerIndexes: number[];
};

export function VoteList({
  onSelectVote,
  players,
  selectedVoteIndex,
  speakingPlayerIndexes,
}: VoteListProps) {
  return (
    <View style={styles.voteList}>
      {speakingPlayerIndexes.map((playerIndex, orderIndex) => {
        const selected = selectedVoteIndex === playerIndex;
        return (
          <Pressable
            key={playerIndex}
            accessibilityRole="button"
            onPress={() => onSelectVote(playerIndex)}
            style={({ pressed }) => [
              styles.voteButton,
              selected && styles.voteButtonSelected,
              pressed && styles.pressed,
            ]}>
            <Text
              style={[
                styles.playerNumber,
                { backgroundColor: getPlayerColor(playerIndex) },
                selected && styles.playerNumberSelected,
              ]}>
              {orderIndex + 1}
            </Text>
            <Text style={[styles.playerName, selected && styles.votePlayerNameSelected]}>
              {players[playerIndex]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
