import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ResultRow } from '../../../components/ResultsSection/ResultRow';

describe('ResultRow', () => {
    it('renders the item name', () => {
        render(
            <ResultRow
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
