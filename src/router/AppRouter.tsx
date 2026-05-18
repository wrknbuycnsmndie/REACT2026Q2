import { Route, Routes } from 'react-router';
import App from '../App';

export function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<App />} />
    </Routes>
  );
}
