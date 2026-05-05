import { Component } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { getStoredSearchTerm } from '../../services/localStorageService';
import { fetchPokemonResults } from '../../services/pokemon';
import type { SearchResultItem } from '../../types/search';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchState = {
    items: SearchResultItem[];
    searchTerm: string;
    submittedSearchTerm: string;
};

export class PokemonSearch extends Component<object, PokemonSearchState> {
    public state: PokemonSearchState = {
        items: [],
        searchTerm: getStoredSearchTerm(),
        submittedSearchTerm: getStoredSearchTerm().trim(),
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

    private handleSearchSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedSearchTerm = this.state.searchTerm.trim();

        if (trimmedSearchTerm === this.state.submittedSearchTerm) {
            this.setState({ searchTerm: trimmedSearchTerm });
            return;
        }

        try {
            const items = await fetchPokemonResults(trimmedSearchTerm);

            this.setState({
                items,
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        } catch {
            this.setState({
                items: [],
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        }
    };

    public render() {
        const { items, searchTerm } = this.state;

        return (
            <>
                <SearchSection
                    searchTerm={searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    onSubmit={this.handleSearchSubmit}
                />
                <ResultsSection items={items} />
            </>
        );
    }
}
