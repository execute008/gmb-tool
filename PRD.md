# GMB Audit Tool — Chrome Extension

## Vision

A free/open-source Chrome extension that provides Google Business Profile (GBP) audit and competitor analysis tools directly on Google Maps. Reverse-engineered from GMB Everywhere's feature set, built as a lean Manifest V3 extension.

## Target Users

- Freelance developers and agencies doing local SEO for clients
- Small business owners optimizing their own Google Business Profile
- SEO professionals doing competitive analysis

## Core Features (MVP — Phase 1-3)

### 1. Category Viewer (Inject on GBP)
- When viewing any business on Google Maps, show primary + secondary GBP categories inline
- Extract from the Maps page DOM or Places API
- Always visible, no click required

### 2. Basic Audit (Panel)
- Click audit button on any GBP listing to see:
  - Place ID, CID, Knowledge Panel ID
  - All categories (primary + secondary)
  - Services listed
  - Attributes (wheelchair accessible, etc.)
  - Business hours, website, phone
  - Review count + average rating
  - Direct links: review request URL, directions, website
- Display in a clean side panel or popup

### 3. Competitor Local Scan
- On Google Maps search results, click "Local Scan" to compare all visible GBPs
- Side-by-side table: name, categories, review count, rating, attributes
- Sortable by any column
- Export to CSV

## Extended Features (Phase 4-5)

### 4. Review Audit
- Fetch all reviews for a GBP
- Keyword frequency analysis (what words appear most in reviews)
- Rating distribution chart
- Review timeline (reviews over time)
- Filter by rating, date, keyword

### 5. Rank Checker (Teleport)
- Input: business name/Place ID + target search term + target location
- Spoof location via Google Maps URL params or API
- Search and find where the target GBP ranks in results
- Display rank position + competitors above/below
- Grid view: check rank from multiple locations at once

## Tech Stack

- **Extension:** Chrome Manifest V3, TypeScript, Vite for bundling
- **UI:** Preact or vanilla TS (keep it lightweight, no React bloat)
- **Styling:** Tailwind CSS (inline via build step)
- **Data extraction:** Content scripts injecting into Google Maps DOM
- **APIs:** Google Maps Places API (where needed), mostly DOM scraping
- **Storage:** chrome.storage.local for caching audit data
- **No backend required** for MVP — everything runs client-side

## Architecture

```
gmb-tool/
├── src/
│   ├── manifest.json          # MV3 manifest
│   ├── background/
│   │   └── service-worker.ts  # Background service worker
│   ├── content/
│   │   ├── maps-injector.ts   # Main content script for Google Maps
│   │   ├── category-viewer.ts # Category display logic
│   │   ├── audit-panel.ts     # Basic audit panel
│   │   └── local-scan.ts      # Competitor comparison
│   ├── popup/
│   │   ├── popup.html         # Extension popup
│   │   └── popup.ts
│   ├── components/            # Shared UI components
│   ├── utils/
│   │   ├── scraper.ts         # DOM extraction utilities
│   │   ├── places-api.ts      # Google Places API wrapper
│   │   └── storage.ts         # chrome.storage helpers
│   └── styles/
│       └── panel.css          # Injected styles
├── vite.config.ts
├── tsconfig.json
├── package.json
└── PRD.md
```

## Non-Goals (for now)
- No backend/server
- No user accounts or payments
- No AI features (keep it pure data tools first)
- No Firefox/Safari support in v1

## Success Criteria
- Extension loads on Google Maps without errors
- Category viewer shows correct primary/secondary categories
- Basic audit extracts 20+ data points accurately
- Local scan compares 5+ competitors in under 3 seconds
- Clean, professional UI that doesn't look like a side project

## Phases

1. **Project setup + Category Viewer** — Vite + MV3 scaffold, content script injection, category extraction
2. **Basic Audit Panel** — Side panel with full GBP data extraction, copy/export
3. **Local Scan** — Multi-GBP comparison from search results, table + CSV export
4. **Review Audit** — Review scraping, keyword analysis, charts
5. **Rank Checker** — Location spoofing, grid rank checking
