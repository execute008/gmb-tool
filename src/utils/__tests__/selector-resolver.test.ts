import { describe, it, expect, beforeEach } from 'vitest';
import { resolveSelector, resolveAllSelectors } from '../selector-resolver';
import { selectors } from '../../config/selectors';

describe('Selector Resolver', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('resolveSelector', () => {
    it('returns element when first selector matches', () => {
      document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
      const el = resolveSelector(selectors, 'businessProfile', 'name', document);
      expect(el).not.toBeNull();
      expect(el!.textContent).toBe('Test Business');
    });

    it('tries fallback selector when first does not match', () => {
      document.body.innerHTML = '<h1>Fallback Business</h1>';
      const el = resolveSelector(selectors, 'businessProfile', 'name', document);
      expect(el).not.toBeNull();
      expect(el!.textContent).toBe('Fallback Business');
    });

    it('returns null when no selectors match', () => {
      document.body.innerHTML = '<div>No heading here</div>';
      const el = resolveSelector(selectors, 'businessProfile', 'name', document);
      expect(el).toBeNull();
    });

    it('returns null for unknown field without throwing', () => {
      const el = resolveSelector(selectors, 'businessProfile', 'nonExistentField', document);
      expect(el).toBeNull();
    });
  });

  describe('resolveAllSelectors', () => {
    it('returns all matching elements from first matching selector', () => {
      document.body.innerHTML = `
        <span class="fontHeadlineSmall">Biz 1</span>
        <span class="fontHeadlineSmall">Biz 2</span>
        <span class="fontHeadlineSmall">Biz 3</span>
      `;
      const els = resolveAllSelectors(selectors, 'searchResults', 'listingName', document);
      expect(els.length).toBe(3);
    });

    it('returns empty array when no selectors match', () => {
      document.body.innerHTML = '<div>Nothing</div>';
      const els = resolveAllSelectors(selectors, 'searchResults', 'listingName', document);
      expect(els.length).toBe(0);
    });
  });
});
