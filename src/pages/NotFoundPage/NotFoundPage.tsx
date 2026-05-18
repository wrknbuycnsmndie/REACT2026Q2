import { Link } from 'react-router';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <section className='not-found-page' aria-labelledby='not-found-page-title'>
      <div className='not-found-page__art' aria-hidden='true'>
        <div className='not-found-page__badge'>404</div>
        <img
          className='not-found-page__pikachu'
          alt=''
          src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
        />
      </div>
      <div className='not-found-page__content'>
        <p className='not-found-page__eyebrow'>404 Error</p>
        <h2 id='not-found-page-title' className='not-found-page__title'>
          Pikachu used Thunder Shock on this route
        </h2>
        <p className='not-found-page__text'>
          The page you requested vanished into the tall grass. Head back to the
          Pokedex and keep your search moving.
        </p>
        <Link className='not-found-page__link' to='/?page=1'>
          Return to Pokemon Search
        </Link>
      </div>
    </section>
  );
}
