import type { SearchResultEntry } from '../extraction/search-extractor';

const HEADERS = ['Name', 'Primary Category', 'Rating', 'Review Count', 'Attribute Count'];

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function entryToRow(entry: SearchResultEntry): string[] {
  return [
    entry.name || '',
    entry.primaryCategory || '',
    entry.rating || '',
    entry.reviewCount || '',
    String(entry.attributeCount),
  ];
}

/** Format search result entries as CSV with header row */
export function formatAsCsv(entries: SearchResultEntry[]): string {
  const lines: string[] = [HEADERS.map(escapeCSV).join(',')];
  for (const entry of entries) {
    lines.push(entryToRow(entry).map(escapeCSV).join(','));
  }
  return lines.join('\n');
}

/** Format as tab-separated values for clipboard (Google Sheets compatible) */
export function formatAsClipboard(entries: SearchResultEntry[]): string {
  const lines: string[] = [HEADERS.join('\t')];
  for (const entry of entries) {
    lines.push(entryToRow(entry).join('\t'));
  }
  return lines.join('\n');
}

/** Trigger CSV file download */
export function downloadCsv(entries: SearchResultEntry[], filename?: string): void {
  const csv = formatAsCsv(entries);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `local-scan-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Copy tab-separated values to clipboard */
export async function copyToClipboard(entries: SearchResultEntry[]): Promise<void> {
  const text = formatAsClipboard(entries);
  await navigator.clipboard.writeText(text);
}
