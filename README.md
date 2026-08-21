# Bootstrap to Gutenberg Converter

A browser-based tool that converts Bootstrap 5.3 HTML into WordPress Gutenberg block markup. Designed for WordPress theme developers who want to leverage Bootstrap's component library while building FSE (Full Site Editing) block themes.

## Purpose

I’ve always found Bootstrap’s responsive classes and markup intuitive, predictable, and easy to remember. The problem is that Bootstrap markup doesn’t translate particularly well into Gutenberg’s block syntax.

**bootToGutenberg** takes a different approach. Rather than trying to reproduce Bootstrap inside WordPress, it uses Bootstrap markup as a familiar starting point and converts it into **native Gutenberg wherever possible**.

The conversion prioritises Gutenberg’s native blocks, attributes, and JSON decorators over simply carrying HTML and Bootstrap classes across. Standard HTML elements are converted into their Gutenberg equivalents where there is a suitable native representation, while Bootstrap classes and CSS are retained only where they are genuinely useful or cannot be represented by Gutenberg itself.

You could build a Sass layer that converts the entire Bootstrap library into WordPress theme presets, but that comes with a significant CSS overhead. For many use cases, you simply don’t need the entire Bootstrap framework. Instead, bootToGutenberg generates only the small amount of additional CSS required to support the converted markup.

There’s also the question of development overhead. For a simple piece of markup, going through the full block-development process can feel like overkill. Sometimes you just want to take markup you already understand and turn it into something Gutenberg can work with.

That’s what this tool is for:

**Start with familiar Bootstrap or HTML markup → convert it to Gutenberg-native markup → add it to your WordPress theme → edit it in Gutenberg.**

Create a template part or pattern, upload it to your theme, and use it directly in the WordPress editor. From there, it behaves like Gutenberg content and can be edited using the tools you already know.

No full block-development workflow. No need to load the entire Bootstrap framework. Just take the markup you already have and convert it into the most Gutenberg-native version possible.


This tool bridges that gap by:

- Converting Bootstrap HTML structure to valid Gutenberg block syntax
- Mapping Bootstrap utility classes to WordPress theme.json design tokens
- Using native Gutenberg blocks with Bootstrap class names for styling
- Generating companion CSS for Bootstrap-inspired styling
- Preserving Bootstrap JS components (accordion, modal, carousel, etc.) as `wp:html` blocks
- **Supporting responsive breakpoint utilities** (sm, md, lg, xl, xxl)
- **Passing through custom classes** for user-defined styling

## Quick Start

1. Open `bootToGutenberg.html` in your browser
2. Paste Bootstrap HTML or select from the **Examples** dropdown
3. Click **Convert**
4. Copy the Gutenberg output to your WordPress pattern file
5. Click **CSS Styles** button to get the required CSS (includes generated custom classes)
6. Add the CSS to your theme's stylesheet
7. Rename generated classes (`.custom-1`, etc.) to meaningful names

## Starter CSS Files

Two ready-to-use CSS files are included in the `css/` directory:

| File | Purpose | Usage |
|------|---------|-------|
| `wordpress_theme_styles.css` | Frontend styles | Enqueue in `functions.php` for site visitors |
| `wordpress_editor_styles.css` | Editor styles | Add to `add_editor_style()` for block editor |

### What's Included

Both files contain theme-native CSS for:

**Components:**
- Cards (card, card-group, card-body, card-title, card-footer)
- List Groups
- Tables (with hover variant)
- Accordions (with animated chevron)
- Alerts (primary, success, danger, warning + dismissible)
- Badges
- Breadcrumbs
- Button Groups
- Collapse

**Utilities:**
- Border utilities (border-1 through border-5, border colors, sides)
- Rounded corners (rounded-0 through rounded-5, circle, pill)
- Shadow utilities (shadow-sm, shadow, shadow-lg, shadow-xl)
- Display utilities (d-none, d-block, d-flex, etc.)
- Responsive flex (flex-md-column, justify-content-lg-center, etc.)
- Gap utilities (gap-1 through gap-5, responsive variants)

### Enqueue in WordPress

```php
// Frontend styles
function theme_enqueue_styles() {
    wp_enqueue_style(
        'bootstrap-gutenberg',
        get_template_directory_uri() . '/css/wordpress_theme_styles.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');

// Editor styles
function theme_editor_styles() {
    add_editor_style('css/wordpress_editor_styles.css');
}
add_action('after_setup_theme', 'theme_editor_styles');
```

## Features

### Live Preview
Toggle between Code and Preview views to see your Bootstrap HTML rendered with full Bootstrap CSS/JS before converting.

### CSS Styles Export (Theme-Native)
The converter generates CSS that uses your **theme.json CSS variables** instead of hardcoded Bootstrap values.

**Why theme-native CSS?**
- Bootstrap's `bg-primary` uses `#0d6efd` (Bootstrap blue)
- Your theme's `primary` might be `#4F46E5` (your brand color)
- The converter generates: `var(--wp--preset--color--primary)` (your color!)

### Responsive Breakpoint Support

The converter preserves Bootstrap's responsive utility classes and generates CSS with matching media queries:

| Breakpoint | Min Width | Example Classes |
|------------|-----------|-----------------|
| sm | 576px | `flex-sm-column`, `d-sm-none` |
| md | 768px | `flex-md-row`, `justify-content-md-center` |
| lg | 992px | `gap-lg-4`, `d-lg-flex` |
| xl | 1200px | `align-items-xl-start` |
| xxl | 1400px | `flex-xxl-wrap` |

**Example:**
```html
<!-- Input -->
<div class="d-flex flex-row flex-md-column justify-content-between justify-content-md-start">

<!-- Output: Gutenberg uses mobile-first layout, CSS handles breakpoints -->
<!-- wp:group {"className":"flex-md-column justify-content-md-start","layout":{"type":"flex","orientation":"horizontal","justifyContent":"space-between"}} -->
```

### Custom Class Pass-Through

Classes not recognized by the converter are preserved in the output:

```html
<!-- Input -->
<div class="container my-custom-widget special-styling shadow-lg">

<!-- Output: Custom classes preserved alongside converted attributes -->
<!-- wp:group {"className":"my-custom-widget special-styling shadow-lg",...} -->
```

This allows you to:
- Use your own custom CSS classes
- Target converted elements with additional styling
- Extend Bootstrap patterns without modifying the converter

### Utility-to-Custom-Class Generator

For flex elements with Bootstrap utility classes, the converter automatically generates a single custom CSS class instead of preserving all utility classes. This produces cleaner output and theme-compatible CSS.

**Input:**
```html
<div class="d-inline-flex flex-row justify-content-between align-items-center ps-2 pe-2 pt-1 pb-1 border border-black gap-2 rounded-pill">
  <svg>...</svg>
  <span>Content</span>
</div>
```

**Output HTML:**
```html
<!-- wp:group {"className":"custom-1"} -->
<div class="wp-block-group custom-1">
  <!-- wp:html --><svg>...</svg><!-- /wp:html -->
  <!-- wp:html --><span>Content</span><!-- /wp:html -->
</div>
<!-- /wp:group -->
```

**Generated CSS (via CSS Styles panel):**
```css
.custom-1 {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: var(--wp--preset--spacing--sm);
  padding-right: var(--wp--preset--spacing--sm);
  padding-top: var(--wp--preset--spacing--sm);
  padding-bottom: var(--wp--preset--spacing--sm);
  border-width: 1px;
  border-style: solid;
  border-color: #000;
  gap: var(--wp--preset--spacing--sm);
  border-radius: var(--wp--custom--border-radius--pill, 50rem);
}
```

The CSS Styles panel shows generated classes in a "Generated Classes" section. Copy the CSS to your theme and rename `.custom-1` to something meaningful.

### SVG and Inline Element Handling

SVG elements and inline elements (span, strong, em, etc.) are automatically preserved as `wp:html` blocks to maintain their structure:

- **SVG**: Always wrapped in `wp:html` (Gutenberg has no native SVG block)
- **Inline elements**: Wrapped in `wp:html` to preserve tag structure

### Inline Style Handling

Elements with inline styles that can't be mapped to Gutenberg JSON attributes are automatically wrapped in `wp:html` blocks to prevent validation errors:

**Mapped styles** (converted to JSON):
- padding, margin
- background-color, color
- font-size, line-height, font-weight
- border-radius

**Unmapped styles** (preserved via wp:html):
- width, height
- display, position
- top, left, right, bottom
- Custom CSS properties

### Example Templates
Pre-built examples covering common patterns:
- **Layout Patterns**: Hero, Features Grid, Call to Action, Pricing Cards
- **Content**: Cards, Card Groups, List Groups, Tables, Figures
- **Components**: Accordion, Alerts, Badges, Buttons, Button Groups, Breadcrumbs, Collapse
- **Interactive** (*): Carousel, Modal, Offcanvas, Pagination, Progress, Spinners, Toasts

*Components marked with (*) are not fully developed - they output as wp:html blocks.

## Mapping Reference

### Spacing (Bootstrap | Theme)
| Bootstrap | Theme Slug | CSS Variable |
|-----------|------------|--------------|
| m/p-0 | 0 | 0 |
| m/p-1 | sm | `--wp--preset--spacing--sm` |
| m/p-2 | sm | `--wp--preset--spacing--sm` |
| m/p-3 | md | `--wp--preset--spacing--md` |
| m/p-4 | lg | `--wp--preset--spacing--lg` |
| m/p-5 | xl | `--wp--preset--spacing--xl` |

This mapping also applies to gap utilities (`gap-1` through `gap-5`) and border-radius (`rounded-1` through `rounded-5`).

### Colors (Bootstrap | Theme)
| Bootstrap | Theme Slug |
|-----------|------------|
| bg-primary | primary |
| bg-secondary | secondary |
| bg-success | success |
| bg-danger | error |
| bg-warning | warning |
| bg-light | surface |
| bg-dark | dark |
| text-white | white |
| text-muted | text-muted |

### Font Sizes (Bootstrap | Theme)
| Bootstrap | Theme Slug |
|-----------|------------|
| fs-1 | 6x-large |
| fs-2 | 5x-large |
| fs-3 | 4x-large |
| fs-4 | 3x-large |
| fs-5 | 2x-large |
| fs-6 | x-large |

### Layout Conversions
| Bootstrap | Gutenberg |
|-----------|-----------|
| .container | `wp:group` with constrained layout |
| .container-fluid | `wp:group` with align: full |
| .row | `wp:columns` |
| .col-N | `wp:column` with width percentage |
| .d-flex | `wp:group` with flex layout |
| .text-center | Inherited by child blocks as textAlign |

### Element Conversions
| Bootstrap | Gutenberg Block |
|-----------|-----------------|
| h1-h6 | `wp:heading` with level |
| p | `wp:paragraph` |
| .btn.btn-primary | `wp:button` with backgroundColor |
| .btn-outline-* | `wp:button` with is-style-outline |
| .card | `wp:group` with `.card` className |
| .card-group | `wp:columns` with `.card-group` className |
| .card-body | `wp:group` with `.card-body` className |
| img | `wp:image` |
| table | `wp:table` |
| .d-flex with utilities | `wp:group` with generated custom class |

### Dual Output for Buttons

Buttons with utility classes (e.g., `rounded-pill`, `shadow-lg`) output two versions:

1. **Styles Version**: Full inline styles (works everywhere, no theme CSS needed)
2. **Class Version**: Uses utility classes (cleaner, requires theme CSS)

Choose the version that fits your workflow. The styles version is more portable; the class version is cleaner and more maintainable.

## Bootstrap JS Components

Components that rely on Bootstrap JavaScript are converted while preserving their `data-bs-*` attributes:

**Native block conversion** (with Bootstrap classes preserved):
- Dropdown (standalone and split button)
- Button Group with Dropdown
- Collapse triggers

**wp:html block** (complex structures):
- Accordion
- Modal
- Carousel
- Tabs / Nav Tabs / Nav Pills
- Offcanvas
- Toast
- Navbar (with toggler)

**Important:** Your WordPress theme must enqueue Bootstrap JS for these components to work:

```php
wp_enqueue_script(
    'bootstrap-bundle',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    array(),
    '5.3.3',
    true
);
```

## Why Some Components Use wp:html

Both Bootstrap and WordPress provide similar UI components, but they're built on fundamentally different architectures. This tool converts to native Gutenberg blocks wherever the two systems align well, and preserves the original HTML where they don't.

**Native conversion works well when:**
- The markup structure is similar (headings, paragraphs, images, buttons)
- Styling can be mapped to theme.json design tokens (colors, spacing, typography)
- Layout can be expressed through Gutenberg's flex/grid system (containers, columns)

**wp:html is used when:**
- The component has complex nested structures (modals, carousels, accordions)
- The markup structure differs significantly between frameworks
- Multiple interdependent data attributes must be preserved exactly

For example, a Bootstrap **navbar** includes collapse toggles, dropdown menus, and responsive breakpoint behavior—all powered by Bootstrap's JavaScript. WordPress has its own `wp:navigation` block, but it's designed around WordPress menus and uses an entirely different rendering system. Converting between the two would require recreating the menu structure, not just transforming markup.

The practical approach: use `wp:html` for complex components and include Bootstrap JS in your theme. This preserves full functionality while still allowing you to use Bootstrap's familiar syntax as your starting point.

### Split Button Dropdown Example

**Input:**
```html
<div class="btn-group">
  <button type="button" class="btn btn-danger">Action</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>
</div>
```

**Output:**
```html
<!-- wp:group {"className":"btn-group","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group btn-group">

<!-- wp:button {"backgroundColor":"error","textColor":"white"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button has-error-background-color has-background has-white-color has-text-color" href="#">Action</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"dropdown-toggle dropdown-toggle-split","backgroundColor":"error","textColor":"white"} -->
<div class="wp-block-button dropdown-toggle dropdown-toggle-split"><a class="wp-block-button__link wp-element-button has-error-background-color has-background has-white-color has-text-color" href="#" data-bs-toggle="dropdown" aria-expanded="false"><span class="visually-hidden">Toggle Dropdown</span></a></div>
<!-- /wp:button -->

<!-- wp:list {"className":"dropdown-menu"} -->
<ul class="wp-block-list dropdown-menu">
<!-- wp:list-item --><li><a class="dropdown-item" href="#">Action</a></li><!-- /wp:list-item -->
<!-- wp:list-item --><li><a class="dropdown-item" href="#">Another action</a></li><!-- /wp:list-item -->
<!-- wp:list-item --><li><a class="dropdown-item" href="#">Something else here</a></li><!-- /wp:list-item -->
</ul>
<!-- /wp:list -->

</div>
<!-- /wp:group -->
```

**CSS Styles:**
```css
/* Button Group */
.wp-block-buttons.btn-group {
  gap: 0;
}
.wp-block-buttons.btn-group .wp-block-button .wp-block-button__link {
  border-radius: 0;
}
.wp-block-buttons.btn-group .wp-block-button:first-child .wp-block-button__link {
  border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
  border-bottom-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.wp-block-buttons.btn-group .wp-block-button:last-child .wp-block-button__link {
  border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
  border-bottom-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
}

/* Dropdown - Bootstrap JS required */
.wp-block-group.dropdown {
  position: relative;
  display: inline-flex;
}
.dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
.dropdown-toggle-split::after {
  margin-left: 0;
}
.wp-block-list.dropdown-menu {
  position: absolute;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0;
  background-color: var(--wp--preset--color--white, #fff);
  border: 1px solid var(--wp--preset--color--border, rgba(0,0,0,0.15));
  border-radius: var(--wp--preset--spacing--xs, 0.375rem);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  top: 100%;
  left: 0;
  list-style: none;
}
.wp-block-list.dropdown-menu.show {
  display: block;
}
.wp-block-list.dropdown-menu li {
  padding: 0;
  margin: 0;
}
.wp-block-list.dropdown-menu a.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: var(--wp--preset--color--text-primary, #212529);
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}
.wp-block-list.dropdown-menu a.dropdown-item:hover,
.wp-block-list.dropdown-menu a.dropdown-item:focus {
  color: var(--wp--preset--color--text-primary, #1e2125);
  background-color: var(--wp--preset--color--surface, #e9ecef);
}
```

The converter preserves Bootstrap classes (`btn-group`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`) and data attributes (`data-bs-toggle`) while using native Gutenberg blocks.

## CSS Library Reference

### Border Utilities
```css
.border          /* 1px solid border */
.border-1 to -5  /* Border widths */
.border-primary  /* Theme color borders */
.border-top/end/bottom/start  /* Side borders */
```

### Rounded Utilities
```css
.rounded         /* Default radius */
.rounded-0 to -5 /* Scaled radii */
.rounded-circle  /* 50% */
.rounded-pill    /* Pill shape */
.rounded-top/end/bottom/start  /* Side radii */
```

### Shadow Utilities
```css
.shadow-none     /* Remove shadow */
.shadow-sm       /* Small shadow */
.shadow          /* Default shadow */
.shadow-lg       /* Large shadow */
.shadow-xl       /* Extra large shadow */
```

### Button Descendant Selectors

For the class version of buttons, utility classes are placed on the wrapper div. The CSS includes descendant selectors to apply styles to the child anchor:

```css
/* When utility class is on wrapper, applies to child link */
.rounded-pill a { border-radius: 50rem !important; }
.shadow-lg a { box-shadow: 0 1rem 3rem rgba(0,0,0,0.175) !important; }
```

### Display Utilities
```css
.d-none          /* Hidden */
.d-block         /* Block display */
.d-flex          /* Flex display */
.d-md-none       /* Hidden at md+ */
.d-none.d-md-block  /* Hidden mobile, visible tablet+ */
```

## Theme.json Compatibility

This tool generates CSS that references WordPress theme.json design tokens. For best results, ensure your theme.json includes these presets:

### Required Color Presets
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
        { "slug": "white", "color": "#FFFFFF" },
        { "slug": "text-muted", "color": "#64748B" },
        { "slug": "border", "color": "#E2E8F0" }
      ]
    }
  }
}
```

### Required Spacing Presets
```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        { "slug": "2xs", "size": "0.25rem" },
        { "slug": "xs", "size": "0.5rem" },
        { "slug": "sm", "size": "0.75rem" },
        { "slug": "md", "size": "1rem" },
        { "slug": "lg", "size": "1.5rem" },
        { "slug": "xl", "size": "2rem" },
        { "slug": "2-xl", "size": "3rem" }
      ]
    }
  }
}
```

### Optional Shadow Presets
```json
{
  "settings": {
    "shadow": {
      "presets": [
        { "slug": "sm", "shadow": "0 0.125rem 0.25rem rgba(0,0,0,0.075)" },
        { "slug": "md", "shadow": "0 0.5rem 1rem rgba(0,0,0,0.15)" },
        { "slug": "lg", "shadow": "0 1rem 3rem rgba(0,0,0,0.175)" }
      ]
    }
  }
}
```

## Usage in WordPress Patterns

After converting, paste the output into a PHP pattern file:

```php
<?php
/**
 * Title: Hero Section
 * Slug: theme-name/hero
 * Categories: featured
 */
?>
<!-- Paste converted Gutenberg markup here -->
```

## Limitations

1. **Responsive Breakpoints**: Column widths (col-md-6, col-lg-4) use the largest specified width
2. **Complex Grids**: Nested rows and complex responsive layouts may need manual adjustment
3. **Form Validation**: Bootstrap's validation states don't have direct Gutenberg equivalents
4. **Some Components**: Carousel, Modal, Offcanvas, Pagination, Progress, Spinners, Toasts output as wp:html

## Development

Single HTML file with embedded CSS and JavaScript. No build process or dependencies required.

### File Structure
```
bootToGutenberg/
├── bootToGutenberg.html           # Main converter tool
├── README.md                      # This file
└── css/
    ├── bootToGutenberg.css        # Tool UI styles
    ├── wordpress_theme_styles.css # Starter CSS for frontend
    └── wordpress_editor_styles.css # Starter CSS for editor
```

### Extending the CSS Library

Add custom entries to the `cssLibrary` object in the HTML file:

```javascript
cssLibrary['my-component'] = {
    name: 'My Component',
    type: 'component',  // or 'utility'
    maps: 'optional mapping description',
    css: `.my-component {
    padding: var(--wp--preset--spacing--md, 1rem);
    color: var(--wp--preset--color--primary);
}`
};
```

## License

MIT License - Use freely in your WordPress development workflow.
