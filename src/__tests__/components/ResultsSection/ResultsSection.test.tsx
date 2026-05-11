import { render, screen } from '@testing-library/react';
import { ResultsSection } from '../../../components/ResultsSection/ResultsSection';

describe('ResultsSection', () => {
    it('renders the empty state when there are no results', () => {
        render(<ResultsSection errorMessage="" isLoading={false} items={[]} />);

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Results',
            }),
        ).toBeInTheDocument();
        expect(screen.getByText('No results to display yet.')).toBeInTheDocument();
    });

    it('renders the loading state while data is being fetched', () => {
        render(<ResultsSection errorMessage="" isLoading items={[]} />);

        expect(screen.getByText('Loading results...')).toBeInTheDocument();
    });

    it('renders the error state when a request fails', () => {
        render(<ResultsSection errorMessage="Unable to load Pokemon data." isLoading={false} items={[]} />);

        expect(screen.getByText('Request failed')).toBeInTheDocument();
        expect(screen.getByText('Unable to load Pokemon data.')).toBeInTheDocument();
    });

    it('renders a row for each item when results are available', () => {
        render(
            <ResultsSection
                errorMessage=""
                isLoading={false}
                items={[
                    {
                        id: '1',
                        name: 'bulbasaur',
                        description: 'A strange seed was planted on its back at birth.',
                    },
                    {
                        id: '4',
                        name: 'charmander',
                        description: 'Obviously prefers hot places.',
                    },
                ]}
            />,
        );

        expect(screen.getByLabelText('bulbasaur')).toBeInTheDocument();
        expect(screen.getByLabelText('charmander')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
});
