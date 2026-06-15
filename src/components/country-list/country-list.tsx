import { memo, useMemo } from 'react';
import { List, useDynamicRowHeight } from 'react-window';
import type { Country } from '../../types';
import { VirtualCountryRow, type VirtualCountryRowProps } from './virtual-country-row';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const normalizedQuery = searchQuery.toLowerCase();
      const filteredCountries = countries.filter((country) => {
        const matchesSearch = country.id.toLowerCase().includes(normalizedQuery);
        const matchesRegion =
          !selectedRegion || country.data.some((yearData) => yearData.region === selectedRegion);

        return matchesSearch && matchesRegion;
      });

      if (sortField === 'name') {
        return filteredCountries.sort((a, b) =>
          sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
        );
      }

      const populations = new Map<string, number>();
      filteredCountries.forEach((country) => {
        const population =
          country.data.find((yearData) => yearData.year === selectedYear)?.population ?? 0;
        populations.set(country.id, population);
      });

      return filteredCountries.sort((a, b) => {
        const populationA = populations.get(a.id) ?? 0;
        const populationB = populations.get(b.id) ?? 0;
        return sortOrder === 'asc' ? populationA - populationB : populationB - populationA;
      });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const rowHeight = useDynamicRowHeight({ defaultRowHeight: 260 });

    const rowProps = useMemo<VirtualCountryRowProps>(
      () => ({
        countries: filteredCountries,
        selectedColumns,
        selectedYear,
      }),
      [filteredCountries, selectedColumns, selectedYear]
    );

    return (
      <List
        className={styles.countryList}
        rowComponent={VirtualCountryRow}
        rowCount={filteredCountries.length}
        rowHeight={rowHeight}
        rowProps={rowProps}
        overscanCount={3}
        style={{ height: 720 }}
      />
    );
  }
);
