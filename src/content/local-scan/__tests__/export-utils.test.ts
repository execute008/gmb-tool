import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatAsCsv, formatAsClipboard, downloadCsv, copyToClipboard } from '../export-utils';
import type { SearchResultEntry } from '../../extraction/search-extractor';

const SAMPLE_ENTRIES: SearchResultEntry[] = [
  {
    name: "Joe's Pizza",
    primaryCategory: 'Restaurant',
    rating: '4.5',
    reviewCount: '1,234',
    attributeCount: 2,
  },
  {
    name: "Bob's Burgers",
    primaryCategory: 'Burger Restaurant',
    rating: '4.2',
    reviewCount: '567',
    attributeCount: 1,
  },
];

const ENTRY_WITH_NULLS: SearchResultEntry[] = [
  {
    name: 'New Place',
    primaryCategory: null,
    rating: null,
    reviewCount: null,
    attributeCount: 0,
  },
];

const ENTRY_WITH_COMMAS: SearchResultEntry[] = [
  {
    name: 'Pizza, Pasta & More',
    primaryCategory: 'Italian, Mediterranean',
    rating: '4.0',
    reviewCount: '100',
    attributeCount: 0,
  },
];

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
  configurable: true,
});

describe('Export Utilities', () => {
  describe('formatAsCsv', () => {
    it('includes header row', () => {
      const csv = formatAsCsv(SAMPLE_ENTRIES);
      const firstLine = csv.split('\n')[0];
      expect(firstLine).toContain('Name');
      expect(firstLine).toContain('Rating');
      expect(firstLine).toContain('Review Count');
    });

    it('includes one row per entry', () => {
      const csv = formatAsCsv(SAMPLE_ENTRIES);
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(3); // header + 2 entries
    });

    it('handles null fields as empty string', () => {
      const csv = formatAsCsv(ENTRY_WITH_NULLS);
      expect(csv).not.toContain('null');
    });

    it('escapes values containing commas', () => {
      const csv = formatAsCsv(ENTRY_WITH_COMMAS);
      // Values with commas should be quoted
      expect(csv).toContain('"Pizza, Pasta & More"');
    });

    it('returns header-only for empty entries', () => {
      const csv = formatAsCsv([]);
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(1);
      expect(lines[0]).toContain('Name');
    });
  });

  describe('formatAsClipboard', () => {
    it('uses tabs as separator', () => {
      const clip = formatAsClipboard(SAMPLE_ENTRIES);
      const firstLine = clip.split('\n')[0];
      expect(firstLine.split('\t').length).toBeGreaterThan(1);
    });

    it('includes header row', () => {
      const clip = formatAsClipboard(SAMPLE_ENTRIES);
      const firstLine = clip.split('\n')[0];
      expect(firstLine).toContain('Name');
      expect(firstLine).toContain('Rating');
    });

    it('includes one line per entry', () => {
      const clip = formatAsClipboard(SAMPLE_ENTRIES);
      const lines = clip.trim().split('\n');
      expect(lines).toHaveLength(3);
    });

    it('returns header-only for empty entries', () => {
      const clip = formatAsClipboard([]);
      const lines = clip.trim().split('\n');
      expect(lines).toHaveLength(1);
    });
  });

  describe('downloadCsv', () => {
    it('creates and clicks a download link', () => {
      const clickSpy = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValueOnce({
        href: '',
        download: '',
        click: clickSpy,
        style: {},
        setAttribute: vi.fn(),
      } as any);

      const revokeUrl = vi.fn();
      globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
      globalThis.URL.revokeObjectURL = revokeUrl;

      downloadCsv(SAMPLE_ENTRIES);
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('copyToClipboard', () => {
    it('calls navigator.clipboard.writeText', async () => {
      await copyToClipboard(SAMPLE_ENTRIES);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('passes tab-separated content', async () => {
      await copyToClipboard(SAMPLE_ENTRIES);
      const callArg = (navigator.clipboard.writeText as any).mock.calls.at(-1)[0];
      expect(callArg).toContain('\t');
    });
  });
});
