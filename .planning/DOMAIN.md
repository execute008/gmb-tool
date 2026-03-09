# Domain Model — GMB Audit Tool

## Bounded Contexts

### 1. Page Detection
**Responsibility:** Detect Google Maps SPA navigation and determine what type of page the user is viewing (business profile, search results, directions, etc.).
- MutationObserver + URL change listener (popstate/pushstate intercept)
- Classifies current view: `business-profile` | `search-results` | `other`
- Triggers appropriate content script activation

### 2. Data Extraction
**Responsibility:** Scrape structured data from Google Maps DOM using centralized selectors.
- Selector config layer (single source of truth for all DOM selectors)
- Extracts GBP fields: categories, attributes, hours, reviews, contact info, IDs
- Fallback selector chains for resilience against DOM changes
- Returns typed data objects, never raw DOM nodes

### 3. Category Display
**Responsibility:** Inject inline category badges into the Maps DOM next to business names.
- Renders primary + secondary categories as native-looking tags
- Manages lifecycle of injected elements (cleanup on navigation)

### 4. Audit Panel
**Responsibility:** Display comprehensive GBP audit data in a side panel.
- Preact-rendered panel with structured sections
- Copy/export individual fields or full audit
- Direct links generation (review URL, directions, website)

### 5. Local Scan
**Responsibility:** Compare multiple GBPs from search results in a sortable table.
- Batch extraction from search result listings
- Sortable comparison table
- CSV download + clipboard copy (tab-separated for Sheets)

## Ubiquitous Language

| Term | Definition |
|------|-----------|
| **GBP** | Google Business Profile — the business listing on Google Maps |
| **Primary Category** | The main business category set by the owner (e.g., "Restaurant") |
| **Secondary Categories** | Additional categories beyond the primary (e.g., "Takeout Restaurant", "Delivery") |
| **Place ID** | Google's unique identifier for a place (e.g., `ChIJ...`) |
| **CID** | Customer ID — numeric identifier used in Google Maps URLs |
| **Knowledge Panel** | The right-side panel Google shows for a business in search |
| **Local Scan** | Comparing all visible GBPs in a Maps search result |
| **Audit** | Extracting and displaying all available data points for a single GBP |
| **Selector Config** | Centralized file mapping logical field names to CSS selectors |
| **Inline Badge** | A small tag element injected into the Maps DOM to show categories |
| **Category Pill** | A clickable styled pill element showing a single category; primary is blue, secondary is gray; clicking searches Maps for that category |
| **SPA Navigation** | Single-page app navigation — Maps doesn't do full page reloads |

## Context Map

```
Page Detection ──► Data Extraction ──► Category Display
                        │
                        ├──► Audit Panel
                        │
                        └──► Local Scan
```

- **Page Detection → Data Extraction:** Upstream. Page Detection triggers extraction when it detects a relevant page type.
- **Data Extraction → Category Display / Audit Panel / Local Scan:** Upstream. All UI contexts consume typed data from extraction. No UI context touches the DOM for data.
- **Shared Kernel:** Selector Config is shared across Data Extraction (it's the single source of truth for all DOM queries).

## Aggregates

### Page Detection Context
- **PageState** (root): current URL, view type, navigation history

### Data Extraction Context
- **BusinessProfile** (root): place ID, CID, name, categories, attributes, hours, contact, reviews summary, links
- **SelectorRegistry** (root): maps logical field names → CSS selector chains with fallbacks

### Category Display Context
- **CategoryBadge** (root): business element reference, categories to display, injection state

### Audit Panel Context
- **AuditReport** (root): full BusinessProfile data + generated links + export formats

### Local Scan Context
- **ScanResult** (root): list of BusinessProfile summaries, sort state, export state

## Domain Events

| Event | From | To | Description |
|-------|------|----|-------------|
| `PageChanged` | Page Detection | All UI contexts | User navigated to a new Maps view |
| `BusinessProfileDetected` | Page Detection | Category Display, Audit Panel | A GBP detail page is now visible |
| `SearchResultsDetected` | Page Detection | Local Scan | Search results with GBPs are visible |
| `ProfileExtracted` | Data Extraction | Audit Panel, Category Display | Full GBP data has been scraped |
| `ScanCompleted` | Data Extraction | Local Scan | All visible GBPs in search results extracted |
| `SelectorsStale` | Data Extraction | (logged) | Extraction failed — selectors likely outdated |
