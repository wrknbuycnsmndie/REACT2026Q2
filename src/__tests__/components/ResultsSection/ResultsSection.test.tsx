import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ResultsSection } from '../../../components/ResultsSection/ResultsSection';

describe('ResultsSection', () => {
    it('renders the empty state when there are no results', () => {
        render(
            <ResultsSection
                currentPage={1}
                errorMessage=""
                isLoading={false}
                items={[]}
                onItemSelect={vi.fn()}
                onPageChange={vi.fn()}
                selectedPokemonId={null}
                totalPages={1}
            />,
        );

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Results',
            }),
        ).toBeInTheDocument();
        expect(screen.getByText('No results to display yet.')).toBeInTheDocument();
    });

    it('renders the loading state while data is being fetched', () => {
        render(
            <ResultsSection
                currentPage={1}
                errorMessage=""
                isLoading
                items={[]}
                onItemSelect={vi.fn()}
                onPageChange={vi.fn()}
                selectedPokemonId={null}
                totalPages={1}
            />,
        );

        expect(screen.getByText('Loading results...')).toBeInTheDocument();
    });

    it('renders the error state when a request fails', () => {
        render(
            <ResultsSection
                currentPage={1}
                errorMessage="Unable to load Pokemon data."
                isLoading={false}
                items={[]}
                onItemSelect={vi.fn()}
                onPageChange={vi.fn()}
                selectedPokemonId={null}
                totalPages={1}
            />,
        );

        expect(screen.getByText('Request failed')).toBeInTheDocument();
        expect(screen.getByText('Unable to load Pokemon data.')).toBeInTheDocument();
    });

    it('renders a row for each item when results are available', () => {
        render(
            <ResultsSection
                currentPage={2}
                errorMessage=""
                isLoading={false}
                items={[
                    {
                        id: '1',
                        name: 'bulbasaur',
                    },
                    {
                        id: '4',
                        name: 'charmander',
                    },
                ]}
                onItemSelect={vi.fn()}
                onPageChange={vi.fn()}
                selectedPokemonId={null}
                totalPages={3}
            />,
        );

        expect(screen.getByLabelText('bulbasaur')).toBeInTheDocument();
        expect(screen.getByLabelText('charmander')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
});
