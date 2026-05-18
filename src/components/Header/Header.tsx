import { NavLink } from 'react-router';
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <p className="header__eyebrow">React Class Components</p>
            <h1 className="header__title">Pokemon Search</h1>
            <p className="header__subtitle">
                A compact search area sits on top, with a larger results area below for the
                upcoming features.
            </p>
            <nav className="header__nav" aria-label="Primary">
                <NavLink
                    className={({ isActive }) =>
                        `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
                    }
                    to="/?page=1"
                >
                    Home
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
                    }
                    to="/about"
                >
                    About
                </NavLink>
            </nav>
        </header>
    );
}
