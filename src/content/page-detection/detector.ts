import type { PageType, PageState, PageChangedEvent } from './types';

type ClassifyFn = (url: string, doc: Document) => PageType;
type PageChangedCallback = (event: PageChangedEvent) => void;

/**
 * Creates a navigation detector that monitors Google Maps SPA navigation.
 * Uses history monkey-patching (primary) and popstate (fallback).
 * MutationObserver provides additional detection for DOM-only changes.
 */
export function createNavigationDetector(
  classify: ClassifyFn,
  doc: Document,
  win: Window
) {
  const callbacks: PageChangedCallback[] = [];
  let lastState: PageState | null = null;
  let observer: MutationObserver | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let originalPushState: typeof win.history.pushState;
  let originalReplaceState: typeof win.history.replaceState;
  let started = false;

  function checkNavigation(overrideUrl?: string) {
    const url = overrideUrl || win.location.href;
    const pageType = classify(url, doc);

    if (lastState && lastState.url === url && lastState.pageType === pageType) {
      return;
    }

    const currentState: PageState = {
      url,
      pageType,
      timestamp: Date.now(),
    };

    const event: PageChangedEvent = {
      previousState: lastState,
      currentState,
    };

    lastState = currentState;
    for (const cb of callbacks) cb(event);
  }

  function debouncedCheck() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkNavigation, 100);
  }

  function onPopState() {
    checkNavigation();
  }

  function start() {
    if (started) return;
    started = true;

    originalPushState = win.history.pushState.bind(win.history);
    originalReplaceState = win.history.replaceState.bind(win.history);

    win.history.pushState = function (data: unknown, unused: string, url?: string | URL | null) {
      originalPushState(data, unused, url);
      // Pass URL directly since location may not update synchronously in all environments
      const resolvedUrl = url ? new URL(url.toString(), win.location.href).href : win.location.href;
      checkNavigation(resolvedUrl);
    };

    win.history.replaceState = function (data: unknown, unused: string, url?: string | URL | null) {
      originalReplaceState(data, unused, url);
      const resolvedUrl = url ? new URL(url.toString(), win.location.href).href : win.location.href;
      checkNavigation(resolvedUrl);
    };

    win.addEventListener('popstate', onPopState);

    observer = new MutationObserver(debouncedCheck);
    if (doc.body) {
      observer.observe(doc.body, { subtree: true, childList: true });
    }
  }

  function stop() {
    if (!started) return;
    started = false;

    if (originalPushState) win.history.pushState = originalPushState;
    if (originalReplaceState) win.history.replaceState = originalReplaceState;

    win.removeEventListener('popstate', onPopState);

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    lastState = null;
  }

  function onPageChanged(cb: PageChangedCallback) {
    callbacks.push(cb);
  }

  return { start, stop, onPageChanged };
}
