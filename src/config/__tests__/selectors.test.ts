import { describe, it, expect } from 'vitest';
import { selectors } from '../selectors';

describe('Selector Config', () => {
  describe('businessProfile selectors', () => {
    it('has all required fields', () => {
      const fields = ['name', 'primaryCategory', 'secondaryCategories', 'rating', 'reviewCount', 'address', 'phone', 'website', 'hours', 'attributes', 'placeId'];
      for (const field of fields) {
        expect(selectors.businessProfile).toHaveProperty(field);
      }
    });

    it('each field has a non-empty array of selector strings', () => {
      for (const [field, selectorList] of Object.entries(selectors.businessProfile)) {
        expect(Array.isArray(selectorList), `${field} should be an array`).toBe(true);
        expect(selectorList.length, `${field} should not be empty`).toBeGreaterThan(0);
        for (const s of selectorList) {
          expect(typeof s, `${field} selectors should be strings`).toBe('string');
        }
      }
    });

    it('all selectors are valid CSS selectors', () => {
      for (const [field, selectorList] of Object.entries(selectors.businessProfile)) {
        for (const s of selectorList) {
          expect(() => document.querySelector(s)).not.toThrow();
        }
      }
    });
  });

  describe('searchResults selectors', () => {
    it('has all required fields', () => {
      const fields = ['listingName', 'listingRating', 'listingReviewCount', 'listingCategory'];
      for (const field of fields) {
        expect(selectors.searchResults).toHaveProperty(field);
      }
    });

    it('each field has a non-empty array of selector strings', () => {
      for (const [field, selectorList] of Object.entries(selectors.searchResults)) {
        expect(Array.isArray(selectorList)).toBe(true);
        expect(selectorList.length).toBeGreaterThan(0);
      }
    });

    it('all selectors are valid CSS selectors', () => {
      for (const [field, selectorList] of Object.entries(selectors.searchResults)) {
        for (const s of selectorList) {
          expect(() => document.querySelector(s)).not.toThrow();
        }
      }
    });
  });
});
