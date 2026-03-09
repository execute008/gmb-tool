/** Extracted data from one GBP listing in search results */
export interface SearchResultEntry {
  name: string | null;
  primaryCategory: string | null;
  rating: string | null;
  reviewCount: string | null;
  attributeCount: number;
}

function parseRating(el: Element | null): string | null {
  if (!el) return null;
  const label = el.getAttribute('aria-label') || '';
  const match = label.match(/([\d.]+)\s*star/i);
  if (match) return match[1];
  const text = el.textContent?.trim() || '';
  const numMatch = text.match(/^[\d.]+$/);
  return numMatch ? numMatch[0] : null;
}

function parseReviewCount(el: Element | null): string | null {
  if (!el) return null;
  const label = el.getAttribute('aria-label') || '';
  const match = label.match(/([\d,]+)\s*review/i);
  if (match) return match[1];
  const text = el.textContent?.trim() || '';
  const numMatch = text.match(/\(?([\d,]+)\)?/);
  return numMatch ? numMatch[1] : null;
}

/**
 * Extract key fields from all visible GBP listings in search results.
 * Returns one SearchResultEntry per listing found.
 */
export function extractSearchResults(doc: Document): SearchResultEntry[] {
  const containers = doc.querySelectorAll('.Nv2PK');
  if (containers.length === 0) return [];

  const results: SearchResultEntry[] = [];

  for (const container of containers) {
    const nameEl = container.querySelector('.fontHeadlineSmall')
      || container.querySelector('a.hfpxzc span')
      || container.querySelector('.qBF1Pd');

    const ratingEl = container.querySelector('span[role="img"][aria-label*="star"]')
      || container.querySelector('.MW4etd');

    const reviewEl = container.querySelector('span[aria-label*="review"]')
      || container.querySelector('.UY7F9');

    const categoryEl = container.querySelector('.W4Efsd span')
      || container.querySelector('.fontBodyMedium span:not([role])');

    // Count attribute-like elements (additional info spans beyond category)
    const attrElements = container.querySelectorAll('.W4Efsd');
    // First W4Efsd is usually category, rest are attributes
    const attributeCount = Math.max(0, attrElements.length - 1);

    results.push({
      name: nameEl?.textContent?.trim() || null,
      primaryCategory: categoryEl?.textContent?.trim() || null,
      rating: parseRating(ratingEl),
      reviewCount: parseReviewCount(reviewEl),
      attributeCount,
    });
  }

  return results;
}
