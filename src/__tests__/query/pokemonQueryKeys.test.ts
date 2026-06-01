import {
  getPokemonDetailsQueryKey,
  getPokemonResultsQueryKey,
} from '../../query/pokemonQueryKeys';

describe('pokemonQueryKeys', () => {
  it('builds the details query key from the selected Pokemon id', () => {
    expect(getPokemonDetailsQueryKey('25')).toEqual([
      'pokemon',
      'details',
      '25',
    ]);
  });

  it('builds the results query key from the search term and page', () => {
    expect(getPokemonResultsQueryKey('pikachu', 3)).toEqual([
      'pokemon',
      'results',
      'pikachu',
      3,
    ]);
  });

  it('keeps an empty search term in the results query key', () => {
    expect(getPokemonResultsQueryKey('', 1)).toEqual([
      'pokemon',
      'results',
      '',
      1,
    ]);
  });
});
