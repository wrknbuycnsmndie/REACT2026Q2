import { Component } from 'react';
import type { ChangeEvent } from 'react';
import './SearchSection.css';

type SearchSectionProps = {
    onSearchTermChange: (event: ChangeEvent<HTMLInputElement>) => void;
    searchTerm: string;
};

export class SearchSection extends Component<SearchSectionProps> {
    public render() {
        const { onSearchTermChange, searchTerm } = this.props;

        return (
            <section className="search-section" aria-labelledby="search-title">
                <div className="search-section__header">
                    <h2 id="search-title" className="search-section__title">
                        Search
                    </h2>
                    <p className="search-section__description">
                        The search input restores the last saved term and drives the initial request.
                    </p>
                </div>

                <div className="search-section__form">
                    <input
                        className="search-section__input"
                        type="search"
                        placeholder="pikachu"
                        aria-label="Pokemon name"
                        value={searchTerm}
                        onChange={onSearchTermChange}
                    />
                    <button className="search-section__button" type="button" disabled>
                        Search
                    </button>
                </div>
            </section>
        );
    }
}
