import { useState } from 'react';
import { Outlet } from 'react-router';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { PokemonSearch } from '../../components/PokemonSearch/PokemonSearch';
import { usePokemonDetailsParam } from '../../hooks/usePokemonDetailsParam';
import './HomePage.css';

export function HomePage() {
    const [shouldThrowError, setShouldThrowError] = useState(false);
    const { selectedPokemonId } = usePokemonDetailsParam();

    const handleResetError = () => {
        setShouldThrowError(false);
    };

    const handleTriggerError = () => {
        setShouldThrowError(true);
    };

    return (
        <ErrorBoundary onReset={handleResetError}>
            <div
                className={`home-page__content${selectedPokemonId ? ' home-page__content--with-details' : ''}`}
            >
                <PokemonSearch
                    onTestError={handleTriggerError}
                    shouldThrowError={shouldThrowError}
                />
                <Outlet />
            </div>
        </ErrorBoundary>
    );
}
