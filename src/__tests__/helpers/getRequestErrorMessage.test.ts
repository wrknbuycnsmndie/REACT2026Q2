import { getRequestErrorMessage } from '../../helpers/getRequestErrorMessage';

describe('getRequestErrorMessage', () => {
  it('keeps known user-facing request messages', () => {
    expect(
      getRequestErrorMessage(
        new Error('The Pokemon service is unavailable right now. Please try again.'),
      ),
    ).toBe('The Pokemon service is unavailable right now. Please try again.');
  });

  it('maps network failures to a clear connection message', () => {
    expect(getRequestErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Unable to reach the Pokemon service. Please check your connection and try again.',
    );
  });

  it('hides unknown technical errors behind a generic message', () => {
    expect(getRequestErrorMessage(new Error('Unexpected low-level failure'))).toBe(
      'Something went wrong while loading Pokemon data. Please try again.',
    );
  });

  it('returns the generic message for non-error values', () => {
    expect(getRequestErrorMessage('boom')).toBe(
      'Something went wrong while loading Pokemon data. Please try again.',
    );
  });
});
