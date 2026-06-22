import {
  buildSelectedPokemonCsv,
  downloadSelectedPokemonCsv,
  getSelectedPokemonCsvFileName,
} from '../../services/downloadSelectedPokemonCsv';

describe('downloadSelectedPokemonCsv', () => {
  it('builds csv rows with useful selected pokemon details', () => {
    expect(
      buildSelectedPokemonCsv([
        {
          description: 'Mouse "Pokemon"',
          detailsRoute: '/?page=1&details=25',
          height: 4,
          id: '25',
          imageUrl: 'https://example.com/pikachu.png',
          name: 'pikachu',
          sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
          types: ['electric'],
          weight: 60,
        },
      ]),
    ).toBe(
      [
        '"name","description","details_url","source_url","image_url","types","height","weight"',
        '"pikachu","Mouse ""Pokemon""","/?page=1&details=25","https://pokeapi.co/api/v2/pokemon/25/","https://example.com/pikachu.png","electric","4","60"',
      ].join('\n'),
    );
  });

  it('builds a file name that includes the selected item count', () => {
    expect(getSelectedPokemonCsvFileName(15)).toBe('15_items.csv');
  });

  it('loads pokemon details and returns a csv response', async () => {
    const loadPokemonDetails = vi.fn().mockResolvedValue({
      description: 'Mouse Pokemon',
      height: 4,
      id: '25',
      imageUrl: 'https://example.com/pikachu.png',
      name: 'pikachu',
      types: ['electric'],
      weight: 60,
    });

    const response = await downloadSelectedPokemonCsv(
      [
        {
          detailsRoute: '/?page=1&details=25',
          id: '25',
          name: 'pikachu',
          sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
        },
      ],
      loadPokemonDetails,
    );

    expect(loadPokemonDetails).toHaveBeenCalledWith('25');
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="1_items.csv"',
    );
    await expect(response.text()).resolves.toContain('Mouse Pokemon');
  });
});
