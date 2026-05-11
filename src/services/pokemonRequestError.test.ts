import { PokemonRequestError } from './pokemonRequestError';

describe('PokemonRequestError', () => {
    it('returns the not found message for 404', () => {
        expect(PokemonRequestError.getMessage(404)).toBe('No Pokemon matched that search term.');
    });

    it('returns the service unavailable message for 5xx responses', () => {
        expect(PokemonRequestError.getMessage(503)).toBe(
            'The Pokemon service is unavailable right now. Please try again.',
        );
    });

    it('returns the generic message for other statuses', () => {
        expect(PokemonRequestError.getMessage(400)).toBe(
            'Unable to load Pokemon data. Please try again.',
        );
    });
});
