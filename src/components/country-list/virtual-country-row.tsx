import type { RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';

export type VirtualCountryRowProps = {
  countries: Country[];
  selectedColumns: string[];
  selectedYear: number;
};

export const VirtualCountryRow = ({
  ariaAttributes,
  countries,
  index,
  selectedColumns,
  selectedYear,
  style,
}: RowComponentProps<VirtualCountryRowProps>) => {
  const country = countries[index];

  if (!country) {
    return null;
  }

  return (
    <div style={style} {...ariaAttributes}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};
