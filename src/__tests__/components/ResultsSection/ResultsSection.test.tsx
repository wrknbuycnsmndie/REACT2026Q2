import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ResultsSection } from '../../../components/ResultsSection/ResultsSection';
import { resetSelectedPokemonStore } from '../../../store/selectedPokemonStore';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('ResultsSection', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
  });

  it('renders the empty state when there are no results', () => {
    renderWithIntl(
      <ResultsSection
        currentPage={1}
        errorMessage=""
        isLoading={false}
        items={[]}
        onItemSelect={vi.fn()}
        onPageChange={vi.fn()}
        selectedPokemonId={null}
        totalPages={1}
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Results',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('No results to display yet.')).toBeInTheDocument();
  });

  it('renders the loading state while data is being fetched', () => {
    renderWithIntl(
      <ResultsSection
        currentPage={1}
        errorMessage=""
        isLoading
        items={[]}
        onItemSelect={vi.fn()}
        onPageChange={vi.fn()}
        selectedPokemonId={null}
        totalPages={1}
      />,
    );

    expect(screen.getByText('Loading results...')).toBeInTheDocument();
  });

  it('renders the error state when a request fails', () => {
    renderWithIntl(
      <ResultsSection
        currentPage={1}
        errorMessage="Unable to load Pokemon data."
        isLoading={false}
        items={[]}
        onItemSelect={vi.fn()}
        onPageChange={vi.fn()}
        selectedPokemonId={null}
        totalPages={1}
      />,
    );

    expect(screen.getByText('Request failed')).toBeInTheDocument();
    expect(screen.getByText('Unable to load Pokemon data.')).toBeInTheDocument();
  });

  it('renders a row for each item when results are available', () => {
    renderWithIntl(
      <ResultsSection
        currentPage={2}
        errorMessage=""
        isLoading={false}
        items={[
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            id: '4',
            name: 'charmander',
            url: 'https://pokeapi.co/api/v2/pokemon/4/',
          },
        ]}
        onItemSelect={vi.fn()}
        onPageChange={vi.fn()}
        selectedPokemonId={null}
        totalPages={3}
      />,
    );

    expect(screen.getByLabelText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByLabelText('charmander')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('keeps selection checked when items reappear after page navigation', async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();
    const onPageChange = vi.fn();
    const selectedItem = {
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    };
    const otherItem = {
      id: '133',
      name: 'eevee',
      url: 'https://pokeapi.co/api/v2/pokemon/133/',
    };
    const { rerender } = renderWithIntl(
      <ResultsSection
        currentPage={1}
        errorMessage=""
        isLoading={false}
        items={[selectedItem]}
        onItemSelect={onItemSelect}
        onPageChange={onPageChange}
        selectedPokemonId={null}
        totalPages={2}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select pikachu' }));
    expect(screen.getByRole('checkbox', { name: 'Select pikachu' })).toBeChecked();

    rerender(
      <ResultsSection
        currentPage={2}
        errorMessage=""
        isLoading={false}
        items={[otherItem]}
        onItemSelect={onItemSelect}
        onPageChange={onPageChange}
        selectedPokemonId={null}
        totalPages={2}
      />,
    );

    rerender(
      <ResultsSection
        currentPage={1}
        errorMessage=""
        isLoading={false}
        items={[selectedItem]}
        onItemSelect={onItemSelect}
        onPageChange={onPageChange}
        selectedPokemonId={null}
        totalPages={2}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Select pikachu' })).toBeChecked();
  });
});
