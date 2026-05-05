import { Component } from 'react';
import type { ChangeEvent } from 'react';
import { getStoredSearchTerm } from '../../services/localStorageService';
import './SearchSection.css';

type SearchSectionState = {
    searchTerm: string;
};

export class SearchSection extends Component<object, SearchSectionState> {
    public state: SearchSectionState = {
        searchTerm: '',
    };

    public componentDidMount() {
        const savedSearchTerm = getStoredSearchTerm();

        if (savedSearchTerm !== '') {
            this.setState({ searchTerm: savedSearchTerm });
        }
    }

    private handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    public render() {
        const { searchTerm } = this.state;

        return (
            <section className="search-section" aria-labelledby="search-title">
                <div className="search-section__header">
                    <h2 id="search-title" className="search-section__title">
                        Search
                    </h2>
                    <p className="search-section__description">
                        The search input restores the last saved term when the component loads.
                    </p>
                </div>

                <div className="search-section__form">
                    <input
                        className="search-section__input"
                        type="search"
                        placeholder="pikachu"
                        aria-label="Pokemon name"
                        value={searchTerm}
                        onChange={this.handleSearchTermChange}
                    />
                    <button className="search-section__button" type="button" disabled>
                        Search
                    </button>
                </div>
            </section>
        );
    }
}
