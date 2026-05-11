import { Component } from 'react';
import './ResultsError.css';

type ResultsErrorProps = {
    message: string;
};

export class ResultsError extends Component<ResultsErrorProps> {
    public render() {
        const { message } = this.props;

        return (
            <div className="results-error" aria-live="polite">
                <p className="results-error__label">Request failed</p>
                <p className="results-error__message">{message}</p>
            </div>
        );
    }
}
