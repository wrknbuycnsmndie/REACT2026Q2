import { Component } from 'react';
import './Header.css';

export class Header extends Component {
    public render() {
        return (
            <header className="header">
                <p className="header__eyebrow">React Class Components</p>
                <h1 className="header__title">Pokemon Search</h1>
                <p className="header__subtitle">
                    A compact search area sits on top, with a larger results area below for the
                    upcoming features.
                </p>
            </header>
        );
    }
}
