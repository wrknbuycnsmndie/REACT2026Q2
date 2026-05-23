import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ResultsTableRow } from '../../../components/ResultsSection/ResultsTableRow';

describe('ResultsTableRow', () => {
    it('renders the item name', () => {
        render(
            <ResultsTableRow
                isSelected={false}
                item={{
                    id: '25',
                    name: 'pikachu',
                }}
                onSelect={vi.fn()}
            />,
        );

        expect(screen.getByLabelText('pikachu')).toBeInTheDocument();
        expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
});
