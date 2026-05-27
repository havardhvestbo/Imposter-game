import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CounterCard } from '@/features/imposter-game/components/CounterCard';
import { PlayerNameFields } from '@/features/imposter-game/components/PlayerNameFields';
import { PlayerSummaryList } from '@/features/imposter-game/components/PlayerSummaryList';
import { RoleSelector } from '@/features/imposter-game/components/RoleSelector';
import { SecretRevealCard } from '@/features/imposter-game/components/SecretRevealCard';
import { StatusGrid } from '@/features/imposter-game/components/StatusGrid';
import { VoteList } from '@/features/imposter-game/components/VoteList';
import { WordPackSelector } from '@/features/imposter-game/components/WordPackSelector';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/features/imposter-game/constants';
import { getRoleLabel } from '@/features/imposter-game/game';
import { styles } from '@/features/imposter-game/styles';
import { useImposterGame } from '@/features/imposter-game/use-imposter-game';
import { categoryPacks } from '@/features/imposter-game/words';

export default function HomeScreen() {
  const {
    activeHiddenPlayerNames,
    activeRoleCounts,
    cardVisible,
    cleanPlayers,
    continueVoting,
    currentPlayer,
    currentPlayerRole,
    currentRevealPosition,
    imposterCount,
    isCategoryChoiceActive,
    isUsingAllWords,
    lastVotedPlayer,
    lastVotedRole,
    maxHiddenRoleCount,
    maxImposterCount,
    maxSpyCount,
    nextReveal,
    phase,
    playerCount,
    players,
    replayWithSamePlayers,
    resetSetup,
    round,
    selectAllWords,
    selectCategory,
    selectedPackId,
    selectedVoteIndex,
    setCardVisible,
    setSelectedVoteIndex,
    spyCount,
    startRound,
    submitVote,
    toggleCategoryMenu,
    updateImposterCount,
    updatePlayerCount,
    updatePlayerName,
    updateSpyCount,
  } = useImposterGame();

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {phase === 'setup' && (
              <View style={styles.panel}>
                <View style={styles.header}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Skjulte roller</Text>
                  </View>
                  <Text style={styles.title}>Imposter</Text>
                  <Text style={styles.subtitle}>
                    Sivile får samme ord. Spioner får et lignende ord. Impostere får ikke ord.
                    Hold maska, og finn de skjulte rollene.
                  </Text>
                </View>

                <CounterCard
                  decrementDisabled={playerCount === MIN_PLAYERS}
                  decrementLabel="Fjern spiller"
                  incrementDisabled={playerCount === MAX_PLAYERS}
                  incrementLabel="Legg til spiller"
                  label="Spillere"
                  onDecrement={() => updatePlayerCount(playerCount - 1)}
                  onIncrement={() => updatePlayerCount(playerCount + 1)}
                  value={playerCount}
                />

                <RoleSelector
                  imposterCount={imposterCount}
                  maxHiddenRoleCount={maxHiddenRoleCount}
                  maxImposterCount={maxImposterCount}
                  maxSpyCount={maxSpyCount}
                  onImposterCountChange={updateImposterCount}
                  onSpyCountChange={updateSpyCount}
                  playerCount={playerCount}
                  spyCount={spyCount}
                />

                <PlayerNameFields onNameChange={updatePlayerName} players={players} />

                <WordPackSelector
                  categoryPacks={categoryPacks}
                  isCategoryChoiceActive={isCategoryChoiceActive}
                  isUsingAllWords={isUsingAllWords}
                  onSelectAll={selectAllWords}
                  onSelectCategory={selectCategory}
                  onToggleCategoryMenu={toggleCategoryMenu}
                  selectedPackId={selectedPackId}
                />

                <Pressable
                  accessibilityRole="button"
                  onPress={startRound}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    styles.startButton,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>Start spill</Text>
                </Pressable>
              </View>
            )}

            {phase === 'reveal' && round && (
              <View style={styles.panel}>
                <View style={styles.roundTopper}>
                  <Text style={styles.overline}>
                    {currentRevealPosition + 1} av {playerCount}
                  </Text>
                  <Text style={styles.roundTitle}>Send til {currentPlayer}</Text>
                  <Text style={styles.subtitle}>Hold skjermen skjult til det er din tur.</Text>
                </View>

                <SecretRevealCard
                  isVisible={cardVisible}
                  onToggle={() => setCardVisible((visible) => !visible)}
                  role={currentPlayerRole}
                  spyWord={round.spyWord}
                  word={round.word}
                />

                <Pressable
                  accessibilityRole="button"
                  disabled={!cardVisible}
                  onPress={nextReveal}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    !cardVisible && styles.primaryButtonDisabled,
                    pressed && cardVisible && styles.pressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>
                    {currentRevealPosition === playerCount - 1 ? 'Start runde' : 'Skjul og send'}
                  </Text>
                </Pressable>
              </View>
            )}

            {phase === 'vote' && round && (
              <View style={styles.panel}>
                <View style={styles.roundBadge}>
                  <Text style={styles.roundBadgeText}>Runde {round.voteNumber}</Text>
                </View>
                <Text style={styles.roundTitle}>Hvem virker mistenkelig?</Text>
                <Text style={styles.subtitle}>
                  Følg rekkefølgen under. Alle sier én ting som passer til ordet, og stemmer ut én
                  spiller når runden er ferdig.
                </Text>

                <StatusGrid
                  civilianCount={activeRoleCounts.civilians}
                  hiddenRoleCount={activeRoleCounts.hidden}
                />

                <VoteList
                  onSelectVote={setSelectedVoteIndex}
                  players={cleanPlayers}
                  selectedVoteIndex={selectedVoteIndex}
                  speakingPlayerIndexes={round.speakingPlayerIndexes}
                />

                <Pressable
                  accessibilityRole="button"
                  disabled={selectedVoteIndex === null}
                  onPress={submitVote}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    selectedVoteIndex === null && styles.primaryButtonDisabled,
                    pressed && selectedVoteIndex !== null && styles.pressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>Lås stemme</Text>
                </Pressable>
              </View>
            )}

            {phase === 'voteResult' && round && lastVotedPlayer && (
              <View style={styles.panel}>
                <View
                  style={[
                    styles.resultCard,
                    lastVotedRole === 'civilian' ? styles.dangerResultCard : styles.safeResultCard,
                  ]}>
                  <Text style={styles.overline}>
                    {lastVotedRole === 'civilian' ? 'Feil stemme' : 'Riktig stemme'}
                  </Text>
                  <Text style={styles.resultName}>{lastVotedPlayer}</Text>
                  <Text style={styles.resultWord}>
                    {lastVotedRole === 'civilian'
                      ? `var sivil. ${activeRoleCounts.civilians} sivile igjen.`
                      : `var ${getRoleLabel(lastVotedRole ?? 'civilian').toLowerCase()}. ${activeRoleCounts.hidden} skjulte igjen.`}
                  </Text>
                </View>

                <PlayerSummaryList
                  playerIndexes={round.speakingPlayerIndexes}
                  players={cleanPlayers}
                />

                <View style={styles.buttonRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={resetSetup}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonText}>Endre oppsett</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={continueVoting}
                    style={({ pressed }) => [
                      styles.primaryButtonCompact,
                      styles.nextRoundButton,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={styles.primaryButtonText}>Neste runde</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {phase === 'gameOver' && round && (
              <View style={styles.panel}>
                <View
                  style={[
                    styles.resultCard,
                    round.winner === 'hidden' ? styles.dangerResultCard : styles.safeResultCard,
                  ]}>
                  <Text style={styles.overline}>
                    {round.winner === 'hidden' ? 'Skjulte roller vinner' : 'Sivile vinner'}
                  </Text>
                  <Text style={styles.resultName}>
                    {round.winner === 'hidden'
                      ? activeHiddenPlayerNames || 'De skjulte'
                      : 'Alle skjulte roller ble tatt'}
                  </Text>
                  <Text style={styles.resultWord}>
                    Ord: {round.word}
                    {round.spyIndexes.length > 0 ? ` | Spionord: ${round.spyWord}` : ''} | Gruppe:{' '}
                    {round.packLabel}
                  </Text>
                </View>

                {round.winner === 'hidden' && (
                  <Text style={styles.subtitle}>
                    Bare én sivil er igjen, så de skjulte rollene overlevde.
                  </Text>
                )}

                {round.winner === 'civilians' && lastVotedPlayer && (
                  <Text style={styles.subtitle}>
                    {lastVotedPlayer} ble stemt ut som{' '}
                    {getRoleLabel(lastVotedRole ?? 'civilian').toLowerCase()} i runde{' '}
                    {round.voteNumber}.
                  </Text>
                )}

                <View style={styles.buttonRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={resetSetup}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonText}>Endre oppsett</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={replayWithSamePlayers}
                    style={({ pressed }) => [
                      styles.primaryButtonCompact,
                      styles.newGameButton,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={styles.newGameButtonText}>Nytt spill</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
