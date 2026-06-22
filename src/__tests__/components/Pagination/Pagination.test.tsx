import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../../../components/Pagination/Pagination';
import { getMockUrl } from '../../testUtils/nextMocks';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('Pagination', () => {
    it('renders previous and next links and advances to the next page', async () => {
        const user = userEvent.setup();

        renderWithIntl(
            <Pagination
                currentPage={1}
                totalPages={3}
                getPageHref={(page) => `/?page=${page}`}
            />,
        );

        expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute(
            'href',
            '/en?page=0',
        );
        expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute(
            'aria-disabled',
            'true',
        );
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

        await user.click(screen.getByRole('link', { name: 'Next page' }));

        expect(getMockUrl()).toBe('/en?page=2');
    });

    it('marks the next link disabled on the last page and still links back', async () => {
        const user = userEvent.setup();

        renderWithIntl(
            <Pagination
                currentPage={3}
                totalPages={3}
                getPageHref={(page) => `/?page=${page}`}
            />,
        );

        expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
            'aria-disabled',
            'true',
        );

        await user.click(screen.getByRole('link', { name: 'Previous page' }));

        expect(getMockUrl()).toBe('/en?page=2');
    });
});
