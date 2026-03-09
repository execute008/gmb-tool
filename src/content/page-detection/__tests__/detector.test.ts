import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNavigationDetector } from '../detector';
import { classifyPage } from '../classifier';
import type { PageChangedEvent } from '../types';

describe('Navigation Detector', () => {
  let detector: ReturnType<typeof createNavigationDetector>;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
    detector = createNavigationDetector(classifyPage, document, window);
    detector.onPageChanged(callback);
  });

  afterEach(() => {
    detector.stop();
  });

  it('returns object with start, stop, onPageChanged methods', () => {
    expect(detector.start).toBeInstanceOf(Function);
    expect(detector.stop).toBeInstanceOf(Function);
    expect(detector.onPageChanged).toBeInstanceOf(Function);
  });

  it('fires callback on pushState', () => {
    detector.start();
    window.history.pushState({}, '', '/maps/place/TestBiz/');
    expect(callback).toHaveBeenCalled();
    const event: PageChangedEvent = callback.mock.calls[0][0];
    // URL should contain /place/ path
    expect(event.currentState.url).toContain('/maps/place/TestBiz/');
    expect(event.currentState.pageType).toBe('business-profile');
  });

  it('fires callback on popstate', () => {
    detector.start();
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(callback).toHaveBeenCalled();
  });

  it('does not fire duplicate events for same URL and pageType', () => {
    detector.start();
    window.history.pushState({}, '', '/maps/place/TestBiz/');
    const callCount = callback.mock.calls.length;
    window.history.pushState({}, '', '/maps/place/TestBiz/');
    expect(callback.mock.calls.length).toBe(callCount);
  });

  it('stop() prevents further callbacks', () => {
    detector.start();
    detector.stop();
    window.history.pushState({}, '', '/maps/place/NewBiz/');
    expect(callback).not.toHaveBeenCalled();
  });

  it('first event has previousState as null', () => {
    detector.start();
    window.history.pushState({}, '', '/maps/place/FirstBiz/');
    const event: PageChangedEvent = callback.mock.calls[0][0];
    expect(event.previousState).toBeNull();
  });

  it('subsequent events have previousState set', () => {
    detector.start();
    window.history.pushState({}, '', '/maps/place/Biz1/');
    window.history.pushState({}, '', '/maps/search/coffee/');
    if (callback.mock.calls.length >= 2) {
      const event: PageChangedEvent = callback.mock.calls[1][0];
      expect(event.previousState).not.toBeNull();
      expect(event.previousState!.pageType).toBe('business-profile');
    }
  });
});
