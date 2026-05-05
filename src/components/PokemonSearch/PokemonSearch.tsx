import { Component } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../services/localStorageService';
import { fetchPokemonResults } from '../../services/pokemon';
import type { SearchResultItem } from '../../types/search';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchState = {
    isLoading: boolean;
    items: SearchResultItem[];
    searchTerm: string;
    submittedSearchTerm: string;
};

export class PokemonSearch extends Component<object, PokemonSearchState> {
    public state: PokemonSearchState = {
        isLoading: false,
        items: [],
        searchTerm: getStoredSearchTerm(),
        submittedSearchTerm: getStoredSearchTerm().trim(),
    };

    public componentDidMount() {
        void this.loadInitialResults();
    }

    private async loadInitialResults() {
        this.setState({ isLoading: true });

        try {
            const items = await fetchPokemonResults(this.state.searchTerm);

            this.setState({
                isLoading: false,
                items,
            });
        } catch {
            this.setState({
                isLoading: false,
                items: [],
            });
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

        setStoredSearchTerm(trimmedSearchTerm);
        this.setState({ isLoading: true });

        try {
            const items = await fetchPokemonResults(trimmedSearchTerm);

            this.setState({
                isLoading: false,
                items,
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        } catch {
            this.setState({
                isLoading: false,
                items: [],
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        }
    };

    public render() {
        const { isLoading, items, searchTerm } = this.state;

        return (
            <>
                <SearchSection
                    searchTerm={searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    onSubmit={this.handleSearchSubmit}
                />
                <ResultsSection isLoading={isLoading} items={items} />
            </>
        );
    }
}
