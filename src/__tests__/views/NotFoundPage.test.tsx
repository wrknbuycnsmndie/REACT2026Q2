import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotFoundPage } from '../../views/NotFoundPage/NotFoundPage';
import { getMockUrl, setMockUrl } from '../testUtils/nextMocks';
import { renderWithIntl } from '../testUtils/renderWithIntl';

describe('NotFoundPage', () => {
  it('renders a clear 404 state with a link back to search', async () => {
    const user = userEvent.setup();

    setMockUrl('/missing-page');

    renderWithIntl(<NotFoundPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pikachu used Thunder Shock on this route',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The page you requested vanished into the tall grass. Head back to the Pokedex and keep your search moving.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Return to Pokemon Search' }),
    ).toHaveAttribute('href', '/en?page=1');

    await user.click(
      screen.getByRole('link', { name: 'Return to Pokemon Search' }),
    );

    expect(getMockUrl()).toBe('/en?page=1');
  });
});
