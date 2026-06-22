import { screen } from '@testing-library/react';
import { ResultsError } from '../../../components/ResultsSection/ResultsError';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('ResultsError', () => {
    it('renders the request failure label and message', () => {
        renderWithIntl(<ResultsError message="Network timeout" />);

        expect(screen.getByText('Request failed')).toBeInTheDocument();
        expect(screen.getByText('Network timeout')).toBeInTheDocument();
        expect(screen.getByText('Request failed').closest('[aria-live="polite"]')).not.toBeNull();
    });
});
