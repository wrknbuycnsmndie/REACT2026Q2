import type { Metadata } from 'next';
import '../index.css';
import '../App.css';
import '../components/Header/Header.css';
import '../components/ErrorBoundary/ErrorBoundary.css';
import '../components/PokemonSearch/PokemonSearch.css';
import '../components/SearchSection/SearchSection.css';
import '../components/ResultsSection/ResultsSection.css';
import '../components/ResultsSection/ResultsError.css';
import '../components/ResultsSection/ResultsLoader.css';
import '../components/Pagination/Pagination.css';
import '../components/PokemonDetails/PokemonDetailsPanel.css';
import '../components/SelectedPokemonFlyout/SelectedPokemonFlyout.css';
import '../views/HomePage/HomePage.css';
import '../views/AboutPage/AboutPage.css';
import '../views/NotFoundPage/NotFoundPage.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Pokemon Search',
  description: 'Search Pokemon, review details, and manage your selected list.',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
