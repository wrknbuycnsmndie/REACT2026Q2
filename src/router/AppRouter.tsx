import { Route, Routes } from 'react-router';
import App from '../App';
import { AboutPage } from '../pages/AboutPage/AboutPage';
import { HomePage } from '../pages/HomePage/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { PokemonDetailsRoute } from './PokemonDetailsRoute';
import { RequirePageParam } from './RequirePageParam';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route
          path='/'
          element={
            <RequirePageParam>
              <HomePage />
            </RequirePageParam>
          }
        >
          <Route index element={<PokemonDetailsRoute />} />
        </Route>
        <Route path='/about' element={<AboutPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
