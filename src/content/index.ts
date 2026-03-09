import { initPageDetection, PAGE_DETECTION_EVENTS } from './page-detection';

console.log('GMB Audit Tool loaded on Maps');

const cleanup = initPageDetection();

// Log page detection events for debugging
document.addEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, (e) => {
  const event = e as CustomEvent;
  console.log('[GMB Audit] Page changed:', event.detail.pageType, event.detail.url);
});

console.log('Page detection initialized');
