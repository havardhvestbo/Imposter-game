export type GamePhase = 'setup' | 'reveal' | 'vote' | 'voteResult' | 'gameOver';

export type PlayerRole = 'civilian' | 'imposter' | 'spy';

export type Winner = 'civilians' | 'hidden';

export type WordPack = {
  id: string;
  label: string;
  color: string;
  words: string[];
};

export type Round = {
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
