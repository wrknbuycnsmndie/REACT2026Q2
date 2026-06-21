import { render, screen } from '@testing-library/react';
import { AboutPage } from '../../views/AboutPage/AboutPage';

describe('AboutPage', () => {
  it('renders static about content and external course links', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pokemon Search Workshop',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Built by an RS School student as a Next.js exercise around search, pagination, and master-detail navigation patterns.',
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
