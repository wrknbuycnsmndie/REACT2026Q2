import { render, screen } from '@testing-library/react';
import { ResultRow } from '../../../components/ResultsSection/ResultRow';

describe('ResultRow', () => {
    it('renders the item name and description', () => {
        render(
            <ResultRow
                item={{
                    id: '25',
                    name: 'pikachu',
                    description: 'Electric mouse Pokemon.',
                }}
            />,
        );

        expect(screen.getByLabelText('pikachu')).toBeInTheDocument();
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(screen.getByText('Electric mouse Pokemon.')).toBeInTheDocument();
    });
});
