import { NextResponse } from 'next/server';
import { downloadSelectedPokemonCsv } from '../../../services/downloadSelectedPokemonCsv';
import type { SelectedPokemonItem } from '../../../types/pokemonSelection';

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: 'Missing selected items.' }, { status: 400 });
  }

  const rawItems = formData.get('items');

  if (typeof rawItems !== 'string') {
    return NextResponse.json({ message: 'Missing selected items.' }, { status: 400 });
  }

  let items: SelectedPokemonItem[];

  try {
    items = JSON.parse(rawItems) as SelectedPokemonItem[];
  } catch {
    return NextResponse.json({ message: 'Invalid selected items.' }, { status: 400 });
  }

  const response = await downloadSelectedPokemonCsv(items);

  return new NextResponse(response.body, {
    headers: response.headers,
    status: response.status,
  });
}
