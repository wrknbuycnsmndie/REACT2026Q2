const GENERIC_REQUEST_ERROR_MESSAGE =
  'Something went wrong while loading Pokemon data. Please try again.';
const NETWORK_REQUEST_ERROR_MESSAGE =
  'Unable to reach the Pokemon service. Please check your connection and try again.';
const NOT_FOUND_REQUEST_ERROR_MESSAGE = 'No Pokemon matched that search term.';
const RETRY_REQUEST_MESSAGE_SUFFIX = 'Please try again.';

export function getRequestErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return GENERIC_REQUEST_ERROR_MESSAGE;
  }

  if (
    error.message === 'Failed to fetch' ||
    error.message === 'NetworkError when attempting to fetch resource.'
  ) {
    return NETWORK_REQUEST_ERROR_MESSAGE;
  }

  if (
    error.message === NOT_FOUND_REQUEST_ERROR_MESSAGE ||
    error.message.includes(RETRY_REQUEST_MESSAGE_SUFFIX)
  ) {
    return error.message;
  }

  return GENERIC_REQUEST_ERROR_MESSAGE;
}
