import { extractCategories } from '../extraction/category-extractor';
import { createCategoryPill } from './category-pill';
import { PAGE_DETECTION_EVENTS } from '../page-detection/events';

const CONTAINER_ATTR = 'data-gmb-categories';

function removeExistingBadges() {
  const existing = document.querySelectorAll(`[${CONTAINER_ATTR}]`);
  existing.forEach((el) => el.remove());
}

function navigateToCategory(category: string) {
  const encoded = encodeURIComponent(category);
  window.location.href = `/maps/search/${encoded}+near+me/`;
}

function injectBadges() {
  removeExistingBadges();

  const { primary, secondary } = extractCategories(document);

  if (!primary && secondary.length === 0) return;

  const container = document.createElement('span');
  container.setAttribute(CONTAINER_ATTR, '');
  container.style.display = 'inline';
  container.style.verticalAlign = 'middle';

  if (primary) {
    container.appendChild(createCategoryPill(primary, 'primary', navigateToCategory));
  }

  for (const cat of secondary) {
    container.appendChild(createCategoryPill(cat, 'secondary', navigateToCategory));
  }

  // Find insertion point — after existing category elements or append to body
  const categoryEl = document.querySelector('button[jsaction*="category"]')
    || document.querySelector('.fontBodyMedium a[href*="/search/"]');

  if (categoryEl?.parentElement) {
    categoryEl.parentElement.appendChild(container);
  } else {
    document.body.appendChild(container);
  }
}

function onPageChanged(e: Event) {
  const event = e as CustomEvent;
  if (event.detail?.pageType !== 'business-profile') {
    removeExistingBadges();
  }
}

/**
 * Initialize category badge display.
 * Listens for BusinessProfileDetected events and injects category pills.
 * Returns a cleanup function.
 */
export function initCategoryBadges(): () => void {
  document.addEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, injectBadges);
  document.addEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);

  return () => {
    document.removeEventListener(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, injectBadges);
    document.removeEventListener(PAGE_DETECTION_EVENTS.PAGE_CHANGED, onPageChanged);
    removeExistingBadges();
  };
}
