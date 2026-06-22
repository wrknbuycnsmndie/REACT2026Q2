import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../../components/Header/Header';
import {
  THEME_STORAGE_KEY,
  ThemeProvider,
} from '../../../context/ThemeProvider';
import { getMockUrl, setMockUrl } from '../../testUtils/nextMocks';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('Header', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it('renders the page heading and supporting copy', () => {
    setMockUrl('/');

    renderWithIntl(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    expect(screen.getByText('React Functional Components')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pokemon Search',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Search Pokemon, review details, and manage your selected list.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('switches the app theme from the header controls', async () => {
    const user = userEvent.setup();

    setMockUrl('/');

    renderWithIntl(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Dark' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Light' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('persists theme changes and restores the stored theme after remount', async () => {
    const user = userEvent.setup();

    setMockUrl('/');

    const { unmount } = renderWithIntl(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    unmount();
    delete document.documentElement.dataset.theme;

    renderWithIntl(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  it('updates the route when primary navigation links are clicked', async () => {
    const user = userEvent.setup();

    setMockUrl('/');

    renderWithIntl(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(getMockUrl()).toBe('/en/about');

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(getMockUrl()).toBe('/en?page=1');
  });
});
