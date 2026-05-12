import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { mockedFetchPokemonResults, resetPokemonSearchMocks } from './testUtils/pokemonSearchMocks';

vi.mock('../services/pokemon', () => ({
    fetchPokemonResults: vi.fn(),
}));

vi.mock('../services/localStorageService', () => ({
    getStoredSearchTerm: vi.fn(),
    setStoredSearchTerm: vi.fn(),
}));

describe('App', () => {
    beforeEach(() => {
        resetPokemonSearchMocks();
        mockedFetchPokemonResults.mockResolvedValue([]);
    });

    it('shows the error boundary fallback after triggering a test error and recovers on reset', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        render(<App />);

        await screen.findByText('No results to display yet.');

        await user.click(screen.getByRole('button', { name: 'Trigger Error' }));

        expect(await screen.findByText('Application error')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Remove Error' }));

        expect(await screen.findByRole('heading', { level: 1, name: 'Pokemon Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
