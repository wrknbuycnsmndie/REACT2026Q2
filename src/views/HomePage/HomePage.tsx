'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
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
    const [shouldThrowError, setShouldThrowError] = useState(false);

    const handleResetError = () => {
        setShouldThrowError(false);
    };

    const handleTriggerError = () => {
        setShouldThrowError(true);
    };

    return (
        <ErrorBoundary onReset={handleResetError}>
            <div className="home-page">
                <div
                    className={`home-page__content${hasDetailsPanel ? ' home-page__content--with-details' : ''}`}
                >
                    <PokemonSearch
                        initialResults={initialResults}
                        initialSearchTerm={initialSearchTerm}
                        onTestError={handleTriggerError}
                        shouldThrowError={shouldThrowError}
                    />
                    {detailsPanel}
                </div>
                <SelectedPokemonFlyout />
            </div>
        </ErrorBoundary>
    );
}
