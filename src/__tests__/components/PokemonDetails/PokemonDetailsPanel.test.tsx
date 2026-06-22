import { fireEvent, screen } from '@testing-library/react';
import { PokemonDetailsPanel } from '../../../components/PokemonDetails/PokemonDetailsPanel';
import { getMockUrl, setMockUrl } from '../../testUtils/nextMocks';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('PokemonDetailsPanel', () => {
    beforeEach(() => {
        setMockUrl('/?page=1&details=25');
    });

    it('renders the loading state', () => {
        renderWithIntl(
            <PokemonDetailsPanel
                closeHref='/?page=1'
                details={null}
                errorMessage=''
                isLoading
            />,
        );

        expect(screen.getByText('Loading details...')).toBeInTheDocument();
    });

    it('renders the error state', () => {
        renderWithIntl(
            <PokemonDetailsPanel
                closeHref='/?page=1'
                details={null}
                errorMessage='Details failed to load.'
                isLoading={false}
            />,
        );

        expect(screen.getByText('Details failed to load.')).toBeInTheDocument();
    });

    it('renders a fallback message when details are missing', () => {
        renderWithIntl(
            <PokemonDetailsPanel
                closeHref='/?page=1'
                details={null}
                errorMessage=''
                isLoading={false}
            />,
        );

        expect(screen.getByText('Unable to load details.')).toBeInTheDocument();
    });

    it('renders the details content and keeps closing URL-driven through the close link only', () => {
        renderWithIntl(
            <PokemonDetailsPanel
                closeHref='/?page=1'
                details={{
                    description: 'Electric mouse Pokemon.',
                    height: 4,
                    id: '25',
                    imageUrl: 'https://example.com/pikachu.png',
                    name: 'pikachu',
                    types: ['electric'],
                    weight: 60,
                }}
                errorMessage=''
                isLoading={false}
            />,
        );

        expect(screen.getByAltText('pikachu')).toHaveAttribute(
            'src',
            'https://example.com/pikachu.png',
        );
        expect(screen.getByText('Electric mouse Pokemon.')).toBeInTheDocument();
        expect(screen.getByText('electric')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));

        fireEvent.click(screen.getByRole('link', { name: 'Close' }));
        expect(getMockUrl()).toBe('/en?page=1');
    });
});
