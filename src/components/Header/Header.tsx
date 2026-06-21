'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../context/themeContext';

export function Header() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const isHomeActive = pathname === '/';
  const isAboutActive = pathname === '/about';

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
        <Link
          className={`header__nav-link${isHomeActive ? ' header__nav-link--active' : ''}`}
          href='/?page=1'
        >
          Home
        </Link>
        <Link
          className={`header__nav-link${isAboutActive ? ' header__nav-link--active' : ''}`}
          href='/about'
        >
          About
        </Link>
      </nav>
    </header>
  );
}
