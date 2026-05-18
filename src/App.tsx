import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Header } from './components/Header/Header';
import { PokemonSearch } from './components/PokemonSearch/PokemonSearch';
import './App.css';

export default function App() {
    const [shouldThrowError, setShouldThrowError] = useState(false);

    const handleResetError = () => {
        setShouldThrowError(false);
    };

    const handleTriggerError = () => {
        setShouldThrowError(true);
    };

    return (
        <main className="app">
            <div className="app__container">
                <ErrorBoundary onReset={handleResetError}>
                    <Header />

                    <div className="app__content">
                        <PokemonSearch
                            onTestError={handleTriggerError}
                            shouldThrowError={shouldThrowError}
                        />
                    </div>
                </ErrorBoundary>
            </div>
        </main>
    );
}
