import { createElement } from 'react';
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { vi } from 'vitest';

const nextRouterMock = vi.hoisted(() => {
  const origin = 'http://localhost';
  let currentUrl = new URL('/', origin);
  const listeners = new Set<() => void>();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const setUrl = (href: string) => {
    currentUrl = new URL(href, origin);

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
    getHref: () => `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
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
