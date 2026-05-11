import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
    it('renders the page heading and supporting copy', () => {
        render(<Header />);

        expect(screen.getByText('React Class Components')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Pokemon Search',
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'A compact search area sits on top, with a larger results area below for the upcoming features.',
            ),
        ).toBeInTheDocument();
    });
});
