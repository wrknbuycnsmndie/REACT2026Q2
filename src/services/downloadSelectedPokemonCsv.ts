import { fetchPokemonDetails } from './pokemon';
import type { PokemonDetails } from '../types/pokemon';
import type { SelectedPokemonItem } from '../types/pokemonSelection';

const CSV_COLUMNS = [
  'name',
  'description',
  'details_url',
  'source_url',
  'image_url',
  'types',
  'height',
  'weight',
] as const;

export async function downloadSelectedPokemonCsv(
  items: SelectedPokemonItem[],
  loadPokemonDetails: (pokemonId: string) => Promise<PokemonDetails> =
    fetchPokemonDetails,
) {
  const itemsForDownload = await Promise.all(
    items.map(async (item) => {
      const details = await loadPokemonDetails(item.id);

      return {
        description: details.description,
        detailsRoute: item.detailsRoute,
        height: details.height,
        id: item.id,
        imageUrl: details.imageUrl,
        name: details.name,
        sourceUrl: item.sourceUrl,
        types: details.types,
        weight: details.weight,
      };
    }),
  );
  const csvContent = buildSelectedPokemonCsv(itemsForDownload);

  return new Response(csvContent, {
    headers: {
      'Content-Disposition': `attachment; filename="${getSelectedPokemonCsvFileName(itemsForDownload.length)}"`,
      'Content-Type': 'text/csv;charset=utf-8',
    },
  });
}

export function buildSelectedPokemonCsv(items: SelectedPokemonItem[]) {
  const rows = items.map((item) => [
    item.name,
    item.description ?? '',
    item.detailsRoute,
    item.sourceUrl ?? '',
    item.imageUrl ?? '',
    item.types?.join('|') ?? '',
    item.height?.toString() ?? '',
    item.weight?.toString() ?? '',
  ]);

  return [CSV_COLUMNS, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(String(value))).join(','))
    .join('\n');
}

export function getSelectedPokemonCsvFileName(selectedCount: number) {
  return `${selectedCount}_items.csv`;
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
