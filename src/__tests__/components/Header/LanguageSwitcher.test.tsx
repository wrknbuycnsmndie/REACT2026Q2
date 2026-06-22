import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../../../components/Header/LanguageSwitcher';
import { getMockUrl, setMockUrl } from '../../testUtils/nextMocks';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('LanguageSwitcher', () => {
  it('marks the current locale as active', () => {
    setMockUrl('/en/about');

    renderWithIntl(<LanguageSwitcher />);

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Russian' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('switches locale while preserving the current route and query string', async () => {
    const user = userEvent.setup();

    setMockUrl('/en/about?page=2&details=25');

    renderWithIntl(<LanguageSwitcher />);

    await user.click(screen.getByRole('link', { name: 'Russian' }));

    expect(getMockUrl()).toBe('/ru/about?page=2&details=25');
  });
});
