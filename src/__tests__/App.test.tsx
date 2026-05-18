import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { AppRouter } from '../router/AppRouter';
import {
    mockedFetchPokemonDetails,
    mockedFetchPokemonResults,
    resetPokemonSearchMocks,
} from './testUtils/pokemonSearchMocks';

vi.mock('../services/pokemon', () => ({
    fetchPokemonDetails: vi.fn(),
    fetchPokemonResults: vi.fn(),
}));

vi.mock('../services/localStorageService', () => ({
    getStoredSearchTerm: vi.fn(),
    setStoredSearchTerm: vi.fn(),
}));

describe('App', () => {
    beforeEach(() => {
        resetPokemonSearchMocks();
        mockedFetchPokemonResults.mockResolvedValue({
            items: [],
            page: 1,
            totalPages: 3,
        });
        mockedFetchPokemonDetails.mockResolvedValue({
            description: 'A mouse Pokemon.',
            height: 4,
            id: '25',
            imageUrl: 'https://example.com/pikachu.png',
            name: 'pikachu',
            types: ['electric'],
            weight: 60,
        });
    });

    it('shows the error boundary fallback after triggering a test error and recovers on reset', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRouter />
            </MemoryRouter>,
        );

        await screen.findByText('No results to display yet.');

        await user.click(screen.getByRole('button', { name: 'Trigger Error' }));

        expect(await screen.findByText('Application error')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Remove Error' }));

        expect(await screen.findByRole('heading', { level: 1, name: 'Pokemon Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    it('opens details after clicking a result and closes them with the close button', async () => {
        const user = userEvent.setup();

        mockedFetchPokemonResults.mockResolvedValue({
            items: [
                {
                    id: '25',
                    name: 'pikachu',
                },
            ],
            page: 1,
            totalPages: 1,
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRouter />
            </MemoryRouter>,
        );

        await user.click(await screen.findByRole('button', { name: 'pikachu' }));

        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes details after clicking the outer panel area', async () => {
        const user = userEvent.setup();

        mockedFetchPokemonResults.mockResolvedValue({
            items: [
                {
                    id: '25',
                    name: 'pikachu',
                },
            ],
            page: 1,
            totalPages: 1,
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRouter />
            </MemoryRouter>,
        );

        await user.click(await screen.findByRole('button', { name: 'pikachu' }));

        const dialog = await screen.findByRole('dialog');
        const panel = dialog.parentElement;

        if (!panel) {
            throw new Error('Expected details panel wrapper to exist.');
        }

        await user.click(panel);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
