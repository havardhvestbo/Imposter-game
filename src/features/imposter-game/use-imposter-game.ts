import { useState } from 'react';

import { MIN_IMPOSTERS } from './constants';
import {
  applyVote,
  createRound,
  getActiveHiddenPlayerNames,
  getActiveRoleCounts,
  getBoundedPlayerCount,
  getClampedRoleCounts,
  getCleanPlayers,
  getMaxHiddenRoleCount,
  getPlayerRole,
  makeDefaultPlayers,
} from './game';
import type { GamePhase, Round } from './types';
import { wordPacks } from './words';

export function useImposterGame() {
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
  const activeRoleCounts = round ? getActiveRoleCounts(round) : { civilians: 0, hidden: 0 };
  const activeHiddenPlayerNames = round ? getActiveHiddenPlayerNames(round, cleanPlayers) : '';
  const lastVotedIndex = round?.lastVotedIndex ?? null;
  const lastVotedPlayer = lastVotedIndex === null ? null : cleanPlayers[lastVotedIndex];
  const lastVotedRole =
    round && lastVotedIndex !== null ? getPlayerRole(round, lastVotedIndex) : null;

  function updatePlayerCount(nextCount: number) {
    const boundedCount = getBoundedPlayerCount(nextCount);
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

  function selectCategory(packId: string) {
    setSelectedPackId(packId);
    setIsCategoryMenuOpen(true);
  }

  function toggleCategoryMenu() {
    setIsCategoryMenuOpen((isOpen) => !isOpen);
  }

  function startRound() {
    setRound(createRound({ imposterCount, playerCount, spyCount, wordPack: selectedPack }));
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

    const nextRound = applyVote(round, selectedVoteIndex);
    setRound(nextRound);
    setSelectedVoteIndex(null);
    setPhase(nextRound.winner ? 'gameOver' : 'voteResult');
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

  return {
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
  };
}
