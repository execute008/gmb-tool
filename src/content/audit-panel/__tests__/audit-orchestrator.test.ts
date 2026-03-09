import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAuditButton, initAuditPanel } from '../index';
import { PAGE_DETECTION_EVENTS } from '../../page-detection/events';
import type { PageState } from '../../page-detection/types';

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
  configurable: true,
});

function fireBusinessProfileDetected(url = 'https://www.google.com/maps/place/TestBiz/') {
  const state: PageState = { url, pageType: 'business-profile', timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, { detail: state }));
}

function firePageChanged(pageType: 'business-profile' | 'search-results' | 'other' = 'other') {
  const state: PageState = { url: 'https://www.google.com/maps/', pageType, timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.PAGE_CHANGED, { detail: state }));
}

describe('createAuditButton', () => {
  it('returns an HTMLElement', () => {
    const btn = createAuditButton(vi.fn());
    expect(btn).toBeInstanceOf(HTMLElement);
  });

  it('has Audit text', () => {
    const btn = createAuditButton(vi.fn());
    expect(btn.textContent).toContain('Audit');
  });

  it('click calls onClick callback', () => {
    const onClick = vi.fn();
    const btn = createAuditButton(onClick);
    btn.click();
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Audit Panel Orchestrator', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (cleanup) cleanup();
    cleanup = undefined;
    document.body.innerHTML = '';
  });

  it('initAuditPanel returns cleanup function', () => {
    cleanup = initAuditPanel();
    expect(typeof cleanup).toBe('function');
  });

  it('injects audit button when business profile detected', () => {
    document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
    cleanup = initAuditPanel();
    fireBusinessProfileDetected();

    const btn = document.querySelector('[data-gmb-audit-button]');
    expect(btn).not.toBeNull();
  });

  it('clicking audit button opens the panel', () => {
    document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
    cleanup = initAuditPanel();
    fireBusinessProfileDetected();

    const btn = document.querySelector('[data-gmb-audit-button]') as HTMLElement;
    btn.click();

    const panel = document.querySelector('[data-gmb-audit-panel]');
    expect(panel).not.toBeNull();
  });

  it('clicking close removes panel but keeps button', () => {
    document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
    cleanup = initAuditPanel();
    fireBusinessProfileDetected();

    const btn = document.querySelector('[data-gmb-audit-button]') as HTMLElement;
    btn.click();

    const closeBtn = document.querySelector('[data-close-panel]') as HTMLElement;
    closeBtn.click();

    expect(document.querySelector('[data-gmb-audit-panel]')).toBeNull();
    expect(document.querySelector('[data-gmb-audit-button]')).not.toBeNull();
  });

  it('removes button and panel on navigation away', () => {
    document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
    cleanup = initAuditPanel();
    fireBusinessProfileDetected();

    expect(document.querySelector('[data-gmb-audit-button]')).not.toBeNull();

    firePageChanged('other');

    expect(document.querySelector('[data-gmb-audit-button]')).toBeNull();
    expect(document.querySelector('[data-gmb-audit-panel]')).toBeNull();
  });

  it('does not error when no categories/fields found', () => {
    document.body.innerHTML = '<div>Empty page</div>';
    cleanup = initAuditPanel();
    expect(() => fireBusinessProfileDetected()).not.toThrow();
  });

  it('cleanup removes all injected elements', () => {
    document.body.innerHTML = '<h1 class="fontHeadlineLarge">Test Business</h1>';
    cleanup = initAuditPanel();
    fireBusinessProfileDetected();

    cleanup();
    cleanup = undefined;

    expect(document.querySelector('[data-gmb-audit-button]')).toBeNull();
  });
});
