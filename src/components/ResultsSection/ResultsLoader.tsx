import { Component } from 'react';
import './ResultsLoader.css';

export class ResultsLoader extends Component {
    public render() {
        return (
            <div className="results-loader" aria-live="polite">
                <span className="results-loader__spinner" />
                <p className="results-loader__text">Loading results...</p>
            </div>
        );
    }
}
