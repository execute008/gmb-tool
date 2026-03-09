import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAuditSection } from '../audit-section';

const SAMPLE_FIELDS = [
  { label: 'Name', value: "Joe's Pizza" },
  { label: 'Rating', value: '4.5' },
  { label: 'Address', value: null },
];

describe('AuditSection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns an HTMLElement', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    expect(section).toBeInstanceOf(HTMLElement);
  });

  it('has a header with title text', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    expect(section.textContent).toContain('Basic Info');
  });

  it('displays field rows with label and value', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    expect(section.textContent).toContain("Joe's Pizza");
    expect(section.textContent).toContain('4.5');
  });

  it('does not render null/empty fields', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    expect(section.textContent).not.toContain('Address');
  });

  it('starts expanded by default', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    const content = section.querySelector('[data-section-content]');
    expect(content).not.toBeNull();
    expect((content as HTMLElement).style.display).not.toBe('none');
  });

  it('clicking header toggles content visibility', () => {
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, vi.fn());
    const header = section.querySelector('[data-section-header]') as HTMLElement;
    const content = section.querySelector('[data-section-content]') as HTMLElement;

    header.click();
    expect(content.style.display).toBe('none');

    header.click();
    expect(content.style.display).not.toBe('none');
  });

  it('copy button calls onCopySection callback', () => {
    const onCopy = vi.fn();
    const section = createAuditSection('Basic Info', SAMPLE_FIELDS, onCopy);
    const copyBtn = section.querySelector('[data-copy-section]') as HTMLElement;

    copyBtn.click();
    expect(onCopy).toHaveBeenCalled();
  });
});
