import { render, screen } from '@testing-library/react';
import { ResultsError } from '../../../components/ResultsSection/ResultsError';

describe('ResultsError', () => {
    it('renders the request failure label and message', () => {
        render(<ResultsError message="Network timeout" />);

        expect(screen.getByText('Request failed')).toBeInTheDocument();
        expect(screen.getByText('Network timeout')).toBeInTheDocument();
        expect(screen.getByText('Request failed').closest('[aria-live="polite"]')).not.toBeNull();
    });
});
