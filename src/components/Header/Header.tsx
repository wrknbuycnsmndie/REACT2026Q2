'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { useTheme } from '../../context/themeContext';
import { Link, usePathname } from '../../i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations('Header');
  const pathname = usePathname();
  const isHomeActive = pathname === '/';
  const isAboutActive = pathname === '/about';

  return (
    <header className='header'>
      <div className='header__top-row'>
        <p className='header__eyebrow'>{t('eyebrow')}</p>
        <div className='header__theme-panel'>
          <span className='header__theme-label'>{t('theme')}</span>
          <div
            aria-label={t('theme')}
            className='header__theme-switcher'
            role='group'
          >
            <button
              aria-pressed={theme === 'light'}
              className={`header__theme-button${theme === 'light' ? ' header__theme-button--active' : ''}`}
              type='button'
              onClick={() => setTheme('light')}
            >
              {t('light')}
            </button>
            <button
              aria-pressed={theme === 'dark'}
              className={`header__theme-button${theme === 'dark' ? ' header__theme-button--active' : ''}`}
              type='button'
              onClick={() => setTheme('dark')}
            >
              {t('dark')}
            </button>
          </div>
        </div>
      </div>
      <h1 className='header__title'>{t('title')}</h1>
      <p className='header__subtitle'>{t('subtitle')}</p>
      <nav className='header__nav' aria-label={t('primaryNav')}>
        <Link
          className={`header__nav-link${isHomeActive ? ' header__nav-link--active' : ''}`}
          href='/?page=1'
        >
          {t('home')}
        </Link>
        <Link
          className={`header__nav-link${isAboutActive ? ' header__nav-link--active' : ''}`}
          href='/about'
        >
          {t('about')}
        </Link>
      </nav>
      <Suspense fallback={null}>
        <LanguageSwitcher />
      </Suspense>
    </header>
  );
}
