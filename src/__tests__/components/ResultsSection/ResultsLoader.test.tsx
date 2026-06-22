import { screen } from '@testing-library/react';
import { ResultsLoader } from '../../../components/ResultsSection/ResultsLoader';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('ResultsLoader', () => {
    it('renders the loading indicator text in a polite live region', () => {
        renderWithIntl(<ResultsLoader />);

        expect(screen.getByText('Loading results...')).toBeInTheDocument();
        expect(screen.getByText('Loading results...').closest('[aria-live="polite"]')).not.toBeNull();
    });
});
