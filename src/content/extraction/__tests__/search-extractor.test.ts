import { describe, it, expect, beforeEach } from 'vitest';
import { extractSearchResults, type SearchResultEntry } from '../search-extractor';

const LISTING_FIXTURE = `
<div role="feed">
  <div class="Nv2PK">
    <a class="hfpxzc" href="/maps/place/Joes+Pizza/">
      <span class="fontHeadlineSmall">Joe's Pizza</span>
    </a>
    <span role="img" aria-label="4.5 stars">4.5</span>
    <span aria-label="1,234 reviews">(1,234)</span>
    <div class="fontBodyMedium">
      <span class="W4Efsd"><span>Restaurant</span></span>
    </div>
    <div class="W4Efsd"><span>Takeout</span> · <span>Delivery</span></div>
  </div>
  <div class="Nv2PK">
    <a class="hfpxzc" href="/maps/place/Bobs+Burgers/">
      <span class="fontHeadlineSmall">Bob's Burgers</span>
    </a>
    <span role="img" aria-label="4.2 stars">4.2</span>
    <span aria-label="567 reviews">(567)</span>
    <div class="fontBodyMedium">
      <span class="W4Efsd"><span>Burger Restaurant</span></span>
    </div>
  </div>
</div>
`;

const PARTIAL_FIXTURE = `
<div role="feed">
  <div class="Nv2PK">
    <a class="hfpxzc" href="/maps/place/New+Place/">
      <span class="fontHeadlineSmall">New Place</span>
    </a>
  </div>
</div>
`;

describe('Search Result Extractor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('extracts multiple listings', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    expect(results).toHaveLength(2);
  });

  it('extracts name from listing', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    expect(results[0].name).toBe("Joe's Pizza");
    expect(results[1].name).toBe("Bob's Burgers");
  });

  it('extracts rating from aria-label', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    expect(results[0].rating).toBe('4.5');
    expect(results[1].rating).toBe('4.2');
  });

  it('extracts review count', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    expect(results[0].reviewCount).toBe('1,234');
    expect(results[1].reviewCount).toBe('567');
  });

  it('extracts primary category', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    expect(results[0].primaryCategory).toBe('Restaurant');
    expect(results[1].primaryCategory).toBe('Burger Restaurant');
  });

  it('returns empty array when no listings found', () => {
    document.body.innerHTML = '<div>Empty page</div>';
    const results = extractSearchResults(document);
    expect(results).toEqual([]);
  });

  it('handles listings with partial data', () => {
    document.body.innerHTML = PARTIAL_FIXTURE;
    const results = extractSearchResults(document);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('New Place');
    expect(results[0].rating).toBeNull();
    expect(results[0].reviewCount).toBeNull();
    expect(results[0].primaryCategory).toBeNull();
  });

  it('returns correct SearchResultEntry shape', () => {
    document.body.innerHTML = LISTING_FIXTURE;
    const results = extractSearchResults(document);
    const entry = results[0];
    expect(entry).toHaveProperty('name');
    expect(entry).toHaveProperty('primaryCategory');
    expect(entry).toHaveProperty('rating');
    expect(entry).toHaveProperty('reviewCount');
    expect(entry).toHaveProperty('attributeCount');
  });
});
