export type PageType = 'business-profile' | 'search-results' | 'other';

export interface PageState {
  url: string;
  pageType: PageType;
  timestamp: number;
}

export interface PageChangedEvent {
  previousState: PageState | null;
  currentState: PageState;
}
