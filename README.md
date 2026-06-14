# Quick Copy Block — Developer Notes

## Requirements

- Node.js 20+
- npm 10+
- PHP 7.4+
- Composer

## Setup

```bash
npm install
composer install
```

## Development

```bash
npm start          # Watch mode with HMR
npm run build      # Production build
npm run lint:js    # ESLint
npm run lint:css   # Stylelint
npm run lint:php   # PHP_CodeSniffer (WPCS strict)
npm run format     # Auto-format JS/CSS
```

## Build output

`@wordpress/scripts` + custom `webpack.config.js` compiles two entry points:

```
build/
├── index.js           ← Editor bundle (block registration, edit, save)
├── index.asset.php    ← Auto-generated dependency manifest
├── index.css          ← Editor-only styles
├── frontend.js        ← Front-end clipboard script (no WP deps)
├── frontend.asset.php ← Auto-generated asset manifest
└── style-index.css    ← Shared front-end + editor styles
```

`block.json` wires these up:
- `editorScript` → `build/index.js`
- `viewScript`   → `build/frontend.js`  ← loaded only on pages with the block
- `style`        → `build/style-index.css`
- `editorStyle`  → `build/index.css`

## Architecture notes

### Why `save.js` (static) instead of PHP render?

The Clipt block's output is fully deterministic from its attributes — no
server-side logic is needed. Static `save()` output is:
- Faster (no database/PHP round-trip on every page load)
- Cacheable by full-page caches
- Simpler (no render_callback registration)

### Data contract between save.js and frontend.js

| Element                         | Role                                      |
|---------------------------------|-------------------------------------------|
| `.clipt-block[data-success]`    | Success message string                    |
| `.clipt-block__content`         | The text to copy (innerText is used)      |
| `.clipt-block__button[data-label]` | Original button label (for restore)    |
| `.clipt-block__button-label`    | Inner `<span>` whose text is swapped      |
| `.clipt-block__button--fade`    | CSS class that drives opacity transition  |

### Clipboard copy priority

1. `navigator.clipboard.writeText()` — modern API, requires HTTPS / secure context
2. `document.execCommand('copy')` — legacy fallback, works on HTTP

## Distributable ZIP

```bash
npm run build
npm run plugin-zip
```

Produces `clipt.zip` using `.distignore` to exclude dev files.
