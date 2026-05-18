import { useState } from 'react';
import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../services/localStorageService';

type UseStoredSearchTermResult = {
  initialStoredSearchTerm: string;
  persistSubmittedSearchTerm: (term: string) => string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export function useStoredSearchTerm(): UseStoredSearchTermResult {
  const [initialStoredSearchTerm] = useState(() => getStoredSearchTerm());
  const [searchTerm, setSearchTerm] = useState(initialStoredSearchTerm);

  const persistSubmittedSearchTerm = (term: string): string => {
    const trimmedTerm = term.trim();

    setStoredSearchTerm(trimmedTerm);
    setSearchTerm(trimmedTerm);

    return trimmedTerm;
  };

  return {
    initialStoredSearchTerm,
    persistSubmittedSearchTerm,
    searchTerm,
    setSearchTerm,
  };
}
