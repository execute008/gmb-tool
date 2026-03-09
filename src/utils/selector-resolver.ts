import type { SelectorMap } from '../config/selectors';

/**
 * Resolve a single element using the fallback selector chain.
 * Tries each selector in order, returns the first match or null.
 */
export function resolveSelector(
  selectorMap: SelectorMap,
  pageType: keyof SelectorMap,
  field: string,
  doc: Document
): Element | null {
  const group = selectorMap[pageType];
  if (!group) return null;
  const selectorList = group[field];
  if (!selectorList) return null;

  for (const selector of selectorList) {
    const el = doc.querySelector(selector);
    if (el) return el;
  }
  return null;
}

/**
 * Resolve all matching elements using the fallback selector chain.
 * Tries each selector in order, returns all matches from the first selector that hits.
 * Returns empty array if nothing matches.
 */
export function resolveAllSelectors(
  selectorMap: SelectorMap,
  pageType: keyof SelectorMap,
  field: string,
  doc: Document
): Element[] {
  const group = selectorMap[pageType];
  if (!group) return [];
  const selectorList = group[field];
  if (!selectorList) return [];

  for (const selector of selectorList) {
    const els = doc.querySelectorAll(selector);
    if (els.length > 0) return Array.from(els);
  }
  return [];
}
