type ResultsErrorProps = {
    message: string;
};

export function ResultsError({ message }: ResultsErrorProps) {
    return (
        <div className="results-error" aria-live="polite">
            <p className="results-error__label">Request failed</p>
            <p className="results-error__message">{message}</p>
        </div>
    );
}
