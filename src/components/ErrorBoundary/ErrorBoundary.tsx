import { useTranslations } from 'next-intl';
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

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
            return <ErrorBoundaryFallback onReset={this.handleReset} />;
        }

        return children;
    }
}

function ErrorBoundaryFallback({ onReset }: { onReset: () => void }) {
    const t = useTranslations('ErrorBoundary');

    return (
        <section className="error-boundary" aria-live="polite">
            <p className="error-boundary__label">{t('label')}</p>
            <h2 className="error-boundary__title">{t('title')}</h2>
            <p className="error-boundary__message">{t('message')}</p>
            <button
                className="error-boundary__button"
                type="button"
                onClick={onReset}
            >
                {t('reset')}
            </button>
        </section>
    );
}
