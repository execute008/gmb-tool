import { describe, it, expect, afterEach } from 'vitest';
import { classifyPage } from '../classifier';
import type { PageType, PageState, PageChangedEvent } from '../types';

describe('Page Classifier', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns business-profile when URL contains /place/', () => {
    expect(classifyPage('https://www.google.com/maps/place/SomeBusiness/data=123', document)).toBe('business-profile');
  });

  it('returns search-results when URL contains /search/', () => {
    expect(classifyPage('https://www.google.com/maps/search/restaurants+near+me/', document)).toBe('search-results');
  });

  it('returns other for generic Maps URLs', () => {
    expect(classifyPage('https://www.google.com/maps/@37.7749,-122.4194,15z', document)).toBe('other');
  });

  it('returns other for directions URLs', () => {
    expect(classifyPage('https://www.google.com/maps/dir/Home/Work/', document)).toBe('other');
  });

  it('detects business-profile via DOM when URL is ambiguous', () => {
    document.body.innerHTML = '<div data-attrid="title">Business Name</div>';
    expect(classifyPage('https://www.google.com/maps/', document)).toBe('business-profile');
  });

  it('detects search-results via DOM when URL is ambiguous', () => {
    document.body.innerHTML = '<div role="feed"><div>Result 1</div></div>';
    expect(classifyPage('https://www.google.com/maps/', document)).toBe('search-results');
  });

  it('prioritizes URL pattern over DOM', () => {
    document.body.innerHTML = '<div role="feed"><div>Results</div></div>';
    expect(classifyPage('https://www.google.com/maps/place/SomeBiz/', document)).toBe('business-profile');
  });
});

describe('Page Detection Types', () => {
  it('PageType values are correct', () => {
    const types: PageType[] = ['business-profile', 'search-results', 'other'];
    expect(types).toHaveLength(3);
  });

  it('PageState has required fields', () => {
    const state: PageState = { url: 'https://example.com', pageType: 'other', timestamp: Date.now() };
    expect(state.url).toBeDefined();
    expect(state.pageType).toBeDefined();
    expect(state.timestamp).toBeDefined();
  });

  it('PageChangedEvent has required fields', () => {
    const event: PageChangedEvent = {
      previousState: null,
      currentState: { url: 'https://example.com', pageType: 'other', timestamp: Date.now() },
    };
    expect(event.previousState).toBeNull();
    expect(event.currentState).toBeDefined();
  });
});
