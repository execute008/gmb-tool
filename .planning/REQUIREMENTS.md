# Requirements — GMB Audit Tool

## v1 (MVP — Milestone 1)

### R1: Extension Scaffold [Page Detection]
The extension loads on Google Maps without errors, with a working MV3 manifest, service worker, and content script injection.

### R2: SPA Navigation Detection [Page Detection]
The extension detects Google Maps SPA navigation via MutationObserver (primary) + URL change listener (fallback), correctly classifying views as `business-profile`, `search-results`, or `other`.

### R3: Centralized Selector Config [Data Extraction]
All DOM selectors are defined in a single config file with fallback chains. When Google changes markup, only this file needs updating.

### R4: Category Extraction [Data Extraction]
The extension extracts primary and secondary GBP categories from the Maps DOM accurately.

### R5: Inline Category Badges [Category Display]
Categories are displayed as inline badge/tags next to the business name, styled to look native to Google Maps. Badges clean up on navigation.

### R6: Business Profile Extraction [Data Extraction]
The extension extracts 20+ data points from a GBP: Place ID, CID, categories, services, attributes, hours, website, phone, review count, average rating, and direct links.

### R7: Audit Panel [Audit Panel]
A clean side panel displays all extracted GBP data with copy buttons for individual fields and the full audit.

### R8: Search Result Extraction [Data Extraction]
The extension extracts key fields (name, categories, review count, rating, attributes) from all visible GBPs in search results.

### R9: Local Scan Table [Local Scan]
A sortable comparison table shows all GBPs from search results side-by-side, sortable by any column.

### R10: Export — CSV Download [Local Scan]
Local scan results can be downloaded as a `.csv` file.

### R11: Export — Clipboard Copy [Local Scan]
Local scan results can be copied to clipboard as tab-separated values (pastes directly into Google Sheets).

## v2 (Post-MVP)

### R12: Review Audit [Data Extraction, new context]
Fetch all reviews for a GBP with keyword frequency analysis, rating distribution chart, review timeline, and filtering.

### R13: Rank Checker [new context]
Location spoofing to check where a GBP ranks for a search term from different locations, with grid view.

### R14: Places API Integration [Data Extraction]
Optional Google Places API key for more reliable/richer data extraction as fallback or supplement to DOM scraping.

### R15: Audit Data Caching [Data Extraction]
Cache extracted audit data in `chrome.storage.local` to avoid re-scraping when revisiting a profile.

## Out of Scope

- Backend/server infrastructure
- User accounts or payments
- AI-powered features
- Firefox/Safari support
- Mobile extension support
