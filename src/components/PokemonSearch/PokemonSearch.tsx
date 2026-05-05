import { Component } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../services/localStorageService';
import { fetchPokemonResults } from '../../services/pokemon';
import type { SearchResultItem } from '../../types/search';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchProps = {
    onTestError: () => void;
    shouldThrowError: boolean;
};

type PokemonSearchState = {
    errorMessage: string;
    isLoading: boolean;
    items: SearchResultItem[];
    searchTerm: string;
    submittedSearchTerm: string;
};

export class PokemonSearch extends Component<PokemonSearchProps, PokemonSearchState> {
    public state: PokemonSearchState = {
        errorMessage: '',
        isLoading: false,
        items: [],
        searchTerm: getStoredSearchTerm(),
        submittedSearchTerm: getStoredSearchTerm().trim(),
    };

    public componentDidMount() {
        void this.loadInitialResults();
    }

    private async loadInitialResults() {
        this.setState({
            errorMessage: '',
            isLoading: true,
        });

        try {
            const items = await fetchPokemonResults(this.state.searchTerm);

            this.setState({
                errorMessage: '',
                isLoading: false,
                items,
            });
        } catch (error) {
            this.setState({
                errorMessage: this.getErrorMessage(error),
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
        this.setState({
            errorMessage: '',
            isLoading: true,
        });

        try {
            const items = await fetchPokemonResults(trimmedSearchTerm);

            this.setState({
                errorMessage: '',
                isLoading: false,
                items,
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        } catch (error) {
            this.setState({
                errorMessage: this.getErrorMessage(error),
                isLoading: false,
                items: [],
                searchTerm: trimmedSearchTerm,
                submittedSearchTerm: trimmedSearchTerm,
            });
        }
    };

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return 'Something went wrong while loading Pokemon data.';
    }

    public render() {
        const { onTestError, shouldThrowError } = this.props;
        const { errorMessage, isLoading, items, searchTerm } = this.state;

        if (shouldThrowError) {
            throw new Error('Test error boundary triggered.');
        }

        return (
            <>
                <SearchSection
                    onTestError={onTestError}
                    searchTerm={searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    onSubmit={this.handleSearchSubmit}
                />
                <ResultsSection errorMessage={errorMessage} isLoading={isLoading} items={items} />
            </>
        );
    }
}
