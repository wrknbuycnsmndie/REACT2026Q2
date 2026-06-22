import { SEARCH_TERM_STORAGE_KEY } from '../constants/storage';

export function getStoredSearchTerm(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.localStorage.getItem(SEARCH_TERM_STORAGE_KEY) ?? '';
}

export function setStoredSearchTerm(searchTerm: string) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(SEARCH_TERM_STORAGE_KEY, searchTerm);
}
