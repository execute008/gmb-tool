import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComparisonTable } from '../comparison-table';
import type { SearchResultEntry } from '../../extraction/search-extractor';

const SAMPLE_ENTRIES: SearchResultEntry[] = [
  { name: "Joe's Pizza", primaryCategory: 'Restaurant', rating: '4.5', reviewCount: '1,234', attributeCount: 2 },
  { name: "Bob's Burgers", primaryCategory: 'Burger Restaurant', rating: '4.2', reviewCount: '567', attributeCount: 1 },
];

describe('ComparisonTable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns an HTMLElement', () => {
    const table = createComparisonTable(SAMPLE_ENTRIES, vi.fn());
    expect(table).toBeInstanceOf(HTMLElement);
  });

  it('has column headers', () => {
    const table = createComparisonTable(SAMPLE_ENTRIES, vi.fn());
    const headers = table.querySelectorAll('th');
    const headerTexts = Array.from(headers).map((h) => h.textContent?.replace(/[▲▼]/g, '').trim());
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Category');
    expect(headerTexts).toContain('Rating');
    expect(headerTexts).toContain('Reviews');
    expect(headerTexts).toContain('Attributes');
  });

  it('renders one row per entry', () => {
    const table = createComparisonTable(SAMPLE_ENTRIES, vi.fn());
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('shows entry data in cells', () => {
    const table = createComparisonTable(SAMPLE_ENTRIES, vi.fn());
    expect(table.textContent).toContain("Joe's Pizza");
    expect(table.textContent).toContain('4.5');
    expect(table.textContent).toContain('1,234');
  });

  it('shows default sort indicator on Rating column', () => {
    const table = createComparisonTable(SAMPLE_ENTRIES, vi.fn(), { key: 'rating', direction: 'desc' });
    const headers = table.querySelectorAll('th');
    const ratingHeader = Array.from(headers).find((h) => h.textContent?.includes('Rating'));
    expect(ratingHeader?.textContent).toContain('▼');
  });

  it('clicking header calls onSort', () => {
    const onSort = vi.fn();
    const table = createComparisonTable(SAMPLE_ENTRIES, onSort);
    const headers = table.querySelectorAll('th');
    const nameHeader = Array.from(headers).find((h) => h.textContent?.includes('Name'));
    (nameHeader as HTMLElement).click();
    expect(onSort).toHaveBeenCalledWith('name', expect.any(String));
  });

  it('shows dash for null values', () => {
    const entries: SearchResultEntry[] = [
      { name: 'Test', primaryCategory: null, rating: null, reviewCount: null, attributeCount: 0 },
    ];
    const table = createComparisonTable(entries, vi.fn());
    expect(table.textContent).toContain('—');
  });

  it('shows message for empty entries', () => {
    const table = createComparisonTable([], vi.fn());
    expect(table.textContent).toContain('No results found');
  });
});
