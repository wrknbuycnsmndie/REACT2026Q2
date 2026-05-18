import { Route, Routes } from 'react-router';
import App from '../App';
import { RequirePageParam } from './RequirePageParam';

export function AppRouter() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <RequirePageParam>
            <App />
          </RequirePageParam>
        }
      />
    </Routes>
  );
}
