import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { NotFoundPage } from '../../views/NotFoundPage/NotFoundPage';
import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';
import { getMockUrl, setMockUrl } from '../testUtils/nextMocks';

function renderNotFoundPage(locale: 'en' | 'ru') {
  const messages = locale === 'en' ? enMessages : ruMessages;

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFoundPage />
    </NextIntlClientProvider>,
  );
}

describe('NotFoundPage', () => {
  it.each([
    ['en', 'Pikachu used Thunder Shock on this route', 'Return to Pokemon Search', '/en?page=1'],
    ['ru', 'Пикачу использовал Thunder Shock на этой странице', 'Вернуться к поиску Покемонов', '/ru?page=1'],
  ])(
    'renders a clear 404 state for %s locale',
    async (locale, title, linkLabel, expectedHref) => {
    const user = userEvent.setup();

      setMockUrl(`/${locale}/missing-page`);

      renderNotFoundPage(locale as 'en' | 'ru');

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: title,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          locale === 'en'
            ? 'The page you requested vanished into the tall grass. Head back to the Pokedex and keep your search moving.'
            : 'Запрошенная страница исчезла в высокой траве. Вернитесь к Pokedex и продолжайте поиск.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: linkLabel })).toHaveAttribute(
        'href',
        expectedHref,
      );

      await user.click(screen.getByRole('link', { name: linkLabel }));

      expect(getMockUrl()).toBe(expectedHref);
    },
  );
});
