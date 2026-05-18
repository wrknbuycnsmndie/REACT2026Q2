import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Pagination } from '../../../components/Pagination/Pagination';

describe('Pagination', () => {
    it('disables the previous button on the first page and advances to the next page', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />,
        );

        expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Next page' }));

        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables the next button on the last page and goes back to the previous page', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />,
        );

        expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'Previous page' }));

        expect(onPageChange).toHaveBeenCalledWith(2);
    });
});
