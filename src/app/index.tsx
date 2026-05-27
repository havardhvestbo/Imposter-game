import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

const PLAYER_COLORS = [
  '#F25C54',
  '#2D9CDB',
  '#7CB342',
  '#F4A261',
  '#6C63FF',
  '#00897B',
  '#D1495B',
  '#E9C46A',
  '#9B5DE5',
  '#00A896',
  '#F77F00',
  '#577590',
];

const categoryPacks = [
  {
    id: 'dyr',
    label: 'Dyr',
    color: '#F25C54',
    words: [
      'Panter',
      'Jaguar',
      'Flamingo',
      'Krokodille',
      'Gorilla',
      'Delfin',
      'Ørn',
      'Falk',
      'Pingvin',
      'Kameleon',
      'Skorpion',
      'Python',
      'Panda',
      'Koala',
      'Hval',
      'Hai',
      'Reinsdyr',
      'Lama',
      'Alpakka',
      'Gepard',
    ],
  },
  {
    id: 'mat',
    label: 'Mat',
    color: '#2D9CDB',
    words: [
      'Sushi',
      'Tapas',
      'Espresso',
      'Croissant',
      'Trøffel',
      'Kaviar',
      'Wasabi',
      'Kimchi',
      'Paella',
      'Falafel',
      'Safran',
      'Mango',
      'Parmesan',
      'Gelato',
      'Taco',
      'Curry',
      'Ramen',
      'Hummus',
      'Bruschetta',
      'Mozzarella',
    ],
  },
  {
    id: 'ting',
    label: 'Ting',
    color: '#7CB342',
    words: [
      'Kompass',
      'Kikkert',
      'Drone',
      'Mikrofon',
      'Kamera',
      'Pass',
      'Kart',
      'Vinyl',
      'Parfyme',
      'Skateboard',
      'Sjakk',
      'Poker',
      'Maskerade',
      'Krone',
      'Kapsel',
      'Lommelykt',
      'Koffert',
      'Lasso',
      'Rustning',
      'Teleskop',
    ],
  },
  {
    id: 'steder',
    label: 'Steder',
    color: '#F4A261',
    words: [
      'Paris',
      'Roma',
      'Tokyo',
      'Dubai',
      'Monaco',
      'Venezia',
      'Barcelona',
      'København',
      'Reykjavík',
      'New York',
      'Rio',
      'Bali',
      'Svalbard',
      'Sahara',
      'Amazonas',
      'Alaska',
      'Himalaya',
      'Antarktis',
      'Galápagos',
      'Santorini',
    ],
  },
  {
    id: 'landemerker',
    label: 'Landemerker',
    color: '#6C63FF',
    words: [
      'Machu Picchu',
      'Eiffeltårnet',
      'Taj Mahal',
      'Colosseum',
      'Louvre',
      'Akropolis',
      'Stonehenge',
      'Pompeii',
      'Angkor Wat',
      'Petra',
      'Versailles',
      'Kreml',
      'Sfinxen',
      'Burj Khalifa',
      'Frihetsgudinnen',
      'Operahuset',
      'Notre-Dame',
      'Alhambra',
      'Kilimanjaro',
      'Niagara',
    ],
  },
  {
    id: 'rommet',
    label: 'Rommet',
    color: '#00897B',
    words: [
      'Pluto',
      'Mars',
      'Venus',
      'Saturn',
      'Jupiter',
      'Merkur',
      'Neptun',
      'Månen',
      'Solen',
      'Galakse',
      'Komet',
      'Asteroide',
      'Meteor',
      'Supernova',
      'Stjernetåke',
      'Romstasjon',
      'Rakett',
      'Astronaut',
      'Melkeveien',
      'Solsystem',
    ],
  },
  {
    id: 'natur',
    label: 'Natur',
    color: '#D1495B',
    words: [
      'Diamant',
      'Rubin',
      'Smaragd',
      'Gull',
      'Sølv',
      'Krystall',
      'Vulkan',
      'Lava',
      'Isfjell',
      'Nordlys',
      'Korallrev',
      'Regnskog',
      'Geysir',
      'Fossil',
      'Orkan',
      'Tsunami',
      'Fjord',
      'Grotte',
      'Lagune',
      'Oase',
    ],
  },
  {
    id: 'kultur',
    label: 'Kultur',
    color: '#9B5DE5',
    words: [
      'Mona Lisa',
      'Viking',
      'Samurai',
      'Jazz',
      'Opera',
      'Ballett',
      'Graffiti',
      'Festival',
      'Karneval',
      'Shakespeare',
      'Picasso',
      'Bowie',
      'Banksy',
      'Mozart',
      'Hollywood',
      'Broadway',
      'Manga',
      'Flamenco',
      'Mythologi',
      'Tango',
    ],
  },
];

const allWords = Array.from(new Set(categoryPacks.flatMap((pack) => pack.words)));

const wordPacks = [
  {
    id: 'alt',
    label: 'Alle',
    color: '#172116',
    words: allWords,
  },
  ...categoryPacks,
];

type GamePhase = 'setup' | 'reveal' | 'vote' | 'voteResult' | 'gameOver';
type Winner = 'civilians' | 'imposter';

type Round = {
  word: string;
  imposterIndex: number;
  packLabel: string;
  speakingPlayerIndexes: number[];
  activePlayerIndexes: number[];
  eliminatedPlayerIndexes: number[];
  voteNumber: number;
  lastVotedIndex: number | null;
  winner: Winner | null;
};

function makeDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, index) => `Spiller ${index + 1}`);
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleItems<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function getCleanPlayers(players: string[]) {
  return players.map((name, index) => name.trim() || `Spiller ${index + 1}`);
}

function getPlayerColor(playerIndex: number) {
  return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
}

export default function HomeScreen() {
  const [playerCount, setPlayerCount] = useState(5);
  const [players, setPlayers] = useState(() => makeDefaultPlayers(5));
  const [selectedPackId, setSelectedPackId] = useState(wordPacks[0].id);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [round, setRound] = useState<Round | null>(null);
  const [currentRevealPosition, setCurrentRevealPosition] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [selectedVoteIndex, setSelectedVoteIndex] = useState<number | null>(null);

  const selectedPack = wordPacks.find((pack) => pack.id === selectedPackId) ?? wordPacks[0];
  const isUsingAllWords = selectedPackId === 'alt';
  const isCategoryChoiceActive = isCategoryMenuOpen || !isUsingAllWords;
  const cleanPlayers = getCleanPlayers(players);
  const currentPlayerIndex = currentRevealPosition;
  const currentPlayer = cleanPlayers[currentPlayerIndex];
  const isCurrentPlayerImposter = round?.imposterIndex === currentPlayerIndex;
  const activePlayerIndexes = round?.activePlayerIndexes ?? [];
  const speakingPlayerIndexes = round?.speakingPlayerIndexes ?? [];
  const activeCivilianCount = activePlayerIndexes.filter(
    (playerIndex) => playerIndex !== round?.imposterIndex,
  ).length;
  const lastVotedIndex = round?.lastVotedIndex ?? null;
  const lastVotedPlayer = lastVotedIndex === null ? null : cleanPlayers[lastVotedIndex];

  function updatePlayerCount(nextCount: number) {
    const boundedCount = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, nextCount));
    setPlayerCount(boundedCount);
    setPlayers((currentPlayers) =>
      Array.from(
        { length: boundedCount },
        (_, index) => currentPlayers[index] ?? `Spiller ${index + 1}`,
      ),
    );
  }

  function updatePlayerName(index: number, name: string) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((currentName, currentIndex) =>
        currentIndex === index ? name : currentName,
      ),
    );
  }

  function selectAllWords() {
    setSelectedPackId('alt');
    setIsCategoryMenuOpen(false);
  }

  function openCategoryMenu() {
    setIsCategoryMenuOpen((isOpen) => !isOpen);
  }

  function selectCategory(packId: string) {
    setSelectedPackId(packId);
    setIsCategoryMenuOpen(true);
  }

  function startRound() {
    const playerIndexes = Array.from({ length: playerCount }, (_, index) => index);

    setRound({
      word: pickRandom(selectedPack.words),
      imposterIndex: Math.floor(Math.random() * playerCount),
      packLabel: selectedPack.label,
      speakingPlayerIndexes: shuffleItems(playerIndexes),
      activePlayerIndexes: playerIndexes,
      eliminatedPlayerIndexes: [],
      voteNumber: 1,
      lastVotedIndex: null,
      winner: null,
    });
    setCurrentRevealPosition(0);
    setCardVisible(false);
    setSelectedVoteIndex(null);
    setPhase('reveal');
  }

  function nextReveal() {
    if (currentRevealPosition >= playerCount - 1) {
      setCardVisible(false);
      setPhase('vote');
      return;
    }

    setCurrentRevealPosition((position) => position + 1);
    setCardVisible(false);
  }

  function replayWithSamePlayers() {
    startRound();
  }

  function submitVote() {
    if (!round || selectedVoteIndex === null) {
      return;
    }

    if (selectedVoteIndex === round.imposterIndex) {
      setRound({
        ...round,
        lastVotedIndex: selectedVoteIndex,
        winner: 'civilians',
      });
      setSelectedVoteIndex(null);
      setPhase('gameOver');
      return;
    }

    const nextActivePlayerIndexes = round.activePlayerIndexes.filter(
      (playerIndex) => playerIndex !== selectedVoteIndex,
    );
    const nextEliminatedPlayerIndexes = [...round.eliminatedPlayerIndexes, selectedVoteIndex];
    const nextCivilianCount = nextActivePlayerIndexes.filter(
      (playerIndex) => playerIndex !== round.imposterIndex,
    ).length;

    setRound({
      ...round,
      activePlayerIndexes: nextActivePlayerIndexes,
      speakingPlayerIndexes: round.speakingPlayerIndexes.filter(
        (playerIndex) => playerIndex !== selectedVoteIndex,
      ),
      eliminatedPlayerIndexes: nextEliminatedPlayerIndexes,
      voteNumber: round.voteNumber + 1,
      lastVotedIndex: selectedVoteIndex,
      winner: nextCivilianCount <= 1 ? 'imposter' : null,
    });
    setSelectedVoteIndex(null);
    setPhase(nextCivilianCount <= 1 ? 'gameOver' : 'voteResult');
  }

  function continueVoting() {
    setSelectedVoteIndex(null);
    setPhase('vote');
  }

  function resetSetup() {
    setCardVisible(false);
    setCurrentRevealPosition(0);
    setSelectedVoteIndex(null);
    setRound(null);
    setPhase('setup');
  }

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
                    <Text style={styles.badgeText}>Én hemmelig rolle</Text>
                  </View>
                  <Text style={styles.title}>Imposter</Text>
                  <Text style={styles.subtitle}>
                    Alle får samme ord bortsett fra én spiller. Si noe som passer til ordet, hold
                    maska, og finn den falske.
                  </Text>
                </View>

                <View style={styles.counterCard}>
                  <View>
                    <Text style={styles.sectionLabel}>Spillere</Text>
                    <Text style={styles.counterValue}>{playerCount}</Text>
                  </View>
                  <View style={styles.stepper}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Fjern spiller"
                      onPress={() => updatePlayerCount(playerCount - 1)}
                      style={({ pressed }) => [
                        styles.iconButton,
                        playerCount === MIN_PLAYERS && styles.disabledButton,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={styles.iconButtonText}>-</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Legg til spiller"
                      onPress={() => updatePlayerCount(playerCount + 1)}
                      style={({ pressed }) => [
                        styles.iconButton,
                        playerCount === MAX_PLAYERS && styles.disabledButton,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={styles.iconButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Navn</Text>
                  <View style={styles.nameGrid}>
                    {players.map((player, index) => (
                      <TextInput
                        key={index}
                        value={player}
                        onChangeText={(name) => updatePlayerName(index, name)}
                        placeholder={`Spiller ${index + 1}`}
                        placeholderTextColor="#8D8174"
                        autoCapitalize="words"
                        returnKeyType="done"
                        style={styles.nameInput}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Ordvalg</Text>
                  <View style={styles.choiceRow}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={selectAllWords}
                      style={({ pressed }) => [
                        styles.choiceButton,
                        isUsingAllWords && styles.choiceButtonSelected,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={[styles.choiceText, isUsingAllWords && styles.choiceTextSelected]}>
                        Alle
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={openCategoryMenu}
                      style={({ pressed }) => [
                        styles.choiceButton,
                        isCategoryChoiceActive && styles.choiceButtonSelected,
                        pressed && styles.pressed,
                      ]}>
                      <Text
                        style={[
                          styles.choiceText,
                          isCategoryChoiceActive && styles.choiceTextSelected,
                        ]}>
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
                            onPress={() => selectCategory(pack.id)}
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

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setCardVisible((visible) => !visible)}
                  style={({ pressed }) => [
                    styles.secretCard,
                    cardVisible &&
                      (isCurrentPlayerImposter ? styles.secretCardImposter : styles.secretCardCivilian),
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.secretCardEyebrow}>
                    {cardVisible
                      ? isCurrentPlayerImposter
                        ? 'Din rolle'
                        : 'Ditt ord'
                      : 'Trykk for å vise'}
                  </Text>
                  <Text style={styles.secretCardText}>
                    {cardVisible
                      ? isCurrentPlayerImposter
                        ? 'Imposter'
                        : round.word
                      : 'Skjult'}
                  </Text>
                  <Text style={styles.secretCardHint}>
                    {cardVisible
                      ? isCurrentPlayerImposter
                        ? 'Lat som du vet ordet.'
                        : 'Husk ordet, og skjul skjermen.'
                      : 'Bare denne spilleren skal se.'}
                  </Text>
                </Pressable>

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

                <View style={styles.statusGrid}>
                  <View style={styles.statusBox}>
                    <Text style={styles.statusValue}>{activeCivilianCount}</Text>
                    <Text style={styles.statusLabel}>Sivile igjen</Text>
                  </View>
                  <View style={styles.statusBox}>
                    <Text style={styles.statusValue}>{round.eliminatedPlayerIndexes.length}</Text>
                    <Text style={styles.statusLabel}>Stemt ut</Text>
                  </View>
                </View>

                <View style={styles.voteList}>
                  {speakingPlayerIndexes.map((playerIndex, orderIndex) => {
                    const selected = selectedVoteIndex === playerIndex;
                    return (
                      <Pressable
                        key={playerIndex}
                        accessibilityRole="button"
                        onPress={() => setSelectedVoteIndex(playerIndex)}
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
                          {cleanPlayers[playerIndex]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

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
                <View style={[styles.resultCard, styles.safeResultCard]}>
                  <Text style={styles.overline}>Feil stemme</Text>
                  <Text style={styles.resultName}>{lastVotedPlayer}</Text>
                  <Text style={styles.resultWord}>
                    var sivil. {activeCivilianCount} sivile igjen.
                  </Text>
                </View>

                <View style={styles.playerList}>
                  {round.activePlayerIndexes.map((playerIndex) => (
                    <View key={playerIndex} style={styles.playerPill}>
                      <Text
                        style={[
                          styles.playerNumber,
                          { backgroundColor: getPlayerColor(playerIndex) },
                        ]}>
                        {playerIndex + 1}
                      </Text>
                      <Text style={styles.playerName}>{cleanPlayers[playerIndex]}</Text>
                    </View>
                  ))}
                </View>

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
                    style={({ pressed }) => [styles.primaryButtonCompact, pressed && styles.pressed]}>
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
                    round.winner === 'imposter' ? styles.dangerResultCard : styles.safeResultCard,
                  ]}>
                  <Text style={styles.overline}>
                    {round.winner === 'imposter' ? 'Imposter vinner' : 'Sivile vinner'}
                  </Text>
                  <Text style={styles.resultName}>
                    {round.winner === 'imposter'
                      ? cleanPlayers[round.imposterIndex]
                      : `${cleanPlayers[round.imposterIndex]} ble tatt`}
                  </Text>
                  <Text style={styles.resultWord}>
                    Ord: {round.word} | Gruppe: {round.packLabel}
                  </Text>
                </View>

                {round.winner === 'imposter' && (
                  <Text style={styles.subtitle}>
                    Bare én sivil er igjen, så imposteren overlevde.
                  </Text>
                )}

                {round.winner === 'civilians' && lastVotedPlayer && (
                  <Text style={styles.subtitle}>
                    {lastVotedPlayer} ble stemt ut som imposter i runde {round.voteNumber}.
                  </Text>
                )}

                <View style={styles.buttonRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={replayWithSamePlayers}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonText}>Nytt spill</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={resetSetup}
                    style={({ pressed }) => [styles.primaryButtonCompact, pressed && styles.pressed]}>
                    <Text style={styles.primaryButtonText}>Endre oppsett</Text>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#16211A',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 116,
  },
  panel: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: 22,
    borderRadius: 8,
    backgroundColor: '#F8F0E3',
    padding: 22,
    elevation: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 16px 24px rgba(0, 0, 0, 0.24)',
      },
      default: {
        shadowColor: '#000000',
        shadowOpacity: 0.24,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 16 },
      },
    }),
  },
  header: {
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#2B3A2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#F8F0E3',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#172116',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
  },
  subtitle: {
    color: '#62584C',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: '#172116',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  counterCard: {
    minHeight: 104,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#172116',
  },
  counterValue: {
    color: '#172116',
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
  },
  stepper: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F25C54',
    borderWidth: 2,
    borderColor: '#172116',
  },
  disabledButton: {
    opacity: 0.4,
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  nameGrid: {
    gap: 10,
  },
  nameInput: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2D4C4',
    paddingHorizontal: 14,
    color: '#172116',
    fontSize: 16,
    fontWeight: '700',
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  choiceButton: {
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: '#D4C4B4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  choiceButtonSelected: {
    backgroundColor: '#E4F0DB',
    borderColor: '#7B9E67',
  },
  choiceText: {
    color: '#62584C',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  choiceTextSelected: {
    color: '#2F5D2F',
  },
  packRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  packButton: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#172116',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  packText: {
    color: '#172116',
    fontSize: 14,
    fontWeight: '900',
  },
  packTextSelected: {
    color: '#FFFFFF',
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172116',
    paddingHorizontal: 18,
  },
  startButton: {
    backgroundColor: '#2F9E44',
  },
  primaryButtonCompact: {
    minHeight: 58,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172116',
    paddingHorizontal: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#F8F0E3',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    minHeight: 58,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#172116',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#172116',
    fontSize: 16,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
  roundTopper: {
    gap: 8,
  },
  overline: {
    color: '#F25C54',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  roundTitle: {
    color: '#172116',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  secretCard: {
    minHeight: 260,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#172116',
    backgroundColor: '#2D9CDB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
  },
  secretCardCivilian: {
    backgroundColor: '#2F9E44',
  },
  secretCardImposter: {
    backgroundColor: '#F25C54',
  },
  secretCardEyebrow: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  secretCardText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
    textAlign: 'center',
  },
  secretCardHint: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  roundBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#2D9CDB',
    borderWidth: 2,
    borderColor: '#172116',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  roundBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBox: {
    flex: 1,
    minHeight: 86,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2D4C4',
    justifyContent: 'center',
    padding: 14,
  },
  statusValue: {
    color: '#172116',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  statusLabel: {
    color: '#62584C',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  voteList: {
    gap: 10,
  },
  voteButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2D4C4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  voteButtonSelected: {
    backgroundColor: '#172116',
    borderColor: '#172116',
  },
  playerList: {
    gap: 10,
  },
  playerPill: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2D4C4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  playerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#172116',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 28,
    textAlign: 'center',
  },
  playerNumberSelected: {
    backgroundColor: '#F8F0E3',
    color: '#172116',
  },
  playerName: {
    color: '#172116',
    fontSize: 16,
    fontWeight: '800',
  },
  votePlayerNameSelected: {
    color: '#F8F0E3',
  },
  resultCard: {
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#172116',
    backgroundColor: '#FFFFFF',
    padding: 22,
    gap: 8,
  },
  safeResultCard: {
    backgroundColor: '#E8F6EA',
  },
  dangerResultCard: {
    backgroundColor: '#FDE8E7',
  },
  resultName: {
    color: '#172116',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 42,
  },
  resultWord: {
    color: '#62584C',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
