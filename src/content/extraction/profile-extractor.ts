import { selectors } from '../../config/selectors';
import { resolveSelector } from '../../utils/selector-resolver';
import { extractCategories } from './category-extractor';

/** Complete extracted dataset from a Google Business Profile page */
export interface BusinessProfileData {
  name: string | null;
  placeId: string | null;
  cid: string | null;
  primaryCategory: string | null;
  secondaryCategories: string[];
  rating: string | null;
  reviewCount: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  attributes: string | null;
  reviewUrl: string | null;
  directionsUrl: string | null;
  mapsUrl: string;
}

function getTextFromSelector(doc: Document, field: string): string | null {
  const el = resolveSelector(selectors, 'businessProfile', field, doc);
  return el?.textContent?.trim() || null;
}

function getPlaceIdFromUrl(url: string): string | null {
  // Try to extract from URL path: /place/Name/data=...!1s0x...:0x...
  const match = url.match(/!1s(0x[a-fA-F0-9]+:0x[a-fA-F0-9]+)/);
  if (match) return match[1];
  // Try ChIJ format
  const chijMatch = url.match(/(ChIJ[a-zA-Z0-9_-]+)/);
  if (chijMatch) return chijMatch[1];
  return null;
}

function getCidFromUrl(url: string): string | null {
  const match = url.match(/ludocid=(\d+)/);
  return match ? match[1] : null;
}

function getPlaceIdFromDom(doc: Document): string | null {
  const el = resolveSelector(selectors, 'businessProfile', 'placeId', doc);
  if (!el) return null;
  const href = el.getAttribute('href') || '';
  const match = href.match(/place\/[^/]+\/(ChIJ[a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const ludocid = href.match(/ludocid=(\d+)/);
  if (ludocid) return ludocid[1];
  return null;
}

/**
 * Extract comprehensive business profile data from a GBP page.
 * Returns all available fields; unavailable fields are null.
 */
export function extractBusinessProfile(doc: Document, url: string): BusinessProfileData {
  const { primary, secondary } = extractCategories(doc);

  const name = getTextFromSelector(doc, 'name');
  const placeId = getPlaceIdFromUrl(url) || getPlaceIdFromDom(doc);
  const cid = getCidFromUrl(url);

  const websiteEl = resolveSelector(selectors, 'businessProfile', 'website', doc);
  const website = websiteEl?.getAttribute('href') || null;

  const reviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : null;

  const directionsUrl = name
    ? `https://www.google.com/maps/dir//${encodeURIComponent(name)}`
    : null;

  return {
    name,
    placeId,
    cid,
    primaryCategory: primary,
    secondaryCategories: secondary,
    rating: getTextFromSelector(doc, 'rating'),
    reviewCount: getTextFromSelector(doc, 'reviewCount'),
    address: getTextFromSelector(doc, 'address'),
    phone: getTextFromSelector(doc, 'phone'),
    website,
    hours: getTextFromSelector(doc, 'hours'),
    attributes: getTextFromSelector(doc, 'attributes'),
    reviewUrl,
    directionsUrl,
    mapsUrl: url,
  };
}
