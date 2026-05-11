import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from 'react';
import { vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

class ThrowingChild extends Component<{ shouldThrow: boolean }> {
    public render() {
        if (this.props.shouldThrow) {
            throw new Error('Boundary test crash');
        }

        return <p>Safe content</p>;
    }
}

describe('ErrorBoundary', () => {
    it('renders fallback UI and logs when a child throws', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        render(
            <ErrorBoundary onReset={vi.fn()}>
                <ThrowingChild shouldThrow />
            </ErrorBoundary>,
        );

        expect(screen.getByText('Application error')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Something went wrong.',
            }),
        ).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    it('calls onReset and restores children after removing the error', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        const { rerender } = render(
            <ErrorBoundary onReset={onReset}>
                <ThrowingChild shouldThrow />
            </ErrorBoundary>,
        );

        rerender(
            <ErrorBoundary onReset={onReset}>
                <ThrowingChild shouldThrow={false} />
            </ErrorBoundary>,
        );

        await user.click(screen.getByRole('button', { name: 'Remove Error' }));

        expect(onReset).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Safe content')).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
