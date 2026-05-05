export class PokemonRequestError {
    public static getMessage(status: number): string {
        if (status === 404) {
            return 'No Pokemon matched that search term.';
        }

        if (status >= 500) {
            return 'The Pokemon service is unavailable right now. Please try again.';
        }

        return 'Unable to load Pokemon data. Please try again.';
    }
}
