import { Component } from 'react';
import { Header } from './components/Header/Header';
import { PokemonSearch } from './components/PokemonSearch/PokemonSearch';
import './App.css';

export default class App extends Component {
    public render() {
        return (
            <main className="app">
                <div className="app__container">
                    <Header />

                    <div className="app__content">
                        <PokemonSearch />
                    </div>
                </div>
            </main>
        );
    }
}
