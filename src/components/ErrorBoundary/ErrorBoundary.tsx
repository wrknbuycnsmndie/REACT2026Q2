import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

type ErrorBoundaryProps = {
    children: ReactNode;
    onReset: () => void;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
    };

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Application error boundary caught an error.', error, errorInfo);
    }

    private handleReset = () => {
        this.props.onReset();
        this.setState({ hasError: false });
    };

    public render() {
        const { children } = this.props;
        const { hasError } = this.state;

        if (hasError) {
            return (
                <section className="error-boundary" aria-live="polite">
                    <p className="error-boundary__label">Application error</p>
                    <h2 className="error-boundary__title">Something went wrong.</h2>
                    <p className="error-boundary__message">
                        The interface hit an unexpected problem and switched to a safe fallback
                        view.
                    </p>
                    <button
                        className="error-boundary__button"
                        type="button"
                        onClick={this.handleReset}
                    >
                        Remove Error
                    </button>
                </section>
            );
        }

        return children;
    }
}
