import { Route, Routes } from 'react-router';
import App from '../App';
import { HomePage } from '../pages/HomePage/HomePage';
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
      </Route>
    </Routes>
  );
}
