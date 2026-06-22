'use client';

import { useRouter } from '../../i18n/navigation';

type PokemonDetailsRefreshButtonProps = {
  label: string;
};

export function PokemonDetailsRefreshButton({
  label,
}: PokemonDetailsRefreshButtonProps) {
  const router = useRouter();

  return (
    <button
      className='pokemon-details__close'
      type='button'
      onClick={() => {
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
