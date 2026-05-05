import { Component } from 'react';
import { Header } from './components/Header/Header';
import { ResultsSection } from './components/ResultsSection/ResultsSection';
import { SearchSection } from './components/SearchSection/SearchSection';
import './App.css';

export default class App extends Component {
    public render() {
        return (
            <main className="app">
                <div className="app__container">
                    <Header />

                    <div className="app__content">
                        <SearchSection />
                        <ResultsSection />
                    </div>
                </div>
            </main>
        );
    }
}
