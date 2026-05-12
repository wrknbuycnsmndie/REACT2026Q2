import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../services/localStorageService';

describe('localStorageService', () => {
    const originalLocalStorage = window.localStorage;

    const setMockLocalStorage = (overrides: Partial<Storage>) => {
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                ...overrides,
            },
        });
    };

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: originalLocalStorage,
        });
    });

    it('returns an empty string when no search term is stored', () => {
        const getItem = vi.fn(() => null);

        setMockLocalStorage({ getItem });

        expect(getStoredSearchTerm()).toBe('');

        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('returns the stored search term when present', () => {
        const getItem = vi.fn(() => 'pikachu');

        setMockLocalStorage({ getItem });

        expect(getStoredSearchTerm()).toBe('pikachu');

        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('stores the provided search term under the expected key', () => {
        const setItem = vi.fn();

        setMockLocalStorage({ setItem });

        setStoredSearchTerm('mewtwo');

        expect(setItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY, 'mewtwo');
    });
});
