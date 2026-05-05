import { Component } from 'react';
import { Header } from './components/Header/Header';
import { ResultsSection } from './components/ResultsSection/ResultsSection';
import { SearchSection } from './components/SearchSection/SearchSection';
import type { SearchResultItem } from './types/search';
import './App.css';

const previewResults: SearchResultItem[] = [
    {
        id: 'bulbasaur',
        name: 'Bulbasaur',
        description: 'A Grass and Poison type Pokemon known for the seed on its back.',
    },
    {
        id: 'charmander',
        name: 'Charmander',
        description: 'A Fire type Pokemon with a flame on its tail from birth.',
    },
    {
        id: 'pikachu',
        name: 'Pikachu',
        description: 'An Electric type Pokemon recognized by its yellow fur and red cheek sacs.',
    },
];

export default class App extends Component {
    public render() {
        return (
            <main className="app">
                <div className="app__container">
                    <Header />

                    <div className="app__content">
                        <SearchSection />
                        <ResultsSection items={previewResults} />
                    </div>
                </div>
            </main>
        );
    }
}
