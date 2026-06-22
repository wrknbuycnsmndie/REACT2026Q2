import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsTableRow } from '../../../components/ResultsSection/ResultsTableRow';
import {
  resetSelectedPokemonStore,
  useSelectedPokemonStore,
} from '../../../store/selectedPokemonStore';
import { getMockUrl, setMockUrl } from '../../testUtils/nextMocks';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('ResultsTableRow', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
    setMockUrl('/');
  });

  it('renders the item name and selection checkbox', () => {
    renderWithIntl(
      <ResultsTableRow
        currentPage={2}
        detailsHref='/?page=2&details=25'
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
      />,
    );

    expect(screen.getByLabelText('pikachu')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'pikachu' })).toHaveAttribute(
      'href',
      '/en?page=2&details=25',
    );
    expect(screen.getByRole('checkbox', { name: 'Select pikachu' })).not.toBeChecked();
  });

  it('toggles store selection without opening details when the checkbox is clicked', async () => {
    const user = userEvent.setup();

    renderWithIntl(
      <ResultsTableRow
        currentPage={3}
        detailsHref='/?page=3&details=25'
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select pikachu' }));

    expect(useSelectedPokemonStore.getState().selectedItemsById['25']).toMatchObject({
      detailsRoute: '/?page=3&details=25',
    });
  });

  it('opens details through URL navigation without changing selection when the row link is clicked', async () => {
    const user = userEvent.setup();

    renderWithIntl(
      <ResultsTableRow
        currentPage={1}
        detailsHref='/?page=1&details=25'
        isActive={false}
        item={{
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }}
      />,
    );

    await user.click(screen.getByRole('link', { name: 'pikachu' }));

    expect(getMockUrl()).toBe('/en?page=1&details=25');
    expect(useSelectedPokemonStore.getState().selectedItemsById['25']).toBeUndefined();
  });
});
