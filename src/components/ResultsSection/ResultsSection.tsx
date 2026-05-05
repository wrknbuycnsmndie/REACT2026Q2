import { Component } from 'react';
import './ResultsSection.css';

export class ResultsSection extends Component {
    public render() {
        return (
            <section className="results-section" aria-labelledby="results-title">
                <div className="results-section__header">
                    <h2 id="results-title" className="results-section__title">
                        Results
                    </h2>
                    <p className="results-section__description">
                        Search results will appear here once the data layer is implemented.
                    </p>
                </div>

                <div className="results-section__table">
                    <div className="results-section__row">
                        <span className="results-section__name">Item Name</span>
                        <span className="results-section__details">Item Description</span>
                    </div>

                    <p className="results-section__empty">No data loaded yet.</p>
                </div>
            </section>
        );
    }
}
