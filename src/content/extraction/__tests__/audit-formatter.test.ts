import { describe, it, expect } from 'vitest';
import { formatAsText, formatAsJson, formatSectionAsText } from '../audit-formatter';
import type { BusinessProfileData } from '../profile-extractor';

const SAMPLE_DATA: BusinessProfileData = {
  name: "Joe's Pizza",
  placeId: 'ChIJ123',
  cid: '12345',
  primaryCategory: 'Restaurant',
  secondaryCategories: ['Takeout', 'Delivery'],
  rating: '4.5',
  reviewCount: '1,234 reviews',
  address: '123 Main St, New York, NY',
  phone: '+1 555-0123',
  website: 'https://joespizza.com',
  hours: 'Mon-Sun 11am-10pm',
  attributes: 'Wheelchair accessible',
  reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ123',
  directionsUrl: 'https://www.google.com/maps/dir//Joe%27s+Pizza',
  mapsUrl: 'https://www.google.com/maps/place/Joes+Pizza/',
};

const SPARSE_DATA: BusinessProfileData = {
  name: "Joe's Pizza",
  placeId: null,
  cid: null,
  primaryCategory: 'Restaurant',
  secondaryCategories: [],
  rating: null,
  reviewCount: null,
  address: null,
  phone: null,
  website: null,
  hours: null,
  attributes: null,
  reviewUrl: null,
  directionsUrl: null,
  mapsUrl: 'https://www.google.com/maps/place/Joes+Pizza/',
};

describe('Audit Formatter', () => {
  describe('formatAsText', () => {
    it('returns multi-line string with labels', () => {
      const text = formatAsText(SAMPLE_DATA);
      expect(text).toContain("Name: Joe's Pizza");
      expect(text).toContain('Rating: 4.5');
      expect(text).toContain('Reviews: 1,234 reviews');
      expect(text).toContain('Address: 123 Main St, New York, NY');
    });

    it('omits null fields', () => {
      const text = formatAsText(SPARSE_DATA);
      expect(text).not.toContain('Place ID:');
      expect(text).not.toContain('Rating:');
      expect(text).not.toContain('null');
    });

    it('includes categories', () => {
      const text = formatAsText(SAMPLE_DATA);
      expect(text).toContain('Category: Restaurant');
      expect(text).toContain('Takeout');
    });
  });

  describe('formatAsJson', () => {
    it('returns valid JSON string', () => {
      const json = formatAsJson(SAMPLE_DATA);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('is pretty-printed with 2-space indent', () => {
      const json = formatAsJson(SAMPLE_DATA);
      expect(json).toBe(JSON.stringify(SAMPLE_DATA, null, 2));
    });
  });

  describe('formatSectionAsText', () => {
    it('formats basicInfo section', () => {
      const text = formatSectionAsText(SAMPLE_DATA, 'basicInfo');
      expect(text).toContain("Name: Joe's Pizza");
      expect(text).toContain('Place ID: ChIJ123');
      expect(text).not.toContain('Address:');
    });

    it('formats contact section', () => {
      const text = formatSectionAsText(SAMPLE_DATA, 'contact');
      expect(text).toContain('Address: 123 Main St');
      expect(text).toContain('Phone: +1 555-0123');
      expect(text).not.toContain('Rating:');
    });

    it('formats reviews section', () => {
      const text = formatSectionAsText(SAMPLE_DATA, 'reviews');
      expect(text).toContain('Rating: 4.5');
      expect(text).toContain('Reviews: 1,234 reviews');
    });

    it('formats links section', () => {
      const text = formatSectionAsText(SAMPLE_DATA, 'links');
      expect(text).toContain('Directions:');
      expect(text).toContain('Maps URL:');
    });

    it('omits null fields in sections', () => {
      const text = formatSectionAsText(SPARSE_DATA, 'contact');
      expect(text).not.toContain('null');
      expect(text).not.toContain('Address:');
    });
  });
});
