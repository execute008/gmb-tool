import { describe, it, expect, vi, afterEach } from 'vitest';
import { initPageDetection, PAGE_DETECTION_EVENTS } from '../index';
import type { PageState } from '../types';

describe('Page Detection Integration', () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    if (cleanup) cleanup();
    cleanup = undefined;
    document.body.innerHTML = '';
  });

  it('exports PAGE_DETECTION_EVENTS constants', () => {
    expect(PAGE_DETECTION_EVENTS.PAGE_CHANGED).toBe('gmb-audit:page-changed');
    expect(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED).toBe('gmb-audit:business-profile-detected');
    expect(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED).toBe('gmb-audit:search-results-detected');
  });

  it('initPageDetection returns a cleanup function', () => {
    cleanup = initPageDetection();
    expect(typeof cleanup).toBe('function');
  });

  it('dispatches business-profile-detected on navigation to /place/', () => {
    cleanup = initPageDetection();
    const handler = vi.fn();
    document.addEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, handler);

    window.history.pushState({}, '', '/maps/place/TestBiz/');

    expect(handler).toHaveBeenCalled();
    const event = handler.mock.calls[0][0] as CustomEvent<PageState>;
    expect(event.detail.pageType).toBe('business-profile');

    document.removeEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, handler);
  });

  it('dispatches search-results-detected on navigation to /search/', () => {
    cleanup = initPageDetection();
    const handler = vi.fn();
    document.addEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, handler);

    window.history.pushState({}, '', '/maps/search/restaurants/');

    expect(handler).toHaveBeenCalled();
    const event = handler.mock.calls[0][0] as CustomEvent<PageState>;
    expect(event.detail.pageType).toBe('search-results');

    document.removeEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, handler);
  });

  it('does NOT dispatch specialized event for other page types', () => {
    cleanup = initPageDetection();
    const bizHandler = vi.fn();
    const searchHandler = vi.fn();
    document.addEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, bizHandler);
    document.addEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, searchHandler);

    window.history.pushState({}, '', '/maps/@37.7749,-122.4194,15z');

    expect(bizHandler).not.toHaveBeenCalled();
    expect(searchHandler).not.toHaveBeenCalled();

    document.removeEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, bizHandler);
    document.removeEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, searchHandler);
  });

  it('cleanup function stops detection', () => {
    cleanup = initPageDetection();
    const handler = vi.fn();
    document.addEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, handler);

    cleanup();
    cleanup = undefined;
    window.history.pushState({}, '', '/maps/place/AnotherBiz/');

    expect(handler).not.toHaveBeenCalled();

    document.removeEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, handler);
  });
});
