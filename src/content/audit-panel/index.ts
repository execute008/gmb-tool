import { extractBusinessProfile } from '../extraction/profile-extractor';
import { formatAsText, formatAsJson } from '../extraction/audit-formatter';
import { createAuditPanel } from './audit-panel';
import { PAGE_DETECTION_EVENTS } from '../page-detection/events';
import type { PageState } from '../page-detection/types';

const BUTTON_ATTR = 'data-gmb-audit-button';
const PANEL_ATTR = 'data-gmb-audit-panel';

/**
 * Create the audit trigger button.
 */
export function createAuditButton(onClick: () => void): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute(BUTTON_ATTR, '');
  btn.textContent = '🔍 Audit';
  Object.assign(btn.style, {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #dadce0',
    borderRadius: '16px',
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    cursor: 'pointer',
    marginLeft: '8px',
    fontFamily: '"Google Sans", system-ui, sans-serif',
    verticalAlign: 'middle',
  });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return btn;
}

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

/**
 * Initialize audit panel system.
 * Listens for business profile detection, injects audit button,
 * opens panel on click with full GBP data extraction.
 */
export function initAuditPanel(): () => void {
  let currentUrl = '';

  function onBusinessProfileDetected(e: Event) {
    const event = e as CustomEvent<PageState>;
    currentUrl = event.detail?.url || window.location.href;

    // Remove old button, inject new
    removeAll();

    const btn = createAuditButton(() => openPanel());

    // Find injection point near business name
    const nameEl = document.querySelector('h1.fontHeadlineLarge')
      || document.querySelector('h1[data-attrid="title"]')
      || document.querySelector('h1');

    if (nameEl?.parentElement) {
      nameEl.parentElement.appendChild(btn);
    } else {
      document.body.appendChild(btn);
    }
  }

  function openPanel() {
    removePanel();

    const data = extractBusinessProfile(document, currentUrl);
    const panel = createAuditPanel(data, {
      onClose: () => removePanel(),
      onCopyText: () => {
        const text = formatAsText(data);
        navigator.clipboard?.writeText(text);
      },
      onCopyJson: () => {
        const json = formatAsJson(data);
        navigator.clipboard?.writeText(json);
      },
    });

    document.body.appendChild(panel);
  }

  function onPageChanged(e: Event) {
    const event = e as CustomEvent<PageState>;
    if (event.detail?.pageType !== 'business-profile') {
      removeAll();
    }
  }

  document.addEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, onBusinessProfileDetected);
  document.addEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);

  return () => {
    document.removeEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, onBusinessProfileDetected);
    document.removeEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);
    removeAll();
  };
}
