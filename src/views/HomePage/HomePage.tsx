import type { ReactNode } from 'react';
import { PokemonSearch } from '../../components/PokemonSearch/PokemonSearch';
import { SelectedPokemonFlyout } from '../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import type { SearchResultsPage } from '../../types/search';

type HomePageProps = {
    detailsPanel?: ReactNode;
    hasDetailsPanel?: boolean;
    initialResults?: SearchResultsPage | null;
    initialSearchTerm?: string;
};

export function HomePage({
    detailsPanel = null,
    hasDetailsPanel = false,
    initialResults = null,
    initialSearchTerm,
}: HomePageProps) {
    return (
        <div className="home-page">
            <div
                className={`home-page__content${hasDetailsPanel ? ' home-page__content--with-details' : ''}`}
            >
                <PokemonSearch
                    initialResults={initialResults}
                    initialSearchTerm={initialSearchTerm}
                />
                {detailsPanel}
            </div>
            <SelectedPokemonFlyout />
        </div>
    );
}
