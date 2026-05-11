import { SEARCH_TERM_STORAGE_KEY } from '../constants/storage';
import { getStoredSearchTerm, setStoredSearchTerm } from './localStorageService';

describe('localStorageService', () => {
    const originalLocalStorage = window.localStorage;

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: originalLocalStorage,
        });
    });

    it('returns an empty string when no search term is stored', () => {
        const getItem = vi.fn(() => null);

        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: { getItem, setItem: vi.fn() },
        });

        expect(getStoredSearchTerm()).toBe('');

        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('returns the stored search term when present', () => {
        const getItem = vi.fn(() => 'pikachu');

        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: { getItem, setItem: vi.fn() },
        });

        expect(getStoredSearchTerm()).toBe('pikachu');

        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('stores the provided search term under the expected key', () => {
        const setItem = vi.fn();

        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: { getItem: vi.fn(), setItem },
        });

        setStoredSearchTerm('mewtwo');

        expect(setItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY, 'mewtwo');
    });
});
