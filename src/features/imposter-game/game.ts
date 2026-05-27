import { MAX_PLAYERS, MIN_IMPOSTERS, MIN_PLAYERS, PLAYER_COLORS } from './constants';
import type { PlayerRole, Round, WordPack } from './types';
import { getRelatedWord } from './words';

export function makeDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, index) => `Spiller ${index + 1}`);
}

export function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffleItems<T>(items: T[]) {
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

export function getCleanPlayers(players: string[]) {
  return players.map((name, index) => name.trim() || `Spiller ${index + 1}`);
}

export function getBoundedPlayerCount(playerCount: number) {
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, playerCount));
}

export function getMaxHiddenRoleCount(playerCount: number) {
  return Math.max(MIN_IMPOSTERS, Math.floor((playerCount - 1) / 2));
}

export function getClampedRoleCounts(
  playerCount: number,
  imposterCount: number,
  spyCount: number,
) {
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

export function createRound({
  imposterCount,
  playerCount,
  spyCount,
  wordPack,
}: {
  imposterCount: number;
  playerCount: number;
  spyCount: number;
  wordPack: WordPack;
}): Round {
  const playerIndexes = Array.from({ length: playerCount }, (_, index) => index);
  const rolePlayerIndexes = shuffleItems(playerIndexes);
  const word = pickRandom(wordPack.words);

  return {
    word,
    spyWord: getRelatedWord(word),
    imposterIndexes: rolePlayerIndexes.slice(0, imposterCount),
    spyIndexes: rolePlayerIndexes.slice(imposterCount, imposterCount + spyCount),
    packLabel: wordPack.label,
    speakingPlayerIndexes: shuffleItems(playerIndexes),
    activePlayerIndexes: playerIndexes,
    eliminatedPlayerIndexes: [],
    voteNumber: 1,
    lastVotedIndex: null,
    winner: null,
  };
}

export function getPlayerRole(round: Round, playerIndex: number): PlayerRole {
  if (round.imposterIndexes.includes(playerIndex)) {
    return 'imposter';
  }

  if (round.spyIndexes.includes(playerIndex)) {
    return 'spy';
  }

  return 'civilian';
}

export function isHiddenRole(round: Round, playerIndex: number) {
  return getPlayerRole(round, playerIndex) !== 'civilian';
}

export function getRoleLabel(role: PlayerRole) {
  if (role === 'imposter') {
    return 'Imposter';
  }

  if (role === 'spy') {
    return 'Spion';
  }

  return 'Sivil';
}

export function getPlayerColor(playerIndex: number) {
  return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
}

export function getActiveRoleCounts(round: Round) {
  const hidden = round.activePlayerIndexes.filter((playerIndex) =>
    isHiddenRole(round, playerIndex),
  ).length;

  return {
    hidden,
    civilians: round.activePlayerIndexes.length - hidden,
  };
}

export function getActiveHiddenPlayerNames(round: Round, players: string[]) {
  return round.activePlayerIndexes
    .filter((playerIndex) => isHiddenRole(round, playerIndex))
    .map((playerIndex) => players[playerIndex])
    .join(', ');
}

export function applyVote(round: Round, selectedVoteIndex: number): Round {
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

  return {
    ...round,
    activePlayerIndexes: nextActivePlayerIndexes,
    speakingPlayerIndexes: round.speakingPlayerIndexes.filter(
      (playerIndex) => playerIndex !== selectedVoteIndex,
    ),
    eliminatedPlayerIndexes: nextEliminatedPlayerIndexes,
    voteNumber: round.voteNumber + 1,
    lastVotedIndex: selectedVoteIndex,
    winner,
  };
}
