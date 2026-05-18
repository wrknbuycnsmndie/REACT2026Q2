import './AboutPage.css';

export function AboutPage() {
  return (
    <section className='about-page' aria-labelledby='about-page-title'>
      <p className='about-page__eyebrow'>About The App</p>
      <h2 id='about-page-title' className='about-page__title'>
        Pokemon Search Workshop
      </h2>
      <p className='about-page__text'>
        Built by an RS School student as a React Router exercise around search,
        pagination, and master-detail navigation patterns.
      </p>
      <dl className='about-page__facts'>
        <div className='about-page__fact'>
          <dt>Author</dt>
          <dd>
            <a
              className='about-page__link'
              href='https://github.com/wrknbuycnsmndie'
              rel='noreferrer'
              target='_blank'
            >
              Anton Chapala
            </a>
          </dd>
        </div>
        <div className='about-page__fact'>
          <dt>Course</dt>
          <dd>
            <a
              className='about-page__link'
              href='https://rs.school/courses/reactjs'
              rel='noreferrer'
              target='_blank'
            >
              RS School React Course
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
