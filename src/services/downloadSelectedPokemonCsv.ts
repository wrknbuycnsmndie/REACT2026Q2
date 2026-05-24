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

export function downloadSelectedPokemonCsv(items: SelectedPokemonItem[]) {
  const csvContent = buildSelectedPokemonCsv(items);
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = getSelectedPokemonCsvFileName(items.length);
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
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
