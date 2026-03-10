# GMB Audit Tool

A Chrome extension that provides Google Business Profile (GBP) audit and competitor analysis tools directly on Google Maps.

## Features

- **Category Viewer** — View primary + secondary GBP categories inline on any business listing
- **Basic Audit** — Extract Place ID, CID, categories, services, attributes, hours, reviews, and more
- **Local Scan** — Compare competitors in search results with sortable tables and CSV export

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Chrome browser

## Setup

```bash
# Install dependencies
pnpm install

# Build the extension
pnpm build

# Or watch for changes during development
pnpm dev
```

## Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. The extension is now installed — navigate to Google Maps to use it

## Development

```bash
# Watch mode — rebuilds on file changes
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

After making changes with `pnpm dev` running, go to `chrome://extensions` and click the refresh icon on the extension to reload it.

## Project Structure

```
gmb-tool/
├── src/
│   ├── manifest.json          # Chrome MV3 manifest
│   ├── background/            # Service worker
│   ├── content/               # Content scripts (Maps injection)
│   ├── popup/                 # Extension popup UI
│   ├── utils/                 # Shared utilities
│   └── styles/                # CSS
├── dist/                      # Built extension (load this in Chrome)
├── vite.config.ts
└── package.json
```

## Tech Stack

- Chrome Manifest V3
- TypeScript
- Preact
- Tailwind CSS
- Vite

## License

MIT
