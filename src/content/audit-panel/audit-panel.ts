import type { BusinessProfileData } from '../extraction/profile-extractor';
import { createAuditSection } from './audit-section';
import { formatSectionAsText, type AuditSectionName } from '../extraction/audit-formatter';

interface PanelCallbacks {
  onClose: () => void;
  onCopyText: () => void;
  onCopyJson: () => void;
}

interface SectionConfig {
  title: string;
  name: AuditSectionName;
  fields: { label: string; key: keyof BusinessProfileData }[];
}

const SECTIONS: SectionConfig[] = [
  {
    title: 'Basic Info',
    name: 'basicInfo',
    fields: [
      { label: 'Name', key: 'name' },
      { label: 'Place ID', key: 'placeId' },
      { label: 'CID', key: 'cid' },
      { label: 'Category', key: 'primaryCategory' },
      { label: 'Other Categories', key: 'secondaryCategories' },
    ],
  },
  {
    title: 'Contact',
    name: 'contact',
    fields: [
      { label: 'Address', key: 'address' },
      { label: 'Phone', key: 'phone' },
      { label: 'Website', key: 'website' },
    ],
  },
  {
    title: 'Reviews',
    name: 'reviews',
    fields: [
      { label: 'Rating', key: 'rating' },
      { label: 'Reviews', key: 'reviewCount' },
      { label: 'Review URL', key: 'reviewUrl' },
    ],
  },
  {
    title: 'Attributes',
    name: 'attributes',
    fields: [
      { label: 'Hours', key: 'hours' },
      { label: 'Attributes', key: 'attributes' },
    ],
  },
  {
    title: 'Links',
    name: 'links',
    fields: [
      { label: 'Directions', key: 'directionsUrl' },
      { label: 'Maps URL', key: 'mapsUrl' },
      { label: 'Website', key: 'website' },
    ],
  },
];

function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : null;
  return String(value);
}

function createButton(text: string, attr: string, onClick: () => void): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute(attr, '');
  btn.textContent = text;
  Object.assign(btn.style, {
    padding: '4px 10px',
    fontSize: '11px',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginLeft: '4px',
    color: '#1a73e8',
  });
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Create the slide-in audit panel with all sections and controls.
 */
export function createAuditPanel(data: BusinessProfileData, callbacks: PanelCallbacks): HTMLElement {
  const panel = document.createElement('div');
  panel.setAttribute('data-gmb-audit-panel', '');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '380px',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
    zIndex: '10000',
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

  const title = document.createElement('span');
  title.textContent = 'GBP Audit';
  Object.assign(title.style, {
    fontWeight: '700',
    fontSize: '16px',
    color: '#202124',
  });

  const controls = document.createElement('div');
  controls.appendChild(createButton('📄 Text', 'data-copy-text', callbacks.onCopyText));
  controls.appendChild(createButton('{ } JSON', 'data-copy-json', callbacks.onCopyJson));

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('data-close-panel', '');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    border: 'none',
    background: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    marginLeft: '8px',
    color: '#5f6368',
    padding: '4px',
  });
  closeBtn.addEventListener('click', callbacks.onClose);
  controls.appendChild(closeBtn);

  header.appendChild(title);
  header.appendChild(controls);

  // Content area (scrollable)
  const content = document.createElement('div');
  Object.assign(content.style, {
    flex: '1',
    overflowY: 'auto',
    padding: '8px',
  });

  for (const section of SECTIONS) {
    const fields = section.fields.map(({ label, key }) => ({
      label,
      value: formatFieldValue(data[key]),
    }));

    const sectionEl = createAuditSection(section.title, fields, () => {
      const text = formatSectionAsText(data, section.name);
      navigator.clipboard?.writeText(text);
    });
    content.appendChild(sectionEl);
  }

  panel.appendChild(header);
  panel.appendChild(content);
  return panel;
}
