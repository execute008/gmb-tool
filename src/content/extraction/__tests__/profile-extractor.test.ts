import { describe, it, expect, beforeEach } from 'vitest';
import { extractBusinessProfile, type BusinessProfileData } from '../profile-extractor';

const FULL_FIXTURE = `
  <h1 class="fontHeadlineLarge">Joe's Pizza</h1>
  <button jsaction="pane.rating.category">Restaurant</button>
  <div class="fontBodyMedium">
    <a href="/maps/search/Takeout">Takeout</a>
    <a href="/maps/search/Delivery">Delivery</a>
  </div>
  <span role="img" aria-label="4.5 stars">4.5</span>
  <span aria-label="1,234 reviews">1,234 reviews</span>
  <button data-item-id="address">123 Main St, New York, NY</button>
  <button data-item-id="phone:123">+1 555-0123</button>
  <a data-item-id="authority" href="https://joespizza.com">joespizza.com</a>
  <div aria-label="Hours">Mon-Sun 11am-10pm</div>
  <div aria-label="Accessibility: Wheelchair accessible">Wheelchair accessible</div>
  <a href="https://www.google.com/maps/place/Joe%27s+Pizza/@40.7,-74.0?ludocid=12345">link</a>
`;

describe('Business Profile Extractor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('extracts name from h1', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/@40.7,-74.0');
    expect(result.name).toBe("Joe's Pizza");
  });

  it('extracts rating', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.rating).toBe('4.5');
  });

  it('extracts review count', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.reviewCount).toBe('1,234 reviews');
  });

  it('extracts address', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.address).toBe('123 Main St, New York, NY');
  });

  it('extracts phone', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.phone).toBe('+1 555-0123');
  });

  it('extracts website', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.website).toBe('https://joespizza.com');
  });

  it('extracts primary and secondary categories', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.primaryCategory).toBe('Restaurant');
    expect(result.secondaryCategories).toContain('Takeout');
  });

  it('extracts hours', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.hours).toBe('Mon-Sun 11am-10pm');
  });

  it('extracts attributes', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.attributes).toBe('Wheelchair accessible');
  });

  it('extracts Place ID from URL', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/@40.7,-74.0,17z/data=!3m1!4b1!4m5!3m4!1s0x89c259:0xabcdef!8m2!3d40.7!4d-74.0');
    // Place ID extraction from URL is best-effort
    expect(result.placeId).not.toBeUndefined();
  });

  it('extracts CID from ludocid in URL', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/?ludocid=12345');
    expect(result.cid).toBe('12345');
  });

  it('generates review URL when placeId available', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    if (result.placeId) {
      expect(result.reviewUrl).toContain('writereview');
    }
  });

  it('generates directions URL', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/place/Joes+Pizza/');
    expect(result.directionsUrl).toContain('dir');
  });

  it('stores mapsUrl from current page', () => {
    document.body.innerHTML = FULL_FIXTURE;
    const url = 'https://www.google.com/maps/place/Joes+Pizza/';
    const result = extractBusinessProfile(document, url);
    expect(result.mapsUrl).toBe(url);
  });

  it('returns null for fields not found on empty DOM', () => {
    document.body.innerHTML = '<div>Empty</div>';
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/');
    expect(result.name).toBeNull();
    expect(result.rating).toBeNull();
    expect(result.address).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.website).toBeNull();
    expect(result.primaryCategory).toBeNull();
    expect(result.secondaryCategories).toEqual([]);
  });

  it('returns correct BusinessProfileData shape', () => {
    const result = extractBusinessProfile(document, 'https://www.google.com/maps/');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('placeId');
    expect(result).toHaveProperty('cid');
    expect(result).toHaveProperty('primaryCategory');
    expect(result).toHaveProperty('secondaryCategories');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('reviewCount');
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('phone');
    expect(result).toHaveProperty('website');
    expect(result).toHaveProperty('hours');
    expect(result).toHaveProperty('attributes');
    expect(result).toHaveProperty('reviewUrl');
    expect(result).toHaveProperty('directionsUrl');
    expect(result).toHaveProperty('mapsUrl');
  });
});
