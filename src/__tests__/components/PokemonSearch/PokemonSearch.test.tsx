import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { PokemonSearch } from '../../../components/PokemonSearch/PokemonSearch';
import { fetchPokemonResults } from '../../../services/pokemon';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../../services/localStorageService';

vi.mock('../../../services/pokemon', () => ({
    fetchPokemonResults: vi.fn(),
}));

vi.mock('../../../services/localStorageService', () => ({
    getStoredSearchTerm: vi.fn(),
    setStoredSearchTerm: vi.fn(),
}));

const mockedFetchPokemonResults = vi.mocked(fetchPokemonResults);
const mockedGetStoredSearchTerm = vi.mocked(getStoredSearchTerm);
const mockedSetStoredSearchTerm = vi.mocked(setStoredSearchTerm);

describe('PokemonSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedGetStoredSearchTerm.mockReturnValue('');
    });

    it('loads initial mocked results on mount', async () => {
        mockedFetchPokemonResults.mockResolvedValue([
            {
                id: '25',
                name: 'pikachu',
                description: 'Electric mouse Pokemon.',
            },
        ]);

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        expect(mockedFetchPokemonResults).toHaveBeenCalledWith('');

        expect(await screen.findByLabelText('pikachu')).toBeInTheDocument();
        expect(screen.getByText('Electric mouse Pokemon.')).toBeInTheDocument();
    });

    it('renders an error state when the mocked initial request fails', async () => {
        mockedFetchPokemonResults.mockRejectedValue(new Error('Mocked API failure'));

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        expect(mockedFetchPokemonResults).toHaveBeenCalledWith('');

        expect(await screen.findByText('Request failed')).toBeInTheDocument();
        expect(screen.getByText('Mocked API failure')).toBeInTheDocument();
    });

    it('calls the mocked API and updates results after a search submit', async () => {
        const user = userEvent.setup();

        mockedFetchPokemonResults
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                {
                    id: '133',
                    name: 'eevee',
                    description: 'Its genetic code is irregular.',
                },
            ]);

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        await screen.findByText('No results to display yet.');

        await user.type(screen.getByRole('searchbox', { name: 'Pokemon name' }), '  Eevee  ');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(mockedFetchPokemonResults).toHaveBeenNthCalledWith(2, 'Eevee');
        });

        expect(await screen.findByLabelText('eevee')).toBeInTheDocument();
        expect(screen.getByText('Its genetic code is irregular.')).toBeInTheDocument();
    });

    it('restores the stored search term on mount and uses it for the initial request', async () => {
        mockedGetStoredSearchTerm.mockReturnValue('snorlax');
        mockedFetchPokemonResults.mockResolvedValue([
            {
                id: '143',
                name: 'snorlax',
                description: 'Very lazy. Just eats and sleeps.',
            },
        ]);

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue('snorlax');
        expect(mockedFetchPokemonResults).toHaveBeenCalledWith('snorlax');
        expect(await screen.findByLabelText('snorlax')).toBeInTheDocument();
    });

    it('renders a mocked error response after a submitted search fails', async () => {
        const user = userEvent.setup();

        mockedFetchPokemonResults.mockResolvedValueOnce([]);
        mockedFetchPokemonResults.mockRejectedValueOnce(new Error('Mocked submit failure'));

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        await screen.findByText('No results to display yet.');

        await user.type(screen.getByRole('searchbox', { name: 'Pokemon name' }), 'mew');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(await screen.findByText('Mocked submit failure')).toBeInTheDocument();
        expect(screen.getByText('Request failed')).toBeInTheDocument();
    });

    it('does not call the API again when submitting the same trimmed term', async () => {
        const user = userEvent.setup();

        mockedGetStoredSearchTerm.mockReturnValue('mew');
        mockedFetchPokemonResults.mockResolvedValue([
            {
                id: '151',
                name: 'mew',
                description: 'So rare that it is still said to be a mirage.',
            },
        ]);

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        await screen.findByLabelText('mew');

        await user.clear(screen.getByRole('searchbox', { name: 'Pokemon name' }));
        await user.type(screen.getByRole('searchbox', { name: 'Pokemon name' }), '  mew  ');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(mockedFetchPokemonResults).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue('mew');
    });

    it('stores the trimmed search term after a successful user search', async () => {
        const user = userEvent.setup();

        mockedFetchPokemonResults
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                {
                    id: '150',
                    name: 'mewtwo',
                    description:
                        'It was created by a scientist after years of horrific gene splicing.',
                },
            ]);

        render(<PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />);

        await screen.findByText('No results to display yet.');

        await user.type(screen.getByRole('searchbox', { name: 'Pokemon name' }), '  mewtwo ');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(mockedSetStoredSearchTerm).toHaveBeenCalledWith('mewtwo');
        });

        expect(await screen.findByLabelText('mewtwo')).toBeInTheDocument();
    });

});
