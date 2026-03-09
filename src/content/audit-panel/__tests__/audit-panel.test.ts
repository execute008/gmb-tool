import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAuditPanel } from '../audit-panel';
import type { BusinessProfileData } from '../../extraction/profile-extractor';

const SAMPLE_DATA: BusinessProfileData = {
  name: "Joe's Pizza",
  placeId: 'ChIJ123',
  cid: '12345',
  primaryCategory: 'Restaurant',
  secondaryCategories: ['Takeout'],
  rating: '4.5',
  reviewCount: '1,234 reviews',
  address: '123 Main St',
  phone: '+1 555-0123',
  website: 'https://joespizza.com',
  hours: 'Mon-Sun 11am-10pm',
  attributes: 'Wheelchair accessible',
  reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ123',
  directionsUrl: 'https://www.google.com/maps/dir//Joes+Pizza',
  mapsUrl: 'https://www.google.com/maps/place/Joes+Pizza/',
};

describe('AuditPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns an HTMLElement', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel).toBeInstanceOf(HTMLElement);
  });

  it('has fixed position on the right', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.right).toBe('0px');
  });

  it('has width of 380px', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.style.width).toBe('380px');
  });

  it('has high z-index', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(parseInt(panel.style.zIndex)).toBeGreaterThanOrEqual(10000);
  });

  it('has header with GBP Audit title', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.textContent).toContain('GBP Audit');
  });

  it('has close button that calls onClose', () => {
    const onClose = vi.fn();
    const panel = createAuditPanel(SAMPLE_DATA, { onClose, onCopyText: vi.fn(), onCopyJson: vi.fn() });
    const closeBtn = panel.querySelector('[data-close-panel]') as HTMLElement;
    expect(closeBtn).not.toBeNull();
    closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('has Copy as Text button that calls onCopyText', () => {
    const onCopyText = vi.fn();
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText, onCopyJson: vi.fn() });
    const btn = panel.querySelector('[data-copy-text]') as HTMLElement;
    expect(btn).not.toBeNull();
    btn.click();
    expect(onCopyText).toHaveBeenCalled();
  });

  it('has Copy as JSON button that calls onCopyJson', () => {
    const onCopyJson = vi.fn();
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson });
    const btn = panel.querySelector('[data-copy-json]') as HTMLElement;
    expect(btn).not.toBeNull();
    btn.click();
    expect(onCopyJson).toHaveBeenCalled();
  });

  it('contains all 5 sections', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.textContent).toContain('Basic Info');
    expect(panel.textContent).toContain('Contact');
    expect(panel.textContent).toContain('Reviews');
    expect(panel.textContent).toContain('Attributes');
    expect(panel.textContent).toContain('Links');
  });

  it('displays business data in sections', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.textContent).toContain("Joe's Pizza");
    expect(panel.textContent).toContain('4.5');
    expect(panel.textContent).toContain('123 Main St');
  });

  it('has data-gmb-audit-panel attribute', () => {
    const panel = createAuditPanel(SAMPLE_DATA, { onClose: vi.fn(), onCopyText: vi.fn(), onCopyJson: vi.fn() });
    expect(panel.hasAttribute('data-gmb-audit-panel')).toBe(true);
  });
});
