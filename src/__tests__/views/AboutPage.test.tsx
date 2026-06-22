import { screen } from '@testing-library/react';
import { AboutPage } from '../../views/AboutPage/AboutPage';
import { renderWithIntl } from '../testUtils/renderWithIntl';

describe('AboutPage', () => {
  it('renders static about content and external course links', () => {
    renderWithIntl(<AboutPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pokemon Search Workshop',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'An RS School student application translated from Vite to Next.js with search, pagination, and master-detail navigation.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'RS School React Course' }),
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByRole('link', { name: 'Anton Chapala' })).toHaveAttribute(
      'href',
      'https://github.com/wrknbuycnsmndie',
    );
  });
});
