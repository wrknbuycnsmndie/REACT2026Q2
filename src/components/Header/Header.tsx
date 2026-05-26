import { NavLink } from 'react-router';
import { useTheme } from '../../context/themeContext';
import './Header.css';

export function Header() {
  const { setTheme, theme } = useTheme();

  return (
    <header className='header'>
      <div className='header__top-row'>
        <p className='header__eyebrow'>React Functional Components</p>
        <div className='header__theme-panel'>
          <span className='header__theme-label'>Theme</span>
          <div
            aria-label='Theme'
            className='header__theme-switcher'
            role='group'
          >
            <button
              aria-pressed={theme === 'light'}
              className={`header__theme-button${theme === 'light' ? ' header__theme-button--active' : ''}`}
              type='button'
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              aria-pressed={theme === 'dark'}
              className={`header__theme-button${theme === 'dark' ? ' header__theme-button--active' : ''}`}
              type='button'
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
      <h1 className='header__title'>Pokemon Search</h1>
      <p className='header__subtitle'>
        Search Pokemon, review details, and manage your selected list.
      </p>
      <nav className='header__nav' aria-label='Primary'>
        <NavLink
          className={({ isActive }) =>
            `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
          }
          to='/?page=1'
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
          }
          to='/about'
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
