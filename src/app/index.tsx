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
const MIN_IMPOSTERS = 1;

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
      'Big Ben',
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

const RELATED_WORDS: Record<string, string> = {
  Panter: 'Jaguar',
  Jaguar: 'Panter',
  Flamingo: 'Pingvin',
  Pingvin: 'Flamingo',
  Krokodille: 'Python',
  Python: 'Krokodille',
  Gorilla: 'Panda',
  Panda: 'Gorilla',
  Delfin: 'Hval',
  Hval: 'Delfin',
  Ørn: 'Falk',
  Falk: 'Ørn',
  Kameleon: 'Skorpion',
  Skorpion: 'Kameleon',
  Koala: 'Alpakka',
  Alpakka: 'Koala',
  Hai: 'Gepard',
  Gepard: 'Hai',
  Reinsdyr: 'Lama',
  Lama: 'Reinsdyr',
  Sushi: 'Ramen',
  Ramen: 'Sushi',
  Tapas: 'Bruschetta',
  Bruschetta: 'Tapas',
  Espresso: 'Croissant',
  Croissant: 'Espresso',
  Trøffel: 'Kaviar',
  Kaviar: 'Trøffel',
  Wasabi: 'Kimchi',
  Kimchi: 'Wasabi',
  Paella: 'Curry',
  Curry: 'Paella',
  Falafel: 'Hummus',
  Hummus: 'Falafel',
  Safran: 'Parmesan',
  Parmesan: 'Safran',
  Mango: 'Gelato',
  Gelato: 'Mango',
  Taco: 'Mozzarella',
  Mozzarella: 'Taco',
  Kompass: 'Kart',
  Kart: 'Kompass',
  Kikkert: 'Teleskop',
  Teleskop: 'Kikkert',
  Drone: 'Kamera',
  Kamera: 'Drone',
  Mikrofon: 'Vinyl',
  Vinyl: 'Mikrofon',
  Pass: 'Koffert',
  Koffert: 'Pass',
  Parfyme: 'Maskerade',
  Maskerade: 'Parfyme',
  Skateboard: 'Lasso',
  Lasso: 'Skateboard',
  Sjakk: 'Poker',
  Poker: 'Sjakk',
  Krone: 'Rustning',
  Rustning: 'Krone',
  Kapsel: 'Lommelykt',
  Lommelykt: 'Kapsel',
  Paris: 'Roma',
  Roma: 'Paris',
  Tokyo: 'Dubai',
  Dubai: 'Tokyo',
  Monaco: 'Santorini',
  Santorini: 'Monaco',
  Venezia: 'Barcelona',
  Barcelona: 'Venezia',
  København: 'Reykjavík',
  Reykjavík: 'København',
  'New York': 'Rio',
  Rio: 'New York',
  Bali: 'Galápagos',
  Galápagos: 'Bali',
  Svalbard: 'Alaska',
  Alaska: 'Svalbard',
  Sahara: 'Amazonas',
  Amazonas: 'Sahara',
  Himalaya: 'Antarktis',
  Antarktis: 'Himalaya',
  'Machu Picchu': 'Petra',
  Petra: 'Machu Picchu',
  Eiffeltårnet: 'Big Ben',
  'Big Ben': 'Eiffeltårnet',
  'Taj Mahal': 'Versailles',
  Versailles: 'Taj Mahal',
  Colosseum: 'Akropolis',
  Akropolis: 'Colosseum',
  Louvre: 'Mona Lisa',
  Stonehenge: 'Pompeii',
  Pompeii: 'Stonehenge',
  'Angkor Wat': 'Alhambra',
  Alhambra: 'Angkor Wat',
  Kreml: 'Notre-Dame',
  'Notre-Dame': 'Kreml',
  Sfinxen: 'Kilimanjaro',
  Kilimanjaro: 'Sfinxen',
  'Burj Khalifa': 'Frihetsgudinnen',
  Frihetsgudinnen: 'Burj Khalifa',
  Operahuset: 'Niagara',
  Niagara: 'Operahuset',
  Pluto: 'Neptun',
  Neptun: 'Pluto',
  Mars: 'Venus',
  Venus: 'Mars',
  Saturn: 'Jupiter',
  Jupiter: 'Saturn',
  Merkur: 'Solsystem',
  Solsystem: 'Merkur',
  Månen: 'Solen',
  Solen: 'Månen',
  Galakse: 'Melkeveien',
  Melkeveien: 'Galakse',
  Komet: 'Asteroide',
  Asteroide: 'Komet',
  Meteor: 'Supernova',
  Supernova: 'Meteor',
  Stjernetåke: 'Romstasjon',
  Romstasjon: 'Stjernetåke',
  Rakett: 'Astronaut',
  Astronaut: 'Rakett',
  Diamant: 'Rubin',
  Rubin: 'Diamant',
  Smaragd: 'Krystall',
  Krystall: 'Smaragd',
  Gull: 'Sølv',
  Sølv: 'Gull',
  Vulkan: 'Lava',
  Lava: 'Vulkan',
  Isfjell: 'Nordlys',
  Nordlys: 'Isfjell',
  Korallrev: 'Lagune',
  Lagune: 'Korallrev',
  Regnskog: 'Oase',
  Oase: 'Regnskog',
  Geysir: 'Fossil',
  Fossil: 'Geysir',
  Orkan: 'Tsunami',
  Tsunami: 'Orkan',
  Fjord: 'Grotte',
  Grotte: 'Fjord',
  'Mona Lisa': 'Picasso',
  Picasso: 'Mona Lisa',
  Viking: 'Samurai',
  Samurai: 'Viking',
  Jazz: 'Opera',
  Opera: 'Jazz',
  Ballett: 'Flamenco',
  Flamenco: 'Ballett',
  Graffiti: 'Banksy',
  Banksy: 'Graffiti',
  Festival: 'Karneval',
  Karneval: 'Festival',
  Shakespeare: 'Mozart',
  Mozart: 'Shakespeare',
  Bowie: 'Hollywood',
  Hollywood: 'Bowie',
  Broadway: 'Tango',
  Tango: 'Broadway',
  Manga: 'Mythologi',
  Mythologi: 'Manga',
};

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
type PlayerRole = 'civilian' | 'imposter' | 'spy';
type Winner = 'civilians' | 'hidden';

type Round = {
  word: string;
  spyWord: string;
  imposterIndexes: number[];
  spyIndexes: number[];
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

function getMaxHiddenRoleCount(playerCount: number) {
  return Math.max(MIN_IMPOSTERS, Math.floor((playerCount - 1) / 2));
}

function getClampedRoleCounts(playerCount: number, imposterCount: number, spyCount: number) {
  const maxHiddenRoleCount = getMaxHiddenRoleCount(playerCount);
  const nextImposterCount = Math.min(
    Math.max(MIN_IMPOSTERS, imposterCount),
    maxHiddenRoleCount,
  );
  const nextSpyCount = Math.min(Math.max(0, spyCount), maxHiddenRoleCount - nextImposterCount);

  return {
    imposterCount: nextImposterCount,
    spyCount: nextSpyCount,
  };
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

function getRelatedWord(word: string) {
  const relatedWord = RELATED_WORDS[word];

  if (relatedWord) {
    return relatedWord;
  }

  const sourcePack = categoryPacks.find((pack) => pack.words.includes(word));
  const alternatives = (sourcePack?.words ?? allWords).filter((alternative) => alternative !== word);

  return alternatives.length > 0 ? pickRandom(alternatives) : word;
}

function getPlayerRole(round: Round, playerIndex: number): PlayerRole {
  if (round.imposterIndexes.includes(playerIndex)) {
    return 'imposter';
  }

  if (round.spyIndexes.includes(playerIndex)) {
    return 'spy';
  }

  return 'civilian';
}

function isHiddenRole(round: Round, playerIndex: number) {
  return getPlayerRole(round, playerIndex) !== 'civilian';
}

function getRoleLabel(role: PlayerRole) {
  if (role === 'imposter') {
    return 'Imposter';
  }

  if (role === 'spy') {
    return 'Spion';
  }

  return 'Sivil';
}

function getPlayerColor(playerIndex: number) {
  return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
}

export default function HomeScreen() {
  const [playerCount, setPlayerCount] = useState(5);
  const [players, setPlayers] = useState(() => makeDefaultPlayers(5));
  const [imposterCount, setImposterCount] = useState(1);
  const [spyCount, setSpyCount] = useState(0);
  const [selectedPackId, setSelectedPackId] = useState(wordPacks[0].id);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [round, setRound] = useState<Round | null>(null);
  const [currentRevealPosition, setCurrentRevealPosition] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [selectedVoteIndex, setSelectedVoteIndex] = useState<number | null>(null);

  const selectedPack = wordPacks.find((pack) => pack.id === selectedPackId) ?? wordPacks[0];
  const maxHiddenRoleCount = getMaxHiddenRoleCount(playerCount);
  const maxImposterCount = Math.max(MIN_IMPOSTERS, maxHiddenRoleCount - spyCount);
  const maxSpyCount = Math.max(0, maxHiddenRoleCount - imposterCount);
  const isUsingAllWords = selectedPackId === 'alt';
  const isCategoryChoiceActive = isCategoryMenuOpen || !isUsingAllWords;
  const cleanPlayers = getCleanPlayers(players);
  const currentPlayerIndex = currentRevealPosition;
  const currentPlayer = cleanPlayers[currentPlayerIndex];
  const currentPlayerRole = round ? getPlayerRole(round, currentPlayerIndex) : 'civilian';
  const activePlayerIndexes = round?.activePlayerIndexes ?? [];
  const speakingPlayerIndexes = round?.speakingPlayerIndexes ?? [];
  const activeHiddenRoleCount = round
    ? activePlayerIndexes.filter((playerIndex) => isHiddenRole(round, playerIndex)).length
    : 0;
  const activeCivilianCount = round ? activePlayerIndexes.length - activeHiddenRoleCount : 0;
  const activeHiddenPlayerNames = round
    ? activePlayerIndexes
        .filter((playerIndex) => isHiddenRole(round, playerIndex))
        .map((playerIndex) => cleanPlayers[playerIndex])
        .join(', ')
    : '';
  const lastVotedIndex = round?.lastVotedIndex ?? null;
  const lastVotedPlayer = lastVotedIndex === null ? null : cleanPlayers[lastVotedIndex];
  const lastVotedRole =
    round && lastVotedIndex !== null ? getPlayerRole(round, lastVotedIndex) : null;

  function updatePlayerCount(nextCount: number) {
    const boundedCount = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, nextCount));
    const nextRoleCounts = getClampedRoleCounts(boundedCount, imposterCount, spyCount);

    setPlayerCount(boundedCount);
    setImposterCount(nextRoleCounts.imposterCount);
    setSpyCount(nextRoleCounts.spyCount);
    setPlayers((currentPlayers) =>
      Array.from(
        { length: boundedCount },
        (_, index) => currentPlayers[index] ?? `Spiller ${index + 1}`,
      ),
    );
  }

  function updateImposterCount(nextCount: number) {
    setImposterCount(Math.min(maxImposterCount, Math.max(MIN_IMPOSTERS, nextCount)));
  }

  function updateSpyCount(nextCount: number) {
    setSpyCount(Math.min(maxSpyCount, Math.max(0, nextCount)));
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
    const rolePlayerIndexes = shuffleItems(playerIndexes);
    const word = pickRandom(selectedPack.words);

    setRound({
      word,
      spyWord: getRelatedWord(word),
      imposterIndexes: rolePlayerIndexes.slice(0, imposterCount),
      spyIndexes: rolePlayerIndexes.slice(imposterCount, imposterCount + spyCount),
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

    const nextActivePlayerIndexes = round.activePlayerIndexes.filter(
      (playerIndex) => playerIndex !== selectedVoteIndex,
    );
    const nextEliminatedPlayerIndexes = [...round.eliminatedPlayerIndexes, selectedVoteIndex];
    const nextCivilianCount = nextActivePlayerIndexes.filter(
      (playerIndex) => !isHiddenRole(round, playerIndex),
    ).length;
    const nextHiddenRoleCount = nextActivePlayerIndexes.filter((playerIndex) =>
      isHiddenRole(round, playerIndex),
    ).length;
    const winner =
      nextHiddenRoleCount === 0 ? 'civilians' : nextCivilianCount <= 1 ? 'hidden' : null;

    setRound({
      ...round,
      activePlayerIndexes: nextActivePlayerIndexes,
      speakingPlayerIndexes: round.speakingPlayerIndexes.filter(
        (playerIndex) => playerIndex !== selectedVoteIndex,
      ),
      eliminatedPlayerIndexes: nextEliminatedPlayerIndexes,
      voteNumber: round.voteNumber + 1,
      lastVotedIndex: selectedVoteIndex,
      winner,
    });
    setSelectedVoteIndex(null);
    setPhase(winner ? 'gameOver' : 'voteResult');
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
                    <Text style={styles.badgeText}>Skjulte roller</Text>
                  </View>
                  <Text style={styles.title}>Imposter</Text>
                  <Text style={styles.subtitle}>
                    Sivile får samme ord. Spioner får et lignende ord. Impostere får ikke ord.
                    Hold maska, og finn de skjulte rollene.
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
                  <Text style={styles.sectionLabel}>Roller</Text>
                  <View style={styles.roleGrid}>
                    <View style={styles.roleCard}>
                      <View style={styles.roleCopy}>
                        <Text style={styles.roleName}>Impostere</Text>
                        <Text style={styles.roleDescription}>Får ikke ord</Text>
                      </View>
                      <View style={styles.roleStepper}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Fjern imposter"
                          onPress={() => updateImposterCount(imposterCount - 1)}
                          style={({ pressed }) => [
                            styles.roleButton,
                            imposterCount === MIN_IMPOSTERS && styles.disabledButton,
                            pressed && imposterCount > MIN_IMPOSTERS && styles.pressed,
                          ]}>
                          <Text style={styles.roleButtonText}>-</Text>
                        </Pressable>
                        <Text style={styles.roleCount}>{imposterCount}</Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Legg til imposter"
                          onPress={() => updateImposterCount(imposterCount + 1)}
                          style={({ pressed }) => [
                            styles.roleButton,
                            imposterCount === maxImposterCount && styles.disabledButton,
                            pressed && imposterCount < maxImposterCount && styles.pressed,
                          ]}>
                          <Text style={styles.roleButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.roleCard}>
                      <View style={styles.roleCopy}>
                        <Text style={styles.roleName}>Spioner</Text>
                        <Text style={styles.roleDescription}>Får et lignende ord</Text>
                      </View>
                      <View style={styles.roleStepper}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Fjern spion"
                          onPress={() => updateSpyCount(spyCount - 1)}
                          style={({ pressed }) => [
                            styles.roleButton,
                            spyCount === 0 && styles.disabledButton,
                            pressed && spyCount > 0 && styles.pressed,
                          ]}>
                          <Text style={styles.roleButtonText}>-</Text>
                        </Pressable>
                        <Text style={styles.roleCount}>{spyCount}</Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Legg til spion"
                          onPress={() => updateSpyCount(spyCount + 1)}
                          style={({ pressed }) => [
                            styles.roleButton,
                            spyCount === maxSpyCount && styles.disabledButton,
                            pressed && spyCount < maxSpyCount && styles.pressed,
                          ]}>
                          <Text style={styles.roleButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.helperText}>
                    Du kan ha maks {maxHiddenRoleCount} skjulte roller med {playerCount} spillere.
                    Sivile må alltid være i flertall.
                  </Text>
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
                      (currentPlayerRole === 'imposter'
                        ? styles.secretCardImposter
                        : currentPlayerRole === 'spy'
                          ? styles.secretCardSpy
                          : styles.secretCardCivilian),
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.secretCardEyebrow}>
                    {cardVisible
                      ? currentPlayerRole === 'imposter'
                        ? 'Din rolle'
                        : currentPlayerRole === 'spy'
                          ? 'Spionord'
                          : 'Ditt ord'
                      : 'Trykk for å vise'}
                  </Text>
                  <Text style={styles.secretCardText}>
                    {cardVisible
                      ? currentPlayerRole === 'imposter'
                        ? 'Imposter'
                        : currentPlayerRole === 'spy'
                          ? round.spyWord
                          : round.word
                      : 'Skjult'}
                  </Text>
                  <Text style={styles.secretCardHint}>
                    {cardVisible
                      ? currentPlayerRole === 'imposter'
                        ? 'Du får ikke ord. Lat som du vet det.'
                        : currentPlayerRole === 'spy'
                          ? 'Du er spion. Ordet ditt ligner på de siviles.'
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
                    <Text style={styles.statusValue}>{activeHiddenRoleCount}</Text>
                    <Text style={styles.statusLabel}>Skjulte igjen</Text>
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
                      ? `var sivil. ${activeCivilianCount} sivile igjen.`
                      : `var ${getRoleLabel(lastVotedRole ?? 'civilian').toLowerCase()}. ${activeHiddenRoleCount} skjulte igjen.`}
                  </Text>
                </View>

                <View style={styles.playerList}>
                  {speakingPlayerIndexes.map((playerIndex, orderIndex) => (
                    <View key={playerIndex} style={styles.playerPill}>
                      <Text
                        style={[
                          styles.playerNumber,
                          { backgroundColor: getPlayerColor(playerIndex) },
                        ]}>
                        {orderIndex + 1}
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
  roleGrid: {
    gap: 10,
  },
  roleCard: {
    minHeight: 72,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2D4C4',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleCopy: {
    flex: 1,
    gap: 3,
  },
  roleName: {
    color: '#172116',
    fontSize: 16,
    fontWeight: '900',
  },
  roleDescription: {
    color: '#62584C',
    fontSize: 13,
    fontWeight: '700',
  },
  roleStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172116',
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  roleCount: {
    minWidth: 24,
    color: '#172116',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  helperText: {
    color: '#62584C',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
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
  secretCardSpy: {
    backgroundColor: '#F4A261',
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
