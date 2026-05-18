import { PokemonRequestError } from '../../services/pokemonRequestError';

describe('PokemonRequestError', () => {
    it('returns the not found message for 404', () => {
        const message = PokemonRequestError.getMessage(404);

        expect(message).toBe('No Pokemon matched that search term.');
    });

    it('returns the service unavailable message for 5xx responses', () => {
        const message = PokemonRequestError.getMessage(503);

        expect(message).toBe(
            'The Pokemon service is unavailable right now. Please try again.',
        );
    });

    it('returns the generic message for other statuses', () => {
        const message = PokemonRequestError.getMessage(400);

        expect(message).toBe(
            'Unable to load Pokemon data. Please try again.',
        );
    });
});
