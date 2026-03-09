import type { SearchResultEntry } from '../extraction/search-extractor';
import { createComparisonTable, type SortState } from './comparison-table';

interface ScanPanelCallbacks {
  onClose: () => void;
  onDownloadCsv: () => void;
  onCopyClipboard: () => void;
}

function createHeaderButton(text: string, attr: string, onClick: () => void): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute(attr, '');
  btn.textContent = text;
  Object.assign(btn.style, {
    padding: '4px 12px',
    fontSize: '11px',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginLeft: '6px',
    color: '#1a73e8',
    fontFamily: '"Google Sans", system-ui, sans-serif',
  });
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Create the scan panel overlay with comparison table and export controls.
 */
export function createScanPanel(
  entries: SearchResultEntry[],
  callbacks: ScanPanelCallbacks,
  sortState?: SortState,
  onSort?: (key: string, direction: 'asc' | 'desc') => void
): HTMLElement {
  const panel = document.createElement('div');
  panel.setAttribute('data-gmb-scan-panel', '');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '90vw',
    maxWidth: '1200px',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '-2px 0 12px rgba(0,0,0,0.15)',
    zIndex: '10001',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Google Sans", system-ui, sans-serif',
  });

  // Header
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
    flexShrink: '0',
  });

  const titleArea = document.createElement('div');
  const title = document.createElement('span');
  title.textContent = `Local Scan (${entries.length} results)`;
  Object.assign(title.style, { fontWeight: '700', fontSize: '16px', color: '#202124' });
  titleArea.appendChild(title);

  const controls = document.createElement('div');
  controls.appendChild(createHeaderButton('⬇ CSV', 'data-download-csv', callbacks.onDownloadCsv));
  controls.appendChild(createHeaderButton('📋 Copy', 'data-copy-clipboard', callbacks.onCopyClipboard));

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('data-close-scan', '');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    border: 'none',
    background: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    marginLeft: '10px',
    color: '#5f6368',
    padding: '4px',
  });
  closeBtn.addEventListener('click', callbacks.onClose);
  controls.appendChild(closeBtn);

  header.appendChild(titleArea);
  header.appendChild(controls);

  // Content (scrollable)
  const content = document.createElement('div');
  Object.assign(content.style, {
    flex: '1',
    overflowY: 'auto',
    padding: '12px 16px',
  });

  const table = createComparisonTable(
    entries,
    onSort || (() => {}),
    sortState || { key: 'rating', direction: 'desc' }
  );
  content.appendChild(table);

  panel.appendChild(header);
  panel.appendChild(content);
  return panel;
}
