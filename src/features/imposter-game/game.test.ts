import { describe, expect, it } from 'vitest';

import { applyVote, getClampedRoleCounts, startNextVote } from './game';
import type { Round } from './types';

function makeRound(overrides: Partial<Round> = {}): Round {
  return {
    word: 'Katt',
    spyWord: 'Hund',
    imposterIndexes: [0],
    spyIndexes: [],
    packLabel: 'Test',
    speakingPlayerIndexes: [0, 1, 2, 3],
    activePlayerIndexes: [0, 1, 2, 3],
    eliminatedPlayerIndexes: [],
    voteNumber: 1,
    lastVotedIndex: null,
    winner: null,
    ...overrides,
  };
}

describe('applyVote', () => {
  it('eliminates an active player without advancing the displayed vote number', () => {
    const result = applyVote(makeRound(), 1);

    expect(result.activePlayerIndexes).toEqual([0, 2, 3]);
    expect(result.speakingPlayerIndexes).toEqual([0, 2, 3]);
    expect(result.eliminatedPlayerIndexes).toEqual([1]);
    expect(result.lastVotedIndex).toBe(1);
    expect(result.voteNumber).toBe(1);
    expect(result.winner).toBeNull();
  });

  it('declares the civilians winners when the final hidden player is eliminated', () => {
    const result = applyVote(makeRound(), 0);

    expect(result.winner).toBe('civilians');
    expect(result.voteNumber).toBe(1);
  });

  it('declares the hidden roles winners when only one civilian remains', () => {
    const round = makeRound({
      activePlayerIndexes: [0, 1, 2],
      speakingPlayerIndexes: [0, 1, 2],
    });

    expect(applyVote(round, 1).winner).toBe('hidden');
  });

  it('ignores votes for inactive or unknown players', () => {
    const round = makeRound({ activePlayerIndexes: [0, 1, 2] });

    expect(applyVote(round, 3)).toBe(round);
    expect(applyVote(round, 99)).toBe(round);
  });
});

describe('startNextVote', () => {
  it('advances the number only when the next vote starts', () => {
    const result = startNextVote(makeRound({ lastVotedIndex: 1 }));

    expect(result.voteNumber).toBe(2);
    expect(result.lastVotedIndex).toBeNull();
  });
});

describe('getClampedRoleCounts', () => {
  it('always leaves at least two civilians for valid player counts', () => {
    expect(getClampedRoleCounts(3, 12, 12)).toEqual({
      imposterCount: 1,
      spyCount: 0,
    });
    expect(getClampedRoleCounts(12, 12, 12)).toEqual({
      imposterCount: 5,
      spyCount: 0,
    });
  });
});
