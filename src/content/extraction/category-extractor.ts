import { selectors } from '../../config/selectors';
import { resolveSelector, resolveAllSelectors } from '../../utils/selector-resolver';

/** Extracted category data from a Google Business Profile */
export interface CategoryData {
  primary: string | null;
  secondary: string[];
}

/**
 * Extract primary and secondary categories from a GBP page.
 * Returns { primary: null, secondary: [] } if nothing found.
 */
export function extractCategories(doc: Document): CategoryData {
  // Extract primary category
  const primaryEl = resolveSelector(selectors, 'businessProfile', 'primaryCategory', doc);
  const primary = primaryEl?.textContent?.trim() || null;

  // Extract secondary categories
  const secondaryEls = resolveAllSelectors(selectors, 'businessProfile', 'secondaryCategories', doc);
  const secondary = secondaryEls
    .map((el) => el.textContent?.trim() || '')
    .filter((text) => text.length > 0)
    .filter((text) => text !== primary); // Exclude primary from secondaries

  return { primary, secondary };
}
