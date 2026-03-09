import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createScanButton } from '../scan-button';
import { createScanPanel } from '../scan-panel';
import { initLocalScan } from '../index';
import { PAGE_DETECTION_EVENTS } from '../../page-detection/events';
import type { PageState } from '../../page-detection/types';
import type { SearchResultEntry } from '../../extraction/search-extractor';

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
  configurable: true,
});

const SAMPLE_ENTRIES: SearchResultEntry[] = [
  { name: "Joe's Pizza", primaryCategory: 'Restaurant', rating: '4.5', reviewCount: '1,234', attributeCount: 2 },
];

function fireSearchResultsDetected() {
  const state: PageState = { url: 'https://www.google.com/maps/search/pizza/', pageType: 'search-results', timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.SEARCH_RESULTS_DETECTED, { detail: state }));
}

function firePageChanged(pageType: 'business-profile' | 'search-results' | 'other' = 'other') {
  const state: PageState = { url: 'https://www.google.com/maps/', pageType, timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.PAGE_CHANGED, { detail: state }));
}

describe('createScanButton', () => {
  it('returns an HTMLElement', () => {
    const btn = createScanButton(vi.fn());
    expect(btn).toBeInstanceOf(HTMLElement);
  });

  it('has Scan text', () => {
    const btn = createScanButton(vi.fn());
    expect(btn.textContent).toContain('Scan');
  });

  it('has data-gmb-scan-button attribute', () => {
    const btn = createScanButton(vi.fn());
    expect(btn.hasAttribute('data-gmb-scan-button')).toBe(true);
  });

  it('has fixed positioning', () => {
    const btn = createScanButton(vi.fn());
    expect(btn.style.position).toBe('fixed');
  });

  it('click calls onClick callback', () => {
    const onClick = vi.fn();
    const btn = createScanButton(onClick);
    btn.click();
    expect(onClick).toHaveBeenCalled();
  });
});

describe('createScanPanel', () => {
  it('returns an HTMLElement', () => {
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv: vi.fn(), onCopyClipboard: vi.fn() });
    expect(panel).toBeInstanceOf(HTMLElement);
  });

  it('has data-gmb-scan-panel attribute', () => {
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv: vi.fn(), onCopyClipboard: vi.fn() });
    expect(panel.hasAttribute('data-gmb-scan-panel')).toBe(true);
  });

  it('has Local Scan title', () => {
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv: vi.fn(), onCopyClipboard: vi.fn() });
    expect(panel.textContent).toContain('Local Scan');
  });

  it('has close button that calls onClose', () => {
    const onClose = vi.fn();
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose, onDownloadCsv: vi.fn(), onCopyClipboard: vi.fn() });
    const closeBtn = panel.querySelector('[data-close-scan]') as HTMLElement;
    closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('has Download CSV button', () => {
    const onDownloadCsv = vi.fn();
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv, onCopyClipboard: vi.fn() });
    const btn = panel.querySelector('[data-download-csv]') as HTMLElement;
    btn.click();
    expect(onDownloadCsv).toHaveBeenCalled();
  });

  it('has Copy button', () => {
    const onCopyClipboard = vi.fn();
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv: vi.fn(), onCopyClipboard });
    const btn = panel.querySelector('[data-copy-clipboard]') as HTMLElement;
    btn.click();
    expect(onCopyClipboard).toHaveBeenCalled();
  });

  it('contains the comparison table', () => {
    const panel = createScanPanel(SAMPLE_ENTRIES, { onClose: vi.fn(), onDownloadCsv: vi.fn(), onCopyClipboard: vi.fn() });
    expect(panel.querySelector('table')).not.toBeNull();
  });
});

describe('Local Scan Orchestrator', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (cleanup) cleanup();
    cleanup = undefined;
    document.body.innerHTML = '';
  });

  it('initLocalScan returns cleanup function', () => {
    cleanup = initLocalScan();
    expect(typeof cleanup).toBe('function');
  });

  it('injects scan button when search results detected', () => {
    // Add search result DOM
    document.body.innerHTML = '<div role="feed"><div class="Nv2PK"><a class="hfpxzc"><span class="fontHeadlineSmall">Test</span></a></div></div>';
    cleanup = initLocalScan();
    fireSearchResultsDetected();
    expect(document.querySelector('[data-gmb-scan-button]')).not.toBeNull();
  });

  it('clicking scan button opens the panel', () => {
    document.body.innerHTML = '<div role="feed"><div class="Nv2PK"><a class="hfpxzc"><span class="fontHeadlineSmall">Test</span></a></div></div>';
    cleanup = initLocalScan();
    fireSearchResultsDetected();
    const btn = document.querySelector('[data-gmb-scan-button]') as HTMLElement;
    btn.click();
    expect(document.querySelector('[data-gmb-scan-panel]')).not.toBeNull();
  });

  it('close removes panel but keeps button', () => {
    document.body.innerHTML = '<div role="feed"><div class="Nv2PK"><a class="hfpxzc"><span class="fontHeadlineSmall">Test</span></a></div></div>';
    cleanup = initLocalScan();
    fireSearchResultsDetected();
    (document.querySelector('[data-gmb-scan-button]') as HTMLElement).click();
    (document.querySelector('[data-close-scan]') as HTMLElement).click();
    expect(document.querySelector('[data-gmb-scan-panel]')).toBeNull();
    expect(document.querySelector('[data-gmb-scan-button]')).not.toBeNull();
  });

  it('navigation away removes button and panel', () => {
    document.body.innerHTML = '<div role="feed"><div class="Nv2PK"><a class="hfpxzc"><span class="fontHeadlineSmall">Test</span></a></div></div>';
    cleanup = initLocalScan();
    fireSearchResultsDetected();
    firePageChanged('other');
    expect(document.querySelector('[data-gmb-scan-button]')).toBeNull();
    expect(document.querySelector('[data-gmb-scan-panel]')).toBeNull();
  });

  it('cleanup removes all injected elements', () => {
    document.body.innerHTML = '<div role="feed"><div class="Nv2PK"><a class="hfpxzc"><span class="fontHeadlineSmall">Test</span></a></div></div>';
    cleanup = initLocalScan();
    fireSearchResultsDetected();
    cleanup();
    cleanup = undefined;
    expect(document.querySelector('[data-gmb-scan-button]')).toBeNull();
  });
});
