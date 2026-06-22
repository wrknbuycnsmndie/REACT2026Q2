import {
    getCurrentSearchTerm,
    getCurrentDetailsId,
    getCurrentPage,
    getSearchParamsWithDetails,
    getSearchParamsWithPage,
    getSearchParamsWithSearchTerm,
    hasValidPageParam,
} from '../../helpers/searchParams';

describe('searchParams helpers', () => {
    it('validates and normalizes the page parameter', () => {
        expect(hasValidPageParam(new URLSearchParams('page=3'))).toBe(true);
        expect(hasValidPageParam(new URLSearchParams('page=0'))).toBe(false);
        expect(hasValidPageParam(new URLSearchParams('page=abc'))).toBe(false);

        expect(getCurrentPage(new URLSearchParams('page=4'))).toBe(4);
        expect(getCurrentPage(new URLSearchParams('page=-5'))).toBe(1);
    });

    it('preserves other params when updating the page', () => {
        const nextParams = getSearchParamsWithPage(
            new URLSearchParams('page=2&details=25'),
            0,
        );

        expect(nextParams.toString()).toBe('page=1&details=25');
    });

    it('reads and updates the search query parameter', () => {
        expect(getCurrentSearchTerm(new URLSearchParams('page=1'))).toBe('');
        expect(getCurrentSearchTerm(new URLSearchParams('query=  pikachu  '))).toBe('pikachu');

        const withSearchTerm = getSearchParamsWithSearchTerm(
            new URLSearchParams('page=2&details=25'),
            '  eevee  ',
        );
        expect(withSearchTerm.toString()).toBe('page=2&details=25&query=eevee');

        const withoutSearchTerm = getSearchParamsWithSearchTerm(
            withSearchTerm,
            '   ',
        );
        expect(withoutSearchTerm.toString()).toBe('page=2&details=25');
    });

    it('reads and updates the details parameter', () => {
        expect(getCurrentDetailsId(new URLSearchParams('page=1'))).toBeNull();
        expect(getCurrentDetailsId(new URLSearchParams('page=1&details=25'))).toBe('25');

        const withDetails = getSearchParamsWithDetails(
            new URLSearchParams('page=2'),
            '133',
        );
        expect(withDetails.toString()).toBe('page=2&details=133');

        const withoutDetails = getSearchParamsWithDetails(withDetails, null);
        expect(withoutDetails.toString()).toBe('page=2');
    });
});
