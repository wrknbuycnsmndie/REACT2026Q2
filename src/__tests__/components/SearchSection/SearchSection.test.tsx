import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SearchSection } from '../../../components/SearchSection/SearchSection';

describe('SearchSection', () => {
    it('renders the search input, submit button, and error trigger', () => {
        render(
            <SearchSection
                onSearchTermChange={vi.fn()}
                onSubmit={vi.fn()}
                onTestError={vi.fn()}
                searchTerm="pikachu"
            />,
        );

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Search',
            }),
        ).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue('pikachu');
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument();
    });

    it('calls the change handler when the user types', async () => {
        const user = userEvent.setup();
        const onSearchTermChange = vi.fn();

        render(
            <SearchSection
                onSearchTermChange={onSearchTermChange}
                onSubmit={vi.fn()}
                onTestError={vi.fn()}
                searchTerm=""
            />,
        );

        await user.type(screen.getByRole('searchbox', { name: 'Pokemon name' }), 'mew');

        expect(onSearchTermChange).toHaveBeenCalled();
    });

    it('calls the submit handler when the user submits the form', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <SearchSection
                onSearchTermChange={vi.fn()}
                onSubmit={onSubmit}
                onTestError={vi.fn()}
                searchTerm="eevee"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls the error trigger handler when requested', async () => {
        const user = userEvent.setup();
        const onTestError = vi.fn();

        render(
            <SearchSection
                onSearchTermChange={vi.fn()}
                onSubmit={vi.fn()}
                onTestError={onTestError}
                searchTerm=""
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Trigger Error' }));

        expect(onTestError).toHaveBeenCalledTimes(1);
    });
});
