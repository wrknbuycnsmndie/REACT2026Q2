import { Component } from 'react';
import type { ChangeEvent } from 'react';
import { getStoredSearchTerm } from '../../services/localStorageService';
import { fetchPokemonResults } from '../../services/pokemon';
import type { SearchResultItem } from '../../types/search';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchState = {
    items: SearchResultItem[];
    searchTerm: string;
};

export class PokemonSearch extends Component<object, PokemonSearchState> {
    public state: PokemonSearchState = {
        items: [],
        searchTerm: getStoredSearchTerm(),
    };

    public componentDidMount() {
        void this.loadInitialResults();
    }

    private async loadInitialResults() {
        try {
            const items = await fetchPokemonResults(this.state.searchTerm);

            this.setState({ items });
        } catch {
            this.setState({ items: [] });
        }
    }

    private handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    public render() {
        const { items, searchTerm } = this.state;

        return (
            <>
                <SearchSection
                    searchTerm={searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                />
                <ResultsSection items={items} />
            </>
        );
    }
}
