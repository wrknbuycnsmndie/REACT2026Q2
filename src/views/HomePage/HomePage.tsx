'use client';

import { useState } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { PokemonDetailsPanel } from '../../components/PokemonDetails/PokemonDetailsPanel';
import { PokemonSearch } from '../../components/PokemonSearch/PokemonSearch';
import { SelectedPokemonFlyout } from '../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { usePokemonDetailsParam } from '../../hooks/usePokemonDetailsParam';

export function HomePage() {
    const [shouldThrowError, setShouldThrowError] = useState(false);
    const { closeDetails, selectedPokemonId } = usePokemonDetailsParam();
    const { details, errorMessage, isLoading, refreshDetails } = usePokemonDetails(
        selectedPokemonId,
    );

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
                    className={`home-page__content${selectedPokemonId ? ' home-page__content--with-details' : ''}`}
                >
                    <PokemonSearch
                        onTestError={handleTriggerError}
                        shouldThrowError={shouldThrowError}
                    />
                    {selectedPokemonId ? (
                        <PokemonDetailsPanel
                            details={details}
                            errorMessage={errorMessage}
                            isLoading={isLoading}
                            onClose={closeDetails}
                            onRefresh={() => {
                                void refreshDetails();
                            }}
                        />
                    ) : null}
                </div>
                <SelectedPokemonFlyout />
            </div>
        </ErrorBoundary>
    );
}
