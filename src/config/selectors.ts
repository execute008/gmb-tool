/** Page type selector groups — each field maps to a fallback array of CSS selectors */
export type SelectorGroup = Record<string, string[]>;

export interface SelectorMap {
  businessProfile: SelectorGroup;
  searchResults: SelectorGroup;
}

/**
 * Centralized selector config — single source of truth for all DOM selectors.
 * Grouped by page type. Each field has a fallback array of CSS selectors.
 * When Google Maps changes markup, update ONLY this file.
 */
export const selectors: SelectorMap = {
  /** Selectors for individual business profile pages (/place/) */
  businessProfile: {
    name: ['h1.fontHeadlineLarge', 'h1[data-attrid="title"]', 'h1'],
    primaryCategory: ['button[jsaction*="category"]', '.fontBodyMedium a[href*="/search/"]', 'span[jsan*="category"]'],
    secondaryCategories: ['.fontBodyMedium a[href*="/search/"]', 'span[jsan*="category"]'],
    rating: ['span[role="img"][aria-label*="star"]', '.fontDisplayLarge', 'span.ceNzKf'],
    reviewCount: ['span[aria-label*="review"]', 'button[jsaction*="review"] span', 'span.RDApEe'],
    address: ['button[data-item-id="address"]', 'div[data-attrid="kc:/location/location:address"]', '.rogA2c'],
    phone: ['button[data-item-id^="phone"]', 'div[data-attrid="kc:/collection/knowledge_panels/has_phone:phone"]', '.rogA2c[data-item-id^="phone"]'],
    website: ['a[data-item-id="authority"]', 'a[aria-label*="website" i]', 'a.CsEnBe'],
    hours: ['div[aria-label*="hour" i]', 'table.eK4R0e', '.OqCZI'],
    attributes: ['div[aria-label*="accessibility" i]', '.LTs0Rc', '.E0DTEd'],
    placeId: ['link[href*="place/"]', 'div[data-pid]', 'a[href*="ludocid"]'],
  },

  /** Selectors for search result listings (/search/) */
  searchResults: {
    listingName: ['.fontHeadlineSmall', 'a.hfpxzc span', '.qBF1Pd'],
    listingRating: ['span[role="img"][aria-label*="star"]', '.MW4etd'],
    listingReviewCount: ['span[aria-label*="review"]', '.UY7F9'],
    listingCategory: ['.fontBodyMedium span:not([role])', '.W4Efsd span'],
  },
};
