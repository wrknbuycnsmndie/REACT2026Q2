import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../../components/Header/Header';
import { ThemeProvider } from '../../../context/ThemeProvider';
import { getMockUrl, setMockUrl } from '../../testUtils/nextMocks';

describe('Header', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('renders the page heading and supporting copy', () => {
    setMockUrl('/');

    render(
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

    render(
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

  it('updates the route when primary navigation links are clicked', async () => {
    const user = userEvent.setup();

    setMockUrl('/');

    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(getMockUrl()).toBe('/about');

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(getMockUrl()).toBe('/?page=1');
  });
});
