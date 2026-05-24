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

  it('downloads the csv with native browser apis', () => {
    const appendSpy = vi.spyOn(document.body, 'append');
    const revokeObjectUrlSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const createObjectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:download-url');
    const clickSpy = vi.fn();
    const removeSpy = vi.fn();
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue({
        click: clickSpy,
        download: '',
        href: '',
        remove: removeSpy,
      } as unknown as HTMLAnchorElement);

    downloadSelectedPokemonCsv([
      {
        detailsRoute: '/?page=1&details=25',
        id: '25',
        name: 'pikachu',
        sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ]);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectUrlSpy).toHaveBeenCalledOnce();
    expect(appendSpy).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledOnce();
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:download-url');
  });
});
