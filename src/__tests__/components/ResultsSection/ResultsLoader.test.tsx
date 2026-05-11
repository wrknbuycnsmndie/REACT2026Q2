import { render, screen } from '@testing-library/react';
import { ResultsLoader } from '../../../components/ResultsSection/ResultsLoader';

describe('ResultsLoader', () => {
    it('renders the loading indicator text in a polite live region', () => {
        render(<ResultsLoader />);

        expect(screen.getByText('Loading results...')).toBeInTheDocument();
        expect(screen.getByText('Loading results...').closest('[aria-live="polite"]')).not.toBeNull();
    });
});
