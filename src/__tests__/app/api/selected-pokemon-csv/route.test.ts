import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../../app/api/selected-pokemon-csv/route';
import { downloadSelectedPokemonCsv } from '../../../../services/downloadSelectedPokemonCsv';

vi.mock('../../../../services/downloadSelectedPokemonCsv', () => ({
  downloadSelectedPokemonCsv: vi.fn(),
}));

describe('POST /api/selected-pokemon-csv', () => {
  beforeEach(() => {
    vi.mocked(downloadSelectedPokemonCsv).mockReset();
  });

  it('returns a csv attachment for valid selected items', async () => {
    vi.mocked(downloadSelectedPokemonCsv).mockResolvedValue(
      new Response('csv-body', {
        headers: {
          'Content-Disposition': 'attachment; filename="1_items.csv"',
          'Content-Type': 'text/csv;charset=utf-8',
        },
      }),
    );

    const formData = new FormData();
    formData.set(
      'items',
      JSON.stringify([
        {
          detailsRoute: '/?page=1&details=25',
          id: '25',
          name: 'pikachu',
          sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
        },
      ]),
    );

    const response = await POST(
      new Request('http://localhost/api/selected-pokemon-csv', {
        body: formData,
        method: 'POST',
      }),
    );

    expect(downloadSelectedPokemonCsv).toHaveBeenCalledWith([
      {
        detailsRoute: '/?page=1&details=25',
        id: '25',
        name: 'pikachu',
        sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ]);
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="1_items.csv"',
    );
    expect(await response.text()).toBe('csv-body');
  });

  it('rejects missing selected items', async () => {
    const response = await POST(
      new Request('http://localhost/api/selected-pokemon-csv', {
        method: 'POST',
      }),
    );

    expect(response.status).toBe(400);
  });
});
