import type { PageType } from './types';

const URL_PATTERNS: { pattern: RegExp; type: PageType }[] = [
  { pattern: /\/place\//, type: 'business-profile' },
  { pattern: /\/search\//, type: 'search-results' },
];

const DOM_INDICATORS: { selector: string; type: PageType }[] = [
  { selector: '[data-attrid]', type: 'business-profile' },
  { selector: 'div[role="feed"]', type: 'search-results' },
];

/**
 * Classify the current Google Maps page type.
 * URL patterns take priority, DOM indicators are fallback.
 */
export function classifyPage(url: string, doc: Document): PageType {
  for (const { pattern, type } of URL_PATTERNS) {
    if (pattern.test(url)) return type;
  }
  for (const { selector, type } of DOM_INDICATORS) {
    if (doc.querySelector(selector)) return type;
  }
  return 'other';
}
