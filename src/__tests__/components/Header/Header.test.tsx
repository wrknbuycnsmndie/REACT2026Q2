import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from '../../../components/Header/Header';

describe('Header', () => {
    it('renders the page heading and supporting copy', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

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
        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    });
});
