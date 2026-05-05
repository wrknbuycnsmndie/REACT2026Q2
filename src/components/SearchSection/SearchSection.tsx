import { Component } from 'react';
import './SearchSection.css';

export class SearchSection extends Component {
    public render() {
        return (
            <section className="search-section" aria-labelledby="search-title">
                <div className="search-section__header">
                    <h2 id="search-title" className="search-section__title">
                        Search
                    </h2>
                    <p className="search-section__description">
                        The search controls will be wired in the next features.
                    </p>
                </div>

                <div className="search-section__form">
                    <input
                        className="search-section__input"
                        type="search"
                        placeholder="pikachu"
                        aria-label="Pokemon name"
                        disabled
                    />
                    <button className="search-section__button" type="button" disabled>
                        Search
                    </button>
                </div>
            </section>
        );
    }
}
