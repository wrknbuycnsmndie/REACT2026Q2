import { createElement } from 'react';
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { vi } from 'vitest';

const nextRouterMock = vi.hoisted(() => {
  const testOrigin = 'http://localhost';
  let currentUrl = new URL('/', testOrigin);
  const listeners = new Set<() => void>();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const setUrl = (href: string) => {
    currentUrl = new URL(href, testOrigin);

    if (typeof window !== 'undefined') {
      window.history.replaceState(
        null,
        '',
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
      );
    }

    notifyListeners();
  };

  return {
    createUrl: (href: string) => new URL(href, testOrigin),
    getHref: () =>
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    getPathname: () => currentUrl.pathname,
    getSearchParams: () => new URLSearchParams(currentUrl.search),
    reset: () => {
      setUrl('/');
    },
    setUrl,
    subscribe: (listener: () => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
});

function createTestUrl(href: string) {
  return nextRouterMock.createUrl(href);
}

function removeLocalePrefix(pathname: string) {
  return pathname.replace(/^\/(en|ru)(?=\/|$)/, '') || '/';
}

function isExternalOrHashHref(href: string) {
  return /^https?:\/\//.test(href) || href.startsWith('#');
}

function getLocalizedTestHref(href: string, locale = 'en') {
  if (isExternalOrHashHref(href)) {
    return href;
  }

  const url = createTestUrl(href);
  const pathname = removeLocalePrefix(url.pathname);

  return `/${locale}${pathname === '/' ? '' : pathname}${url.search}${url.hash}`;
}

export function setMockUrl(href: string) {
  nextRouterMock.setUrl(href);
}

export function getMockUrl() {
  return nextRouterMock.getHref();
}

export function resetMockUrl() {
  nextRouterMock.reset();
}

vi.mock('next/navigation', async () => {
  const { useSyncExternalStore } = await vi.importActual<typeof import('react')>(
    'react',
  );

  const useCurrentHref = () =>
    useSyncExternalStore(
      nextRouterMock.subscribe,
      nextRouterMock.getHref,
      nextRouterMock.getHref,
    );

  return {
    usePathname: () => {
      useCurrentHref();

      return nextRouterMock.getPathname();
    },
    useRouter: () => ({
      push: (href: string) => {
        nextRouterMock.setUrl(href);
      },
      refresh: vi.fn(),
      replace: (href: string) => {
        nextRouterMock.setUrl(href);
      },
    }),
    useSearchParams: () => {
      useCurrentHref();

      return nextRouterMock.getSearchParams();
    },
  };
});

vi.mock('next-intl/navigation', async () => {
  const { useSyncExternalStore } = await vi.importActual<typeof import('react')>(
    'react',
  );

  const useCurrentHref = () =>
    useSyncExternalStore(
      nextRouterMock.subscribe,
      nextRouterMock.getHref,
      nextRouterMock.getHref,
    );

  function IntlLinkMock({
    href,
    locale,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    locale?: string;
    children?: ReactNode;
  }) {
    const localizedHref = getLocalizedTestHref(href, locale);

    return createElement('a', {
      ...props,
      href: localizedHref,
      onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        event.preventDefault();
        nextRouterMock.setUrl(localizedHref);
      },
    });
  }

  return {
    createNavigation: () => ({
      Link: IntlLinkMock,
      getPathname: ({ href }: { href: string }) =>
        removeLocalePrefix(createTestUrl(href).pathname),
      redirect: (href: string) => {
        nextRouterMock.setUrl(getLocalizedTestHref(href));
      },
      usePathname: () => {
        useCurrentHref();

        return removeLocalePrefix(nextRouterMock.getPathname());
      },
      useRouter: () => ({
        push: (href: string) => {
          nextRouterMock.setUrl(getLocalizedTestHref(href));
        },
        refresh: vi.fn(),
        replace: (href: string) => {
          nextRouterMock.setUrl(getLocalizedTestHref(href));
        },
      }),
    }),
  };
});

vi.mock('next/link', () => ({
  default: function NextLinkMock({
    href,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return createElement('a', {
      ...props,
      href,
      onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        event.preventDefault();
        nextRouterMock.setUrl(href);
      },
    });
  },
}));

vi.mock('next/image', () => ({
  default: ({
    priority,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority;

    return createElement('img', props);
  },
}));
