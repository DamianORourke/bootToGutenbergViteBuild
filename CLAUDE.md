# bootToGutenberg Web Modularisation

## Purpose

ES modules version of bootToGutenberg, built with Vite for modern web development.

## Relationship to Other Directories

```
bootToGutenberg/                    ← UPSTREAM (source of truth)
    ↓ changes flow down
bootToGutenbergWebModularisation/   ← THIS DIRECTORY (modular ES modules)
    ↓ vite build
bootToGutenbergViteBuild/           ← DOWNSTREAM (production output)
```

**Do not make original changes here.** All new functionality should be:
1. Developed and tested in `bootToGutenberg/` first
2. Then ported to this modular structure

## Project Structure (Target)

```
bootToGutenbergWebModularisation/
├── package.json
├── vite.config.js
├── index.html                    # Vite entry point
├── css/
│   ├── bootToGutenberg.css       # UI styles
│   ├── wordpress_theme_styles.css
│   └── wordpress_editor_styles.css
└── src/
    ├── main.js                   # Entry point
    ├── core/
    │   ├── Converter.js          # Main converter class
    │   ├── handlers/
    │   │   ├── index.js
    │   │   ├── layoutHandlers.js
    │   │   ├── componentHandlers.js
    │   │   ├── elementHandlers.js
    │   │   └── interactiveHandlers.js
    │   ├── extractors/
    │   │   └── attributeExtractor.js
    │   └── utils/
    │       └── blockFormatter.js
    ├── data/
    │   ├── mappings.js
    │   ├── cssLibrary.js
    │   ├── examples.js
    │   └── exampleNames.js
    └── ui/
        ├── app.js
        ├── conversion.js
        ├── preview.js
        ├── cssPanel.js
        └── examplesUI.js
```

## Commands

```bash
# Install dependencies (first time)
npm install

# Development server with hot reload
npm run dev

# Build to production
npm run build
# Output: ../bootToGutenbergViteBuild/
```

## Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: '../bootToGutenbergViteBuild',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
})
```

## Module Import Pattern

```javascript
// src/main.js - Entry point
import { BootstrapToGutenbergConverter } from './core/Converter.js'
import { cssLibrary } from './data/cssLibrary.js'
import { examples, exampleNames } from './data/examples.js'
import { initUI } from './ui/app.js'

// Initialize application
const converter = new BootstrapToGutenbergConverter()
initUI(converter, { cssLibrary, examples, exampleNames })
```

## Porting Changes from Original

When porting changes from `bootToGutenberg.html`:

1. **Identify the section** - Use line numbers from original
2. **Find the target module** - See mapping table in main CLAUDE.md
3. **Extract and adapt** - Convert to ES module syntax
4. **Test** - Run `npm run dev` and verify

### Common Adaptations

```javascript
// Original (global)
function convert() { ... }

// Modular (exported)
export function convert(converter, inputEl, outputEl) { ... }

// Original (inline)
const converter = new BootstrapToGutenbergConverter()

// Modular (injected)
import { BootstrapToGutenbergConverter } from './core/Converter.js'
```

## Current Status

- [x] Initial file copy from original
- [ ] Vite project initialization (package.json, vite.config.js)
- [ ] Extract data modules
- [ ] Extract core converter
- [ ] Extract UI modules
- [ ] Integration testing
