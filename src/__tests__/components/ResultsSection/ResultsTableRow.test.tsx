import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ResultsTableRow } from '../../../components/ResultsSection/ResultsTableRow';
import {
  resetSelectedPokemonStore,
  useSelectedPokemonStore,
} from '../../../store/selectedPokemonStore';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('ResultsTableRow', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
  });

  it('renders the item name and selection checkbox', () => {
    renderWithIntl(
      <ResultsTableRow
        currentPage={2}
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select pikachu' })).not.toBeChecked();
  });

  it('toggles store selection without opening details when the checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithIntl(
      <ResultsTableRow
        currentPage={3}
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select pikachu' }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(useSelectedPokemonStore.getState().selectedItemsById['25']).toMatchObject({
      detailsRoute: '/?page=3&details=25',
    });
  });

  it('opens details without changing selection when the row button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithIntl(
      <ResultsTableRow
        currentPage={1}
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'pikachu' }));

    expect(onSelect).toHaveBeenCalledWith('25');
    expect(useSelectedPokemonStore.getState().selectedItemsById['25']).toBeUndefined();
  });
});
