import { describe, expect, it } from 'vitest';

import { allWords, getRelatedWord } from './words';

describe('spy word mappings', () => {
  it('provides a distinct, valid related word for every playable word', () => {
    expect(allWords).toHaveLength(372);

    for (const word of allWords) {
      const relatedWord = getRelatedWord(word);

      expect(relatedWord, `missing mapping for "${word}"`).not.toBe(word);
      expect(allWords, `unknown related word for "${word}"`).toContain(relatedWord);
    }
  });

  it('is deterministic', () => {
    expect(Array.from({ length: 10 }, () => getRelatedWord('Agent'))).toEqual(
      Array.from({ length: 10 }, () => 'Sherlock Holmes'),
    );
  });
});
