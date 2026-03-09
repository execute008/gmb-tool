# Roadmap — GMB Audit Tool

## Milestone 1: MVP (Core Audit + Local Scan)

### Phase 1: Extension Scaffold + SPA Detection
**Goal:** Extension loads on Google Maps, detects page navigation, and has the selector config layer ready.
**Requirements:** R1, R2, R3
**Complexity:** Medium
**Outcome:** User installs the extension, navigates Google Maps, and the extension correctly logs page type changes to the console. Selector config exists with initial Maps selectors.

### Phase 2: Category Viewer
**Goal:** User sees primary and secondary categories as inline badges on any GBP page.
**Requirements:** R4, R5
**Complexity:** Medium
**Outcome:** User views a business on Google Maps and immediately sees category tags next to the business name. Tags clean up when navigating away.

### Phase 3: Basic Audit Panel
**Goal:** User clicks audit button to see comprehensive GBP data in a side panel with copy/export.
**Requirements:** R6, R7
**Complexity:** High
**Outcome:** User clicks audit on any GBP and sees 20+ data points in a clean panel. Can copy individual fields or full audit data.

### Phase 4: Local Scan + Export
**Goal:** User compares all visible GBPs from search results in a sortable table with CSV download and clipboard copy.
**Requirements:** R8, R9, R10, R11
**Complexity:** High
**Outcome:** User searches Google Maps, clicks "Local Scan", sees a comparison table, sorts by any column, downloads CSV or copies to clipboard for Google Sheets.

## Milestone 2: Extended Features (Post-MVP)

_To be planned after Milestone 1 is complete. Expected phases: Review Audit, Rank Checker, API Integration, Caching._
