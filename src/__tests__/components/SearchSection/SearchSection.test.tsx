import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SearchSection } from '../../../components/SearchSection/SearchSection';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('SearchSection', () => {
  it('renders the search input, submit button, and action buttons', () => {
    renderWithIntl(
      <SearchSection
        onSearchTermChange={vi.fn()}
        onRefresh={vi.fn()}
        onTestError={vi.fn()}
        searchTerm='pikachu'
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Search',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue(
      'pikachu',
    );
    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveAttribute(
      'name',
      'query',
    );
    expect(screen.getByDisplayValue('1')).toHaveAttribute('name', 'page');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Refresh Results' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Trigger Error' }),
    ).toBeInTheDocument();
  });

  it('calls the change handler when the user types', async () => {
    const user = userEvent.setup();
    const onSearchTermChange = vi.fn();

    renderWithIntl(
      <SearchSection
        onSearchTermChange={onSearchTermChange}
        onRefresh={vi.fn()}
        onTestError={vi.fn()}
        searchTerm=''
      />,
    );

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      'mew',
    );

    expect(onSearchTermChange).toHaveBeenCalled();
  });

  it('renders a GET form for URL-driven search submission', () => {
    renderWithIntl(
      <SearchSection
        onSearchTermChange={vi.fn()}
        onRefresh={vi.fn()}
        onTestError={vi.fn()}
        searchTerm='eevee'
      />,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Pokemon name' }).closest('form'),
    ).toHaveAttribute('method', 'get');
  });

  it('calls the refresh handler when requested', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();

    renderWithIntl(
      <SearchSection
        onSearchTermChange={vi.fn()}
        onRefresh={onRefresh}
        onTestError={vi.fn()}
        searchTerm=''
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Refresh Results' }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls the error trigger handler when requested', async () => {
    const user = userEvent.setup();
    const onTestError = vi.fn();

    renderWithIntl(
      <SearchSection
        onSearchTermChange={vi.fn()}
        onRefresh={vi.fn()}
        onTestError={onTestError}
        searchTerm=''
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Trigger Error' }));

    expect(onTestError).toHaveBeenCalledTimes(1);
  });
});
