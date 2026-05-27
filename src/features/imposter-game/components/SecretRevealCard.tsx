import { Pressable, Text } from 'react-native';

import { styles } from '../styles';
import type { PlayerRole } from '../types';

type SecretRevealCardProps = {
  isVisible: boolean;
  onToggle: () => void;
  role: PlayerRole;
  spyWord: string;
  word: string;
};

export function SecretRevealCard({
  isVisible,
  onToggle,
  role,
  spyWord,
  word,
}: SecretRevealCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      style={({ pressed }) => [
        styles.secretCard,
        isVisible && getSecretCardStyle(role),
        pressed && styles.pressed,
      ]}>
      <Text style={styles.secretCardEyebrow}>
        {isVisible ? getVisibleEyebrow(role) : 'Trykk for å vise'}
      </Text>
      <Text style={styles.secretCardText}>
        {isVisible ? getVisibleSecret(role, word, spyWord) : 'Skjult'}
      </Text>
      <Text style={styles.secretCardHint}>
        {isVisible ? getVisibleHint(role) : 'Bare denne spilleren skal se.'}
      </Text>
    </Pressable>
  );
}

function getSecretCardStyle(role: PlayerRole) {
  if (role === 'imposter') {
    return styles.secretCardImposter;
  }

  if (role === 'spy') {
    return styles.secretCardSpy;
  }

  return styles.secretCardCivilian;
}

function getVisibleEyebrow(role: PlayerRole) {
  if (role === 'imposter') {
    return 'Din rolle';
  }

  if (role === 'spy') {
    return 'Spionord';
  }

  return 'Ditt ord';
}

function getVisibleSecret(role: PlayerRole, word: string, spyWord: string) {
  if (role === 'imposter') {
    return 'Imposter';
  }

  if (role === 'spy') {
    return spyWord;
  }

  return word;
}

function getVisibleHint(role: PlayerRole) {
  if (role === 'imposter') {
    return 'Du får ikke ord. Lat som du vet det.';
  }

  if (role === 'spy') {
    return 'Du er spion. Ordet ditt ligner på de siviles.';
  }

  return 'Husk ordet, og skjul skjermen.';
}
