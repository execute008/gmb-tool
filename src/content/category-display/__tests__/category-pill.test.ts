import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCategoryPill } from '../category-pill';

describe('CategoryPill', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns an HTMLElement', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill).toBeInstanceOf(HTMLElement);
  });

  it('displays the category text', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill.textContent).toBe('Restaurant');
  });

  it('primary pill has blue background', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill.style.backgroundColor).toBe('#1a73e8');
  });

  it('secondary pill has gray background', () => {
    const pill = createCategoryPill('Takeout', 'secondary', vi.fn());
    expect(pill.style.backgroundColor).toBe('#e8eaed');
  });

  it('has cursor pointer style', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill.style.cursor).toBe('pointer');
  });

  it('has pill-shaped border radius', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill.style.borderRadius).toBe('12px');
  });

  it('calls onClick callback with category string when clicked', () => {
    const onClick = vi.fn();
    const pill = createCategoryPill('Restaurant', 'primary', onClick);
    pill.click();
    expect(onClick).toHaveBeenCalledWith('Restaurant');
  });

  it('has appropriate font size for inline display', () => {
    const pill = createCategoryPill('Restaurant', 'primary', vi.fn());
    expect(pill.style.fontSize).toBe('12px');
  });
});
