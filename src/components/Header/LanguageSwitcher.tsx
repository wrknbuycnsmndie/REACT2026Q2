'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '../../i18n/navigation';
import { locales, type Locale } from '../../i18n/routing';

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Header');
  const queryString = searchParams.toString();
  const href = queryString ? `${pathname}?${queryString}` : pathname;

  return (
    <div className='header__language-panel'>
      <span className='header__theme-label'>{t('language')}</span>
      <div
        aria-label={t('language')}
        className='header__theme-switcher'
        role='group'
      >
        {locales.map((locale) => (
          <Link
            aria-current={currentLocale === locale ? 'true' : undefined}
            className={`header__theme-button${currentLocale === locale ? ' header__theme-button--active' : ''}`}
            href={href}
            key={locale}
            locale={locale}
          >
            {getLocaleLabel(locale, t)}
          </Link>
        ))}
      </div>
    </div>
  );
}

function getLocaleLabel(
  locale: Locale,
  t: ReturnType<typeof useTranslations<'Header'>>,
) {
  return locale === 'en' ? t('english') : t('russian');
}
