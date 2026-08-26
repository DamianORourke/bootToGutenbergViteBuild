# Block Pattern Factory

A development tool for generating WordPress block patterns from Bootstrap HTML.

## What It Does

Write layouts in familiar Bootstrap syntax, convert to native Gutenberg blocks, and export as WordPress block patterns. Use patterns directly in the WordPress editor.

```
Bootstrap HTML → [Convert] → [Copy as Pattern] → theme/patterns/{name}.php → Reuse via Editor
```

## Why This Exists

Bootstrap's responsive classes and markup are intuitive and easy to remember. Gutenberg's block syntax isn't. This tool bridges the gap:

- **Sketch layouts in Bootstrap** (fast, familiar)
- **Convert to Gutenberg blocks** (native, validated)
- **Export as patterns** (reusable, editable)
- **Edit in WordPress** (no code needed)

No full block-development workflow. No React. No npm. Just convert and copy.

## Quick Start

1. Open `bootToGutenberg.html` in your browser
2. Write Bootstrap HTML or select from **Templates** dropdown
3. Click **Convert**
4. Click **Copy as Pattern** - enter name, copy to clipboard
5. Save as `patterns/{slug}.php` in your theme
6. Pattern appears in WordPress editor's pattern inserter

## Pattern Output Format

```php
<?php
/**
 * Title: Section Two Column
 * Slug: theme/section-two-column
 * Categories: theme-sections
 * Keywords: cover, columns, heading, text
 * Description: Full-width section with two responsive columns
 */
?>
<!-- wp:cover {"overlayColor":"white","align":"full"} -->
<div class="wp-block-cover alignfull">
  ...
</div>
<!-- /wp:cover -->
```

## Features

### Copy as Pattern
One-click export to WordPress pattern format with metadata (title, slug, categories, keywords).

### Save Pattern
Saves to three locations:
- `patterns/{name}.php` - PHP pattern file (copy to theme)
- `examples/{name}.html` - Full reference page (original + gutenberg + css)
- `gutenberg_dump/{name}.html` - Raw Gutenberg HTML

### CSS Styles Export
Generates theme-native CSS using `var(--wp--preset--color--primary)` instead of hardcoded Bootstrap values.

### Live Preview
Toggle between Code and Preview views to see Bootstrap HTML rendered before converting.

### Native Block Conversion
Converts to native Gutenberg blocks wherever possible:
- `container` → `wp:group` with constrained layout
- `container-fluid` + `bg-*` → `wp:cover` with overlay
- `row` → `wp:columns`
- `col-*` → `wp:column` with width
- `h1-h6` → `wp:heading`
- `p` → `wp:paragraph`
- `btn` → `wp:button`
- `card` → `wp:group` with card classes
- `img` → `wp:image`
- `table` → `wp:table`

### Responsive Support
Bootstrap breakpoint classes preserved and converted to CSS media queries:
- `col-12 col-md-6` → 50% width + `stack-on-mobile` class
- `d-none d-md-block` → Responsive visibility CSS
- `flex-column flex-md-row` → Responsive flex direction

## File Structure

```
bootToGutenberg/
├── bootToGutenberg.html    # Main converter tool
├── api/save.php            # Save API (DEV only)
├── bootstrap-partials/     # Source Bootstrap HTML templates
├── patterns/               # Saved PHP pattern files
├── examples/               # Full reference pages
├── gutenberg_dump/         # Raw Gutenberg HTML
├── templates/example.php   # Example page template
└── css/
    ├── bootToGutenberg.css # Tool UI styles
    └── style.css           # Theme CSS mirror
```

## Pattern to Theme Workflow

1. Develop and test patterns using the converter
2. When satisfied, click **Save Pattern**
3. Copy `patterns/{name}.php` to your theme's `patterns/` folder
4. Pattern appears in WordPress editor's pattern inserter
5. Copy CSS from **CSS Styles** panel to your theme's stylesheet

## WordPress Theme Requirements

### Enqueue Styles

```php
function theme_enqueue_styles() {
    wp_enqueue_style(
        'theme-style',
        get_stylesheet_uri(),
        array( 'wp-block-library', 'global-styles' ),
        wp_get_theme()->get( 'Version' )
    );
}
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');

// For editor + frontend
function theme_block_assets() {
    wp_enqueue_style(
        'theme-block-styles',
        get_template_directory_uri() . '/style.css',
        array( 'wp-block-library' ),
        filemtime( get_template_directory() . '/style.css' )
    );
}
add_action( 'enqueue_block_assets', 'theme_block_assets' );
```

### Bootstrap JS (for interactive components)

```php
wp_enqueue_script(
    'bootstrap-bundle',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    array(),
    '5.3.3',
    true
);
```

### Required theme.json Presets

```json
{
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#4F46E5" },
        { "slug": "secondary", "color": "#7C3AED" },
        { "slug": "success", "color": "#10B981" },
        { "slug": "error", "color": "#EF4444" },
        { "slug": "warning", "color": "#F59E0B" },
        { "slug": "surface", "color": "#F8FAFC" },
        { "slug": "dark", "color": "#1E293B" },
        { "slug": "white", "color": "#FFFFFF" }
      ]
    },
    "spacing": {
      "spacingSizes": [
        { "slug": "sm", "size": "0.75rem" },
        { "slug": "md", "size": "1rem" },
        { "slug": "lg", "size": "1.5rem" },
        { "slug": "xl", "size": "2rem" }
      ]
    }
  }
}
```

## Mapping Reference

### Layout
| Bootstrap | Gutenberg |
|-----------|-----------|
| `.container` | `wp:group` with constrained layout |
| `.container-fluid` | `wp:group` with align: full |
| `.container-fluid.bg-*` | `wp:cover` with overlay color |
| `.row` | `wp:columns` |
| `.col-N` | `wp:column` with width percentage |
| `col-12 col-md-6` | `wp:column` 50% + `stack-on-mobile` |

### Spacing
| Bootstrap | WordPress Preset |
|-----------|------------------|
| p/m-1, p/m-2 | `--wp--preset--spacing--sm` |
| p/m-3 | `--wp--preset--spacing--md` |
| p/m-4 | `--wp--preset--spacing--lg` |
| p/m-5 | `--wp--preset--spacing--xl` |

### Colors
| Bootstrap | WordPress Preset |
|-----------|------------------|
| bg-primary | primary |
| bg-secondary | secondary |
| bg-success | success |
| bg-danger | error |
| bg-warning | warning |
| bg-light | surface |
| bg-dark | dark |
| bg-white | white |

## Templates Included

**Layout Patterns:**
- Section Cover (full-width with responsive columns)
- Jumbotron
- Features Grid
- Call to Action
- Pricing Cards

**Content:**
- Card, Card Group
- List Group
- Table
- Figures

**Components:**
- Accordion
- Alerts
- Badges
- Breadcrumb
- Buttons
- Button Group
- Collapse
- Dropdowns

## Limitations

- Complex Bootstrap JS components (modal, carousel, offcanvas) output as `wp:html` blocks
- Responsive column widths use the largest specified breakpoint
- Forms require additional handling

## License

MIT License

## Credits

- [Gutenberg Utility Classes](https://github.com/muax3000/gutenberg-utility-classes) by muax3000 (GPL-2.0+)
