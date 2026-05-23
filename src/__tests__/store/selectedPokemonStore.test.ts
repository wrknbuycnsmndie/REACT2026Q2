import {
  resetSelectedPokemonStore,
  selectIsPokemonSelected,
  selectSelectedPokemonCount,
  selectSelectedPokemonItems,
  useSelectedPokemonStore,
} from '../../store/selectedPokemonStore';

describe('selectedPokemonStore', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
  });

  it('selects and unselects pokemon items', () => {
    useSelectedPokemonStore.getState().selectPokemon({
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    });

    expect(
      selectIsPokemonSelected('25')(useSelectedPokemonStore.getState()),
    ).toBe(true);
    expect(selectSelectedPokemonCount(useSelectedPokemonStore.getState())).toBe(
      1,
    );

    useSelectedPokemonStore.getState().unselectPokemon('25');

    expect(
      selectIsPokemonSelected('25')(useSelectedPokemonStore.getState()),
    ).toBe(false);
    expect(selectSelectedPokemonCount(useSelectedPokemonStore.getState())).toBe(
      0,
    );
  });

  it('toggles pokemon selection', () => {
    const item = {
      id: '133',
      name: 'eevee',
      url: 'https://pokeapi.co/api/v2/pokemon/133/',
    };

    useSelectedPokemonStore.getState().togglePokemonSelection(item);
    expect(selectSelectedPokemonCount(useSelectedPokemonStore.getState())).toBe(
      1,
    );

    useSelectedPokemonStore.getState().togglePokemonSelection(item);
    expect(selectSelectedPokemonCount(useSelectedPokemonStore.getState())).toBe(
      0,
    );
  });

  it('enriches selected pokemon with loaded details', () => {
    useSelectedPokemonStore.getState().selectPokemon({
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    });

    useSelectedPokemonStore.getState().syncSelectedPokemonDetails({
      description: 'Electric mouse Pokemon.',
      height: 4,
      id: '25',
      imageUrl: 'https://example.com/pikachu.png',
      name: 'pikachu',
      types: ['electric'],
      weight: 60,
    });

    expect(
      selectSelectedPokemonItems(useSelectedPokemonStore.getState()),
    ).toEqual([
      {
        description: 'Electric mouse Pokemon.',
        detailsRoute: '/?page=1&details=25',
        height: 4,
        id: '25',
        imageUrl: 'https://example.com/pikachu.png',
        name: 'pikachu',
        sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
        types: ['electric'],
        weight: 60,
      },
    ]);
  });
});
