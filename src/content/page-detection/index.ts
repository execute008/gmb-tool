import { classifyPage } from './classifier';
import { createNavigationDetector } from './detector';
import { PAGE_DETECTION_EVENTS, createPageEvent } from './events';
import type { PageChangedEvent } from './types';

export { PAGE_DETECTION_EVENTS };
export type { PageType, PageState, PageChangedEvent } from './types';

/**
 * Initialize page detection for Google Maps SPA navigation.
 * Returns a cleanup function to stop detection.
 */
export function initPageDetection(): () => void {
  const detector = createNavigationDetector(classifyPage, document, window);

  detector.onPageChanged((event: PageChangedEvent) => {
    document.dispatchEvent(
      createPageEvent(PAGE_DETECTION_EVENTS.PAGE_CHANGED, event.currentState)
    );

    if (event.currentState.pageType === 'business-profile') {
      document.dispatchEvent(
        createPageEvent(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, event.currentState)
      );
    } else if (event.currentState.pageType === 'search-results') {
      document.dispatchEvent(
        createPageEvent(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, event.currentState)
      );
    }
  });

  detector.start();

  return () => detector.stop();
}
