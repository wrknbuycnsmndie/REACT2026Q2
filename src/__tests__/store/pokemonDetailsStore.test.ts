import {
  resetPokemonDetailsStore,
  usePokemonDetailsStore,
} from '../../store/pokemonDetailsStore';

describe('pokemonDetailsStore', () => {
  beforeEach(() => {
    resetPokemonDetailsStore();
  });

  it('starts a details request with loading state', () => {
    usePokemonDetailsStore.getState().startDetailsRequest('25');

    expect(usePokemonDetailsStore.getState()).toMatchObject({
      activePokemonId: '25',
      details: null,
      errorMessage: '',
      isLoading: true,
    });
  });

  it('stores loaded pokemon details', () => {
    usePokemonDetailsStore.getState().setDetails({
      description: 'Electric mouse Pokemon.',
      height: 4,
      id: '25',
      imageUrl: 'https://example.com/pikachu.png',
      name: 'pikachu',
      types: ['electric'],
      weight: 60,
    });

    expect(usePokemonDetailsStore.getState()).toMatchObject({
      activePokemonId: '25',
      errorMessage: '',
      isLoading: false,
    });
    expect(usePokemonDetailsStore.getState().details).toMatchObject({
      id: '25',
      name: 'pikachu',
    });
  });

  it('stores a details error', () => {
    usePokemonDetailsStore
      .getState()
      .setDetailsError('Unable to load details.');

    expect(usePokemonDetailsStore.getState()).toMatchObject({
      details: null,
      errorMessage: 'Unable to load details.',
      isLoading: false,
    });
  });
});
