import { extractSearchResults, type SearchResultEntry } from '../extraction/search-extractor';
import { downloadCsv, copyToClipboard } from './export-utils';
import { createScanButton } from './scan-button';
import { createScanPanel } from './scan-panel';
import { PAGE_DETECTION_EVENTS } from '../page-detection/events';
import type { PageState } from '../page-detection/types';
import type { SortState } from './comparison-table';

const BUTTON_ATTR = 'data-gmb-scan-button';
const PANEL_ATTR = 'data-gmb-scan-panel';

function removeElements(selector: string) {
  document.querySelectorAll(`[${selector}]`).forEach((el) => el.remove());
}

function removePanel() {
  removeElements(PANEL_ATTR);
}

function removeButton() {
  removeElements(BUTTON_ATTR);
}

function removeAll() {
  removePanel();
  removeButton();
}

function sortEntries(entries: SearchResultEntry[], sort: SortState): SearchResultEntry[] {
  const sorted = [...entries];
  sorted.sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sort.key) {
      case 'name':
        aVal = a.name || '';
        bVal = b.name || '';
        break;
      case 'primaryCategory':
        aVal = a.primaryCategory || '';
        bVal = b.primaryCategory || '';
        break;
      case 'rating':
        aVal = parseFloat(a.rating || '0') || 0;
        bVal = parseFloat(b.rating || '0') || 0;
        break;
      case 'reviewCount':
        aVal = parseInt((a.reviewCount || '0').replace(/,/g, ''), 10) || 0;
        bVal = parseInt((b.reviewCount || '0').replace(/,/g, ''), 10) || 0;
        break;
      case 'attributeCount':
        aVal = a.attributeCount;
        bVal = b.attributeCount;
        break;
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sort.direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    const cmp = String(aVal).localeCompare(String(bVal));
    return sort.direction === 'desc' ? -cmp : cmp;
  });
  return sorted;
}

/**
 * Initialize local scan system.
 * Listens for search results detection, shows floating scan button,
 * opens comparison panel on click with sorting and export.
 */
export function initLocalScan(): () => void {
  let currentEntries: SearchResultEntry[] = [];
  let currentSort: SortState = { key: 'rating', direction: 'desc' };

  function renderPanel() {
    removePanel();
    const sorted = sortEntries(currentEntries, currentSort);
    const panel = createScanPanel(sorted, {
      onClose: () => removePanel(),
      onDownloadCsv: () => downloadCsv(sorted),
      onCopyClipboard: () => copyToClipboard(sorted),
    }, currentSort, (key, direction) => {
      currentSort = { key, direction };
      renderPanel();
    });
    document.body.appendChild(panel);
  }

  function onSearchResultsDetected() {
    removeAll();
    const btn = createScanButton(() => {
      currentEntries = extractSearchResults(document);
      currentSort = { key: 'rating', direction: 'desc' };
      renderPanel();
    });
    document.body.appendChild(btn);
  }

  function onPageChanged(e: Event) {
    const event = e as CustomEvent<PageState>;
    if (event.detail?.pageType !== 'search-results') {
      removeAll();
    }
  }

  document.addEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, onSearchResultsDetected);
  document.addEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);

  return () => {
    document.removeEventListener(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, onSearchResultsDetected);
    document.removeEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);
    removeAll();
  };
}
