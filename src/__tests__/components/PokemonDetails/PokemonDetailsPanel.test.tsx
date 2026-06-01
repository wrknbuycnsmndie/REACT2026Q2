import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { PokemonDetailsPanel } from '../../../components/PokemonDetails/PokemonDetailsPanel';

describe('PokemonDetailsPanel', () => {
    it('renders the loading state', () => {
        render(
            <PokemonDetailsPanel
                details={null}
                errorMessage=''
                isLoading
                onClose={vi.fn()}
                onRefresh={vi.fn()}
            />,
        );

        expect(screen.getByText('Loading details...')).toBeInTheDocument();
    });

    it('renders the error state', () => {
        render(
            <PokemonDetailsPanel
                details={null}
                errorMessage='Details failed to load.'
                isLoading={false}
                onClose={vi.fn()}
                onRefresh={vi.fn()}
            />,
        );

        expect(screen.getByText('Details failed to load.')).toBeInTheDocument();
    });

    it('renders a fallback message when details are missing', () => {
        render(
            <PokemonDetailsPanel
                details={null}
                errorMessage=''
                isLoading={false}
                onClose={vi.fn()}
                onRefresh={vi.fn()}
            />,
        );

        expect(screen.getByText('Unable to load details.')).toBeInTheDocument();
    });

    it('renders the details content and closes only from the outer panel area', () => {
        const onClose = vi.fn();
        const onRefresh = vi.fn();

        render(
            <PokemonDetailsPanel
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
                onClose={onClose}
                onRefresh={onRefresh}
            />,
        );

        expect(screen.getByAltText('pikachu')).toHaveAttribute(
            'src',
            'https://example.com/pikachu.png',
        );
        expect(screen.getByText('Electric mouse Pokemon.')).toBeInTheDocument();
        expect(screen.getByText('electric')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('dialog'));
        expect(onClose).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
        expect(onRefresh).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
