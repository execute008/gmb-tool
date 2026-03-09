import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initCategoryBadges } from '../category-badges';
import { PAGE_DETECTION_EVENTS } from '../../page-detection/events';
import type { PageState } from '../../page-detection/types';

function fireBusinessProfileDetected(url = 'https://www.google.com/maps/place/TestBiz/') {
  const state: PageState = { url, pageType: 'business-profile', timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.BUSINESS_PROFILE_DETECTED, { detail: state }));
}

function firePageChanged(pageType: 'business-profile' | 'search-results' | 'other' = 'other') {
  const state: PageState = { url: 'https://www.google.com/maps/', pageType, timestamp: Date.now() };
  document.dispatchEvent(new CustomEvent(PAGE_DETECTION_EVENTS.PAGE_CHANGED, { detail: state }));
}

describe('Category Badges Orchestrator', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (cleanup) cleanup();
    cleanup = undefined;
    document.body.innerHTML = '';
  });

  it('initCategoryBadges returns a cleanup function', () => {
    cleanup = initCategoryBadges();
    expect(typeof cleanup).toBe('function');
  });

  it('injects pills into DOM when business profile detected with categories', () => {
    // Set up a page with categories matching our selectors
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
      <div class="fontBodyMedium">
        <a href="/maps/search/Takeout">Takeout</a>
      </div>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    const container = document.querySelector('[data-gmb-categories]');
    expect(container).not.toBeNull();
  });

  it('primary pill is present with correct text', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    const container = document.querySelector('[data-gmb-categories]');
    expect(container).not.toBeNull();
    expect(container!.textContent).toContain('Restaurant');
  });

  it('secondary pills are present', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
      <div class="fontBodyMedium">
        <a href="/maps/search/Takeout">Takeout</a>
        <a href="/maps/search/Delivery">Delivery</a>
      </div>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    const container = document.querySelector('[data-gmb-categories]');
    expect(container!.textContent).toContain('Takeout');
    expect(container!.textContent).toContain('Delivery');
  });

  it('cleanup removes all injected elements', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    expect(document.querySelector('[data-gmb-categories]')).not.toBeNull();

    cleanup();
    cleanup = undefined;

    expect(document.querySelector('[data-gmb-categories]')).toBeNull();
  });

  it('removes pills when navigating away from business profile', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    expect(document.querySelector('[data-gmb-categories]')).not.toBeNull();

    firePageChanged('other');

    expect(document.querySelector('[data-gmb-categories]')).toBeNull();
  });

  it('does not inject pills when no categories found', () => {
    document.body.innerHTML = '<div>No categories</div>';
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    expect(document.querySelector('[data-gmb-categories]')).toBeNull();
  });

  it('replaces old pills when navigating to new business profile', () => {
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Restaurant</button>
    `;
    cleanup = initCategoryBadges();
    fireBusinessProfileDetected();

    expect(document.querySelector('[data-gmb-categories]')!.textContent).toContain('Restaurant');

    // Navigate to new business
    document.body.innerHTML = `
      <button jsaction="pane.rating.category">Coffee Shop</button>
    `;
    fireBusinessProfileDetected();

    const containers = document.querySelectorAll('[data-gmb-categories]');
    expect(containers.length).toBe(1);
    expect(containers[0].textContent).toContain('Coffee Shop');
  });
});
