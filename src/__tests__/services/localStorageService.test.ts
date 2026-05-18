import { SEARCH_TERM_STORAGE_KEY } from '../../constants/storage';
import {
    getStoredSearchTerm,
    setStoredSearchTerm,
} from '../../services/localStorageService';



describe('localStorageService', () => {
    const originalLocalStorage = window.localStorage;

    const mockLocalStorage = (options?: {
        storedValue?: string | null;
        getItem?: ReturnType<typeof vi.fn>;
        setItem?: ReturnType<typeof vi.fn>;
    }) => {
        const getItem = options?.getItem ?? vi.fn(() => options?.storedValue ?? null);
        const setItem = options?.setItem ?? vi.fn();

        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: {
                getItem,
                setItem,
            },
        });

        return { getItem, setItem };
    };

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: originalLocalStorage,
        });
    });

    it('returns an empty string when no search term is stored', () => {
        const { getItem } = mockLocalStorage({ storedValue: null });

        expect(getStoredSearchTerm()).toBe('');
        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('returns the stored search term when present', () => {
        const { getItem } = mockLocalStorage({ storedValue: 'pikachu' });

        expect(getStoredSearchTerm()).toBe('pikachu');
        expect(getItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY);
    });

    it('stores the provided search term under the expected key', () => {
        const { setItem } = mockLocalStorage();

        setStoredSearchTerm('mewtwo');

        expect(setItem).toHaveBeenCalledWith(SEARCH_TERM_STORAGE_KEY, 'mewtwo');
    });
});