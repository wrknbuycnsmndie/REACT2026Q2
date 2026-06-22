import { useTranslations } from 'next-intl';

export function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <section className='about-page' aria-labelledby='about-page-title'>
      <p className='about-page__eyebrow'>{t('eyebrow')}</p>
      <h2 id='about-page-title' className='about-page__title'>
        {t('title')}
      </h2>
      <p className='about-page__text'>{t('description')}</p>
      <dl className='about-page__facts'>
        <div className='about-page__fact'>
          <dt>{t('author')}</dt>
          <dd>
            <a
              className='about-page__link'
              href='https://github.com/wrknbuycnsmndie'
              rel='noreferrer'
              target='_blank'
            >
              {t('authorName')}
            </a>
          </dd>
        </div>
        <div className='about-page__fact'>
          <dt>{t('course')}</dt>
          <dd>
            <a
              className='about-page__link'
              href='https://rs.school/courses/reactjs'
              rel='noreferrer'
              target='_blank'
            >
              {t('courseName')}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
