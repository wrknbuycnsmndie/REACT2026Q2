import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';

export function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <section className='not-found-page' aria-labelledby='not-found-page-title'>
      <div className='not-found-page__art' aria-hidden='true'>
        <div className='not-found-page__badge'>404</div>
        <Image
          className='not-found-page__pikachu'
          alt=''
          src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
          width={160}
          height={160}
        />
      </div>
      <div className='not-found-page__content'>
        <p className='not-found-page__eyebrow'>{t('eyebrow')}</p>
        <h2 id='not-found-page-title' className='not-found-page__title'>
          {t('title')}
        </h2>
        <p className='not-found-page__text'>{t('description')}</p>
        <Link className='not-found-page__link' href='/?page=1'>
          {t('returnToSearch')}
        </Link>
      </div>
    </section>
  );
}
