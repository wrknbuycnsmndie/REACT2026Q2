import { Component } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Header } from './components/Header/Header';
import { PokemonSearch } from './components/PokemonSearch/PokemonSearch';
import './App.css';

type AppState = {
    shouldThrowError: boolean;
};

export default class App extends Component<object, AppState> {
    public state: AppState = {
        shouldThrowError: false,
    };

    private handleResetError = () => {
        this.setState({ shouldThrowError: false });
    };

    private handleTriggerError = () => {
        this.setState({ shouldThrowError: true });
    };

    public render() {
        const { shouldThrowError } = this.state;

        return (
            <main className="app">
                <div className="app__container">
                    <ErrorBoundary onReset={this.handleResetError}>
                        <Header />

                        <div className="app__content">
                            <PokemonSearch
                                onTestError={this.handleTriggerError}
                                shouldThrowError={shouldThrowError}
                            />
                        </div>
                    </ErrorBoundary>
                </div>
            </main>
        );
    }
}
