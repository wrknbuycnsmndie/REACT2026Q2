import { SEARCH_TERM_STORAGE_KEY } from '../constants/storage';

export function getStoredSearchTerm(): string {
    return window.localStorage.getItem(SEARCH_TERM_STORAGE_KEY) ?? '';
}
