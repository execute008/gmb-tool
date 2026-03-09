import type { PageState } from './types';

export const PAGE_DETECTION_EVENTS = {
  PAGE_CHANGED: 'gmb-audit:page-changed',
  BUSINESS_PROFILE_DETECTED: 'gmb-audit:business-profile-detected',
  SEARCH_RESULTS_DETECTED: 'gmb-audit:search-results-detected',
} as const;

export function createPageEvent(name: string, state: PageState): CustomEvent<PageState> {
  return new CustomEvent<PageState>(name, { detail: state });
}
