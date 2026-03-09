import type { SearchResultEntry } from '../extraction/search-extractor';

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

interface ColumnDef {
  key: string;
  label: string;
  getValue: (entry: SearchResultEntry) => string;
}

const COLUMNS: ColumnDef[] = [
  { key: 'name', label: 'Name', getValue: (e) => e.name || '—' },
  { key: 'primaryCategory', label: 'Category', getValue: (e) => e.primaryCategory || '—' },
  { key: 'rating', label: 'Rating', getValue: (e) => e.rating || '—' },
  { key: 'reviewCount', label: 'Reviews', getValue: (e) => e.reviewCount || '—' },
  { key: 'attributeCount', label: 'Attributes', getValue: (e) => String(e.attributeCount) },
];

const TABLE_STYLES = {
  table: 'width:100%;border-collapse:collapse;font-size:12px;font-family:"Google Sans",system-ui,sans-serif',
  th: 'padding:8px 10px;text-align:left;border-bottom:2px solid #e0e0e0;color:#5f6368;cursor:pointer;user-select:none;white-space:nowrap;font-weight:600;font-size:11px',
  td: 'padding:6px 10px;border-bottom:1px solid #f0f0f0;color:#202124',
  trEven: 'background-color:#fafafa',
  empty: 'padding:24px;text-align:center;color:#5f6368;font-size:13px',
};

/**
 * Create a sortable comparison table for search result entries.
 */
export function createComparisonTable(
  entries: SearchResultEntry[],
  onSort: (key: string, direction: 'asc' | 'desc') => void,
  currentSort?: SortState
): HTMLElement {
  const container = document.createElement('div');

  if (entries.length === 0) {
    const msg = document.createElement('div');
    msg.style.cssText = TABLE_STYLES.empty;
    msg.textContent = 'No results found';
    container.appendChild(msg);
    return container;
  }

  const table = document.createElement('table');
  table.style.cssText = TABLE_STYLES.table;

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  for (const col of COLUMNS) {
    const th = document.createElement('th');
    th.style.cssText = TABLE_STYLES.th;
    const isActive = currentSort?.key === col.key;
    const arrow = isActive ? (currentSort.direction === 'desc' ? ' ▼' : ' ▲') : '';
    th.textContent = `${col.label}${arrow}`;
    th.setAttribute('data-sort-key', col.key);

    th.addEventListener('click', () => {
      let dir: 'asc' | 'desc' = 'desc';
      if (currentSort?.key === col.key) {
        dir = currentSort.direction === 'desc' ? 'asc' : 'desc';
      }
      onSort(col.key, dir);
    });

    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  entries.forEach((entry, i) => {
    const row = document.createElement('tr');
    if (i % 2 === 1) row.style.cssText = TABLE_STYLES.trEven;

    for (const col of COLUMNS) {
      const td = document.createElement('td');
      td.style.cssText = TABLE_STYLES.td;
      td.textContent = col.getValue(entry);
      row.appendChild(td);
    }
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  container.appendChild(table);
  return container;
}
