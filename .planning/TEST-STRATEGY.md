# Test Strategy — GMB Audit Tool

## Test Framework

**Vitest** — native Vite integration, fast, TypeScript-first, compatible with our Vite build setup. Uses happy-dom for DOM testing (lighter than jsdom).

## Directory Conventions

```
src/
├── utils/
│   ├── scraper.ts
│   └── __tests__/
│       └── scraper.test.ts
├── content/
│   ├── category-viewer.ts
│   └── __tests__/
│       └── category-viewer.test.ts
└── ...
tests/
├── fixtures/           # Saved HTML snapshots of Maps pages for DOM testing
│   ├── business-profile.html
│   └── search-results.html
└── helpers/            # Shared test utilities
    └── mock-chrome.ts  # chrome.* API mocks
```

Co-located `__tests__/` directories next to source. Fixture HTML files in top-level `tests/fixtures/`.

## Coverage Goals

- **Target:** 80% line coverage on `utils/` and data extraction logic
- **Critical paths (must be 90%+):**
  - Selector config resolution and fallback chains
  - Data extraction from DOM (scraper utilities)
  - CSV/clipboard export formatting
- **Acceptable lower coverage:**
  - Preact UI components (tested manually + snapshot tests where valuable)
  - Chrome extension API integration points (mocked at boundaries)

## Testing Levels

### Unit Tests
- **Selector config:** Given a DOM fixture, selectors resolve to correct elements
- **Data extraction:** Given HTML fixture, extract correct typed data
- **Export formatting:** CSV generation, tab-separated clipboard format
- **URL parsing:** Place ID / CID extraction from Maps URLs
- **Example:** `scraper.extractCategories(fixture) → ['Restaurant', 'Takeout']`

### Integration Tests
- **Content script lifecycle:** MutationObserver + URL listener fire correct events on DOM changes
- **Panel rendering:** Preact audit panel renders correct sections given extracted data
- **Local scan pipeline:** Extract → sort → export flow with real DOM fixtures

### Manual / E2E
- **Extension loading:** Install in Chrome, navigate Maps, verify no errors
- **Visual verification:** Category badges look correct inline, panel styling is clean
- **SPA navigation:** Navigate between businesses, verify cleanup and re-injection

## Excluded

- **Chrome extension APIs** (`chrome.storage`, `chrome.runtime`): Mocked at boundary. Tested manually in real Chrome.
- **Google Maps DOM structure validity**: We test against saved fixtures. Real Maps testing is manual.
- **Vite build output**: Build config tested by building, not by unit tests.
- **Styling/CSS**: Visual testing is manual.
