import { describe, it, expect, beforeEach } from 'vitest';
import { extractCategories, type CategoryData } from '../category-extractor';

describe('Category Extractor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns primary and secondary categories when both found', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
      <div class="fontBodyMedium">
        <a href="/maps/search/Takeout">Takeout Restaurant</a>
        <a href="/maps/search/Delivery">Delivery Restaurant</a>
      </div>
    `;
    const result = extractCategories(document);
    expect(result.primary).toBe('Restaurant');
    expect(result.secondary.length).toBeGreaterThan(0);
  });

  it('returns primary with empty secondary when only primary found', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Coffee Shop</button>
    `;
    const result = extractCategories(document);
    expect(result.primary).toBe('Coffee Shop');
    expect(result.secondary).toEqual([]);
  });

  it('returns null primary and empty secondary when nothing found', () => {
    document.body.innerHTML = '<div>No categories here</div>';
    const result = extractCategories(document);
    expect(result.primary).toBeNull();
    expect(result.secondary).toEqual([]);
  });

  it('trims whitespace from category text', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">  Restaurant  </button>
    `;
    const result = extractCategories(document);
    expect(result.primary).toBe('Restaurant');
  });

  it('excludes primary category from secondary list', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
      <div class="fontBodyMedium">
        <a href="/maps/search/Restaurant">Restaurant</a>
        <a href="/maps/search/Takeout">Takeout</a>
      </div>
    `;
    const result = extractCategories(document);
    expect(result.primary).toBe('Restaurant');
    expect(result.secondary).not.toContain('Restaurant');
    expect(result.secondary).toContain('Takeout');
  });

  it('trims whitespace from secondary category text', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
      <div class="fontBodyMedium">
        <a href="/maps/search/Takeout">  Takeout  </a>
      </div>
    `;
    const result = extractCategories(document);
    expect(result.secondary[0]).toBe('Takeout');
  });

  it('returns correct CategoryData type shape', () => {
    const result = extractCategories(document);
    expect(result).toHaveProperty('primary');
    expect(result).toHaveProperty('secondary');
    expect(Array.isArray(result.secondary)).toBe(true);
  });
});
