export function ResultsLoader() {
    return (
        <div className="results-loader" aria-live="polite">
            <span className="results-loader__spinner" />
            <p className="results-loader__text">Loading results...</p>
        </div>
    );
}
