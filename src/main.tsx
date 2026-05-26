import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './context/ThemeProvider';
import './index.css';
import { AppRouter } from './router/AppRouter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
