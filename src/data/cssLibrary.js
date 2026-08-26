/**
 * CSS Library Module
 *
 * This module contains the theme mapping configuration and CSS component library
 * for converting Bootstrap 5.3 classes to WordPress Gutenberg-compatible CSS.
 *
 * The cssLibrary object maps Bootstrap component class names to their WordPress
 * theme-aware CSS implementations, using CSS custom properties from theme.json.
 *
 * @module cssLibrary
 */

/**
 * Theme mapping configuration for Bootstrap to WordPress CSS variable translation.
 * Maps Bootstrap color names and spacing values to WordPress theme.json CSS custom properties.
 *
 * @type {Object}
 * @property {Object} colors - Color name mappings (Bootstrap -> WordPress CSS variable)
 * @property {Object} spacing - Spacing scale mappings (Bootstrap numbers -> WordPress spacing slugs)
 * @property {string} radius - Default border radius CSS variable
 */
export const themeMapping = {
  colors: {
    'primary': '--wp--preset--color--primary',
    'secondary': '--wp--preset--color--secondary',
    'success': '--wp--preset--color--success',
    'danger': '--wp--preset--color--error',
    'warning': '--wp--preset--color--warning',
    'info': '--wp--preset--color--info',
    'light': '--wp--preset--color--surface',
    'dark': '--wp--preset--color--dark',
    'white': '--wp--preset--color--white',
    'muted': '--wp--preset--color--text-muted'
  },
  spacing: {
    '1': '--wp--preset--spacing--2xs',
    '2': '--wp--preset--spacing--xs',
    '3': '--wp--preset--spacing--sm',
    '4': '--wp--preset--spacing--md',
    '5': '--wp--preset--spacing--lg'
  },
  radius: '--wp--preset--spacing--xs'
};

/**
 * CSS component library containing Bootstrap component styles adapted for WordPress.
 * Each entry contains:
 * - name: Human-readable component name
 * - type: Category ('component', 'utility', 'typography')
 * - css: CSS template string using WordPress CSS custom properties
 * - maps: (optional) Bootstrap color/theme mapping info
 *
 * @type {Object.<string, {name: string, type: string, css: string, maps?: string}>}
 */
export const cssLibrary = {
  // ===== COMPONENT STYLES =====
  'card-group': {
    name: 'Card Group',
    type: 'component',
    css: `/* Card Group - Horizontal card layout */
.card-group.wp-block-columns {
    gap: 0;
}
.card-group.wp-block-columns > .wp-block-column {
    border: 1px solid var(--wp--preset--color--border, #dee2e6);
    border-radius: 0;
}
.card-group.wp-block-columns > .wp-block-column:first-child {
    border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
    border-bottom-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.card-group.wp-block-columns > .wp-block-column:last-child {
    border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
    border-bottom-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.card-group.wp-block-columns > .wp-block-column:not(:last-child) {
    border-right: 0;
}`
  },
  'card': {
    name: 'Card',
    type: 'component',
    css: `/* Card - Container with border and shadow */
.card.wp-block-column,
.card.wp-block-group {
    background: var(--wp--preset--color--white, #fff);
    border: 1px solid var(--wp--preset--color--border, #dee2e6);
    border-radius: var(--wp--preset--spacing--xs, 0.375rem);
    overflow: hidden;
}`
  },
  'card-body': {
    name: 'Card Body',
    type: 'component',
    css: `/* Card Body - Padded content area */
.card-body.wp-block-group {
    padding: var(--wp--preset--spacing--md, 1rem);
}`
  },
  'card-title': {
    name: 'Card Title',
    type: 'component',
    css: `/* Card Title */
.card-title.wp-block-heading {
    margin-bottom: var(--wp--preset--spacing--xs, 0.5rem);
    font-size: var(--wp--preset--font-size--large, 1.25rem);
    font-weight: 500;
}`
  },
  'card-text': {
    name: 'Card Text',
    type: 'component',
    css: `/* Card Text */
p.card-text {
    color: var(--wp--preset--color--text-muted, #6c757d);
    margin-bottom: var(--wp--preset--spacing--md, 1rem);
}`
  },
  'card-img-top': {
    name: 'Card Image Top',
    type: 'component',
    css: `/* Card Image Top */
.card-img-top.wp-block-image {
    margin: 0;
}
.card-img-top.wp-block-image img {
    width: 100%;
    border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
    border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
}`
  },
  'card-header': {
    name: 'Card Header',
    type: 'component',
    css: `/* Card Header */
.card-header.wp-block-group {
    padding: var(--wp--preset--spacing--xs, 0.5rem) var(--wp--preset--spacing--md, 1rem);
    background-color: var(--wp--preset--color--surface, rgba(0, 0, 0, 0.03));
    border-bottom: 1px solid var(--wp--preset--color--border, #dee2e6);
}`
  },
  'card-footer': {
    name: 'Card Footer',
    type: 'component',
    css: `/* Card Footer */
.card-footer.wp-block-group {
    padding: var(--wp--preset--spacing--xs, 0.5rem) var(--wp--preset--spacing--md, 1rem);
    background-color: var(--wp--preset--color--surface, rgba(0, 0, 0, 0.03));
    border-top: 1px solid var(--wp--preset--color--border, #dee2e6);
}`
  },
  'list-group': {
    name: 'List Group',
    type: 'component',
    css: `/* List Group */
.list-group.wp-block-list {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    border-radius: var(--wp--preset--spacing--xs, 0.375rem);
    overflow: hidden;
    list-style: none;
}`
  },
  'list-group-item': {
    name: 'List Group Item',
    type: 'component',
    css: `/* List Group Item */
.list-group.wp-block-list > li.list-group-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--wp--preset--spacing--xs, 0.5rem) var(--wp--preset--spacing--md, 1rem);
    background-color: var(--wp--preset--color--white, #fff);
    border: 1px solid var(--wp--preset--color--border, rgba(0, 0, 0, 0.125));
    margin-top: -1px;
}
.list-group.wp-block-list > li.list-group-item:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    margin-top: 0;
}
.list-group.wp-block-list > li.list-group-item:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
}`
  },

  // ===== TABLE =====
  'table': {
    name: 'Table',
    type: 'component',
    css: `/* Table - WordPress native table with Bootstrap-inspired styling */
.wp-block-table table {
    width: 100%;
    margin-bottom: var(--wp--preset--spacing--md, 1rem);
    border-collapse: collapse;
}
.wp-block-table th,
.wp-block-table td {
    padding: var(--wp--preset--spacing--xs, 0.5rem);
    vertical-align: top;
    border-top: 1px solid var(--wp--preset--color--border, #dee2e6);
}
.wp-block-table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid var(--wp--preset--color--border, #dee2e6);
    background-color: var(--wp--preset--color--surface, #f8f9fa);
}`
  },
  'table-bordered': {
    name: 'Table Bordered',
    type: 'component',
    css: `/* Table Bordered */
.table-bordered.wp-block-table table,
.table-bordered.wp-block-table th,
.table-bordered.wp-block-table td {
    border: 1px solid var(--wp--preset--color--border, #dee2e6);
}`
  },
  'table-hover': {
    name: 'Table Hover',
    type: 'component',
    css: `/* Table Hover */
.table-hover.wp-block-table tbody tr:hover {
    background-color: var(--wp--preset--color--surface, rgba(0, 0, 0, 0.075));
}`
  },
  'table-sm': {
    name: 'Table Compact',
    type: 'component',
    css: `/* Table Compact */
.table-sm.wp-block-table th,
.table-sm.wp-block-table td {
    padding: var(--wp--preset--spacing--2xs, 0.25rem);
}`
  },

  // ===== ACCORDION =====
  'accordion': {
    name: 'Accordion',
    type: 'component',
    css: `/* Accordion Container */
.accordion {
    --bs-accordion-bg: var(--wp--preset--color--white, #fff);
    --bs-accordion-border-color: var(--wp--preset--color--border, rgba(0, 0, 0, 0.125));
    --bs-accordion-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--wp--preset--color--primary), 0.25);
}`
  },
  'accordion-item': {
    name: 'Accordion Item',
    type: 'component',
    css: `/* Accordion Item */
.accordion-item {
    color: var(--wp--preset--color--text, #212529);
    background-color: var(--wp--preset--color--white, #fff);
    border: 1px solid var(--wp--preset--color--border, rgba(0, 0, 0, 0.125));
}
.accordion-item:first-of-type {
    border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
    border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.accordion-item:last-of-type {
    border-bottom-left-radius: var(--wp--preset--spacing--xs, 0.375rem);
    border-bottom-right-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.accordion-item:not(:first-of-type) {
    border-top: 0;
}`
  },
  'accordion-button': {
    name: 'Accordion Button',
    type: 'component',
    css: `/* Accordion Button with Arrow */
.accordion-button {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--wp--preset--spacing--md, 1rem) var(--wp--preset--spacing--lg, 1.25rem);
    font-size: 1rem;
    color: var(--wp--preset--color--text, #212529);
    text-align: left;
    background-color: var(--wp--preset--color--white, #fff);
    border: 0;
    overflow-anchor: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.accordion-button:not(.collapsed) {
    color: var(--wp--preset--color--primary, #0c63e4);
    background-color: var(--wp--preset--color--surface, #e7f1ff);
}
.accordion-button::after {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-left: auto;
    content: "";
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-size: 1.25rem;
    transition: transform 0.2s ease-in-out;
}
.accordion-button:not(.collapsed)::after {
    transform: rotate(-180deg);
}
.accordion-button:focus {
    z-index: 3;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}`
  },
  'accordion-body': {
    name: 'Accordion Body',
    type: 'component',
    css: `/* Accordion Body */
.accordion-body {
    padding: var(--wp--preset--spacing--md, 1rem) var(--wp--preset--spacing--lg, 1.25rem);
}
.accordion-collapse {
    border-top: 0;
}`
  },

  // ===== ALERTS =====
  'alert': {
    name: 'Alert',
    type: 'component',
    css: `/* Alert Base */
.alert {
    position: relative;
    padding: var(--wp--preset--spacing--md, 1rem);
    margin-bottom: var(--wp--preset--spacing--md, 1rem);
    border: 1px solid transparent;
    border-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.bi {
    width: 1em;
    height: 1em;
    vertical-align: -.125em;
    fill: currentcolor;
}
.alert .bi {
    flex-shrink: 0;
    margin-right: var(--wp--preset--spacing--xs, 0.5rem);
}`
  },
  'alert-primary': {
    name: 'Alert Primary',
    type: 'component',
    maps: 'primary',
    css: `/* Alert Primary */
.alert-primary {
    color: color-mix(in srgb, var(--wp--preset--color--primary) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--primary) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--primary) 30%, #fff);
}`
  },
  'alert-secondary': {
    name: 'Alert Secondary',
    type: 'component',
    maps: 'secondary',
    css: `/* Alert Secondary */
.alert-secondary {
    color: color-mix(in srgb, var(--wp--preset--color--secondary) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--secondary) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--secondary) 30%, #fff);
}`
  },
  'alert-success': {
    name: 'Alert Success',
    type: 'component',
    maps: 'success',
    css: `/* Alert Success */
.alert-success {
    color: color-mix(in srgb, var(--wp--preset--color--success) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--success) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--success) 30%, #fff);
}`
  },
  'alert-danger': {
    name: 'Alert Danger',
    type: 'component',
    maps: 'error',
    css: `/* Alert Danger */
.alert-danger {
    color: color-mix(in srgb, var(--wp--preset--color--error) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--error) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--error) 30%, #fff);
}`
  },
  'alert-warning': {
    name: 'Alert Warning',
    type: 'component',
    maps: 'warning',
    css: `/* Alert Warning */
.alert-warning {
    color: color-mix(in srgb, var(--wp--preset--color--warning) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--warning) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--warning) 30%, #fff);
}`
  },
  'alert-info': {
    name: 'Alert Info',
    type: 'component',
    maps: 'info',
    css: `/* Alert Info */
.alert-info {
    color: color-mix(in srgb, var(--wp--preset--color--info, #0dcaf0) 60%, #000);
    background-color: color-mix(in srgb, var(--wp--preset--color--info, #0dcaf0) 20%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--info, #0dcaf0) 30%, #fff);
}`
  },
  'alert-light': {
    name: 'Alert Light',
    type: 'component',
    css: `/* Alert Light */
.alert-light {
    color: #636464;
    background-color: var(--wp--preset--color--surface, #fefefe);
    border-color: var(--wp--preset--color--border, #fdfdfe);
}`
  },
  'alert-dark': {
    name: 'Alert Dark',
    type: 'component',
    maps: 'dark',
    css: `/* Alert Dark */
.alert-dark {
    color: color-mix(in srgb, var(--wp--preset--color--dark) 60%, #fff);
    background-color: color-mix(in srgb, var(--wp--preset--color--dark) 80%, #fff);
    border-color: color-mix(in srgb, var(--wp--preset--color--dark) 70%, #fff);
}`
  },
  'alert-dismissible': {
    name: 'Alert Dismissible',
    type: 'component',
    css: `/* Alert Dismissible - btn-close variables */
:root {
    --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414'/%3e%3c/svg%3e");
    --bs-btn-close-color: #000;
    --bs-btn-close-opacity: 0.8;
    --bs-btn-close-hover-opacity: 0.75;
    --bs-btn-close-focus-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    --bs-btn-close-focus-opacity: 1;
    --bs-btn-close-disabled-opacity: 0.25;
    --bs-btn-close-filter: brightness(0) saturate(100%) invert(40%);
}

/* btn-close base */
.btn-close {
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: 0.25em 0.25em;
    color: var(--bs-btn-close-color);
    background: transparent var(--bs-btn-close-bg) center / 1em auto no-repeat;
    filter: var(--bs-btn-close-filter);
    border: 0;
    border-radius: 0.375rem;
    opacity: var(--bs-btn-close-opacity);
}
.btn-close:hover {
    color: var(--bs-btn-close-color);
    text-decoration: none;
    opacity: var(--bs-btn-close-hover-opacity);
    cursor: pointer;
}

/* Alert Dismissible */
.alert-dismissible {
    padding-right: 3rem;
}
.alert-dismissible .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    padding: 1.25rem 1rem;
}`
  },
  'lead': {
    name: 'Lead Paragraph',
    type: 'typography',
    css: `/* Lead paragraph */
p.lead {
    font-size: var(--wp--preset--font-size--large, 1.25rem);
    font-weight: 300;
}`
  },
  'text-muted': {
    name: 'Muted Text',
    type: 'utility',
    css: `/* Muted text - uses theme variable */
.text-muted {
    color: var(--wp--preset--color--text-muted, #6c757d) !important;
}`
  },

  // ===== BADGE =====
  'badge': {
    name: 'Badge',
    type: 'component',
    css: `/* Badge - uses theme colors */
.badge {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: 0.75em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: var(--wp--preset--spacing--xs, 0.375rem);
}
.badge.rounded-pill {
    border-radius: 50rem;
}
p.badge {
    margin: 0;
}`
  },
  'breadcrumb': {
    name: 'Breadcrumb',
    type: 'component',
    css: `/* Breadcrumb Navigation */
.breadcrumb {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin-bottom: var(--wp--preset--spacing--md, 1rem);
    list-style: none;
    background-color: transparent;
}
.breadcrumb-item + .breadcrumb-item {
    padding-left: var(--wp--preset--spacing--xs, 0.5rem);
}
.breadcrumb-item + .breadcrumb-item::before {
    float: left;
    padding-right: var(--wp--preset--spacing--xs, 0.5rem);
    color: var(--wp--preset--color--text-muted, #6c757d);
    content: "/";
}
.breadcrumb-item.active {
    color: var(--wp--preset--color--text-muted, #6c757d);
}
.breadcrumb-item a {
    color: var(--wp--preset--color--primary);
    text-decoration: none;
}
.breadcrumb-item a:hover {
    text-decoration: underline;
}`
  },
  'btn-group': {
    name: 'Button Group',
    type: 'component',
    css: `/* Button Group - wp-block-buttons */
.btn-group.wp-block-buttons {
    gap: 0;
}
.btn-group.wp-block-buttons .wp-block-button .wp-block-button__link {
    border-radius: 0 !important;
}
.btn-group.wp-block-buttons .wp-block-button:first-child .wp-block-button__link {
    border-top-left-radius: 0.375rem !important;
    border-bottom-left-radius: 0.375rem !important;
}
.btn-group.wp-block-buttons .wp-block-button:last-child .wp-block-button__link {
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
}
.btn-group.wp-block-buttons .wp-block-button:not(:last-child) .wp-block-button__link {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
}

/* Button Group - wp-block-group */
.btn-group.wp-block-group {
    display: flex;
    gap: 0;
}
.btn-group.wp-block-group .wp-block-button .wp-block-button__link {
    border-radius: 0 !important;
}
.btn-group.wp-block-group .wp-block-button:first-child .wp-block-button__link {
    border-top-left-radius: 0.375rem !important;
    border-bottom-left-radius: 0.375rem !important;
}
.btn-group.wp-block-group .wp-block-button:last-child .wp-block-button__link {
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
}
.btn-group.wp-block-group .wp-block-button:not(:last-child) .wp-block-button__link {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
}`
  },
  'collapse': {
    name: 'Collapse',
    type: 'component',
    css: `/* Collapse - Bootstrap JS required */
.collapse.wp-block-group {
    display: none;
    border: 1px solid var(--wp--preset--color--border);
    border-radius: 0.375rem;
}
.collapse.show.wp-block-group {
    display: block;
}
.collapsing.wp-block-group {
    height: 0;
    overflow: hidden;
    transition: height 0.35s ease;
}`
  },
  'dropdown': {
    name: 'Dropdown',
    type: 'component',
    css: `/* Dropdown - Bootstrap JS required */
.dropdown.wp-block-group {
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
.dropdown-menu.wp-block-list {
    position: absolute;
    z-index: 1000;
    display: none;
    min-width: 10rem;
    padding: 0.5rem 0;
    margin: 0;
    background-color: var(--wp--preset--color--white, #fff);
    border: 1px solid var(--wp--preset--color--border, rgba(0,0,0,.15));
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    list-style: none;
    top: 100%;
    left: 0;
}
.dropdown-menu.show.wp-block-list {
    display: block;
}
.dropdown-menu.wp-block-list li {
    list-style: none;
}
.dropdown-menu.wp-block-list a.dropdown-item {
    display: block;
    padding: 0.25rem 1rem;
    color: var(--wp--preset--color--dark, #212529);
    text-decoration: none;
}
.dropdown-menu.wp-block-list a.dropdown-item:hover {
    background-color: var(--wp--preset--color--surface, #f8f9fa);
}
.dropdown-divider {
    height: 0;
    margin: 0.5rem 0;
    overflow: hidden;
    border-top: 1px solid var(--wp--preset--color--border, rgba(0,0,0,.15));
}`
  },

  // ===== UTILITY: Background Colors =====
  'bg-primary': {
    name: 'Background Primary',
    type: 'utility',
    maps: 'primary -> --wp--preset--color--primary',
    css: `.bg-primary { background-color: var(--wp--preset--color--primary) !important; }`
  },
  'bg-secondary': {
    name: 'Background Secondary',
    type: 'utility',
    maps: 'secondary -> --wp--preset--color--secondary',
    css: `.bg-secondary { background-color: var(--wp--preset--color--secondary) !important; }`
  },
  'bg-success': {
    name: 'Background Success',
    type: 'utility',
    maps: 'success -> --wp--preset--color--success',
    css: `.bg-success { background-color: var(--wp--preset--color--success) !important; }`
  },
  'bg-danger': {
    name: 'Background Danger',
    type: 'utility',
    maps: 'danger -> --wp--preset--color--error',
    css: `.bg-danger { background-color: var(--wp--preset--color--error) !important; }`
  },
  'bg-warning': {
    name: 'Background Warning',
    type: 'utility',
    maps: 'warning -> --wp--preset--color--warning',
    css: `.bg-warning { background-color: var(--wp--preset--color--warning) !important; }`
  },
  'bg-light': {
    name: 'Background Light',
    type: 'utility',
    maps: 'light -> --wp--preset--color--surface',
    css: `.bg-light { background-color: var(--wp--preset--color--surface) !important; }`
  },
  'bg-dark': {
    name: 'Background Dark',
    type: 'utility',
    maps: 'dark -> --wp--preset--color--dark',
    css: `.bg-dark { background-color: var(--wp--preset--color--dark) !important; }`
  },
  'bg-white': {
    name: 'Background White',
    type: 'utility',
    maps: 'white -> --wp--preset--color--white',
    css: `.bg-white { background-color: var(--wp--preset--color--white) !important; }`
  },

  // ===== UTILITY: Text Colors =====
  'text-primary': {
    name: 'Text Primary',
    type: 'utility',
    maps: 'primary -> --wp--preset--color--primary',
    css: `.text-primary { color: var(--wp--preset--color--primary) !important; }`
  },
  'text-secondary': {
    name: 'Text Secondary',
    type: 'utility',
    maps: 'secondary -> --wp--preset--color--secondary',
    css: `.text-secondary { color: var(--wp--preset--color--secondary) !important; }`
  },
  'text-success': {
    name: 'Text Success',
    type: 'utility',
    maps: 'success -> --wp--preset--color--success',
    css: `.text-success { color: var(--wp--preset--color--success) !important; }`
  },
  'text-danger': {
    name: 'Text Danger',
    type: 'utility',
    maps: 'danger -> --wp--preset--color--error',
    css: `.text-danger { color: var(--wp--preset--color--error) !important; }`
  },
  'text-warning': {
    name: 'Text Warning',
    type: 'utility',
    maps: 'warning -> --wp--preset--color--warning',
    css: `.text-warning { color: var(--wp--preset--color--warning) !important; }`
  },
  'text-light': {
    name: 'Text Light',
    type: 'utility',
    maps: 'light -> --wp--preset--color--surface',
    css: `.text-light { color: var(--wp--preset--color--surface) !important; }`
  },
  'text-dark': {
    name: 'Text Dark',
    type: 'utility',
    maps: 'dark -> --wp--preset--color--dark',
    css: `.text-dark { color: var(--wp--preset--color--dark) !important; }`
  },
  'text-white': {
    name: 'Text White',
    type: 'utility',
    maps: 'white -> --wp--preset--color--white',
    css: `.text-white { color: var(--wp--preset--color--white) !important; }`
  },

  // ===== UTILITY: Combined Text & Background Colors (Bootstrap 5.3) =====
  'text-bg-primary': {
    name: 'Text/BG Primary',
    type: 'utility',
    maps: 'primary',
    css: `.text-bg-primary { color: #fff !important; background-color: var(--wp--preset--color--primary) !important; }`
  },
  'text-bg-secondary': {
    name: 'Text/BG Secondary',
    type: 'utility',
    maps: 'secondary',
    css: `.text-bg-secondary { color: #fff !important; background-color: var(--wp--preset--color--secondary) !important; }`
  },
  'text-bg-success': {
    name: 'Text/BG Success',
    type: 'utility',
    maps: 'success',
    css: `.text-bg-success { color: #fff !important; background-color: var(--wp--preset--color--success) !important; }`
  },
  'text-bg-danger': {
    name: 'Text/BG Danger',
    type: 'utility',
    maps: 'error',
    css: `.text-bg-danger { color: #fff !important; background-color: var(--wp--preset--color--error) !important; }`
  },
  'text-bg-warning': {
    name: 'Text/BG Warning',
    type: 'utility',
    maps: 'warning',
    css: `.text-bg-warning { color: #000 !important; background-color: var(--wp--preset--color--warning) !important; }`
  },
  'text-bg-info': {
    name: 'Text/BG Info',
    type: 'utility',
    maps: 'info',
    css: `.text-bg-info { color: #000 !important; background-color: var(--wp--preset--color--info, #0dcaf0) !important; }`
  },
  'text-bg-light': {
    name: 'Text/BG Light',
    type: 'utility',
    maps: 'surface',
    css: `.text-bg-light { color: #000 !important; background-color: var(--wp--preset--color--surface) !important; }`
  },
  'text-bg-dark': {
    name: 'Text/BG Dark',
    type: 'utility',
    maps: 'dark',
    css: `.text-bg-dark { color: #fff !important; background-color: var(--wp--preset--color--dark) !important; }`
  },

  // ===== RESPONSIVE UTILITIES =====
  'responsive-flex-utilities': {
    name: 'Responsive Flex & Display',
    type: 'utility',
    maps: 'Bootstrap breakpoints (sm:576px, md:768px, lg:992px, xl:1200px, xxl:1400px)',
    css: `/* Responsive Flex & Display Utilities - Bootstrap Breakpoints */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .flex-sm-row { flex-direction: row !important; }
  .flex-sm-row-reverse { flex-direction: row-reverse !important; }
  .flex-sm-column { flex-direction: column !important; }
  .flex-sm-column-reverse { flex-direction: column-reverse !important; }
  .flex-sm-wrap { flex-wrap: wrap !important; }
  .flex-sm-nowrap { flex-wrap: nowrap !important; }
  .justify-content-sm-start { justify-content: flex-start !important; }
  .justify-content-sm-end { justify-content: flex-end !important; }
  .justify-content-sm-center { justify-content: center !important; }
  .justify-content-sm-between { justify-content: space-between !important; }
  .justify-content-sm-around { justify-content: space-around !important; }
  .justify-content-sm-evenly { justify-content: space-evenly !important; }
  .align-items-sm-start { align-items: flex-start !important; }
  .align-items-sm-end { align-items: flex-end !important; }
  .align-items-sm-center { align-items: center !important; }
  .align-items-sm-baseline { align-items: baseline !important; }
  .align-items-sm-stretch { align-items: stretch !important; }
  .gap-sm-0 { gap: 0 !important; }
  .gap-sm-1 { gap: var(--wp--preset--spacing--2xs, 0.25rem) !important; }
  .gap-sm-2 { gap: var(--wp--preset--spacing--sm, 0.5rem) !important; }
  .gap-sm-3 { gap: var(--wp--preset--spacing--md, 1rem) !important; }
  .gap-sm-4 { gap: var(--wp--preset--spacing--lg, 1.5rem) !important; }
  .gap-sm-5 { gap: var(--wp--preset--spacing--2-xl, 3rem) !important; }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .flex-md-row { flex-direction: row !important; }
  .flex-md-row-reverse { flex-direction: row-reverse !important; }
  .flex-md-column { flex-direction: column !important; }
  .flex-md-column-reverse { flex-direction: column-reverse !important; }
  .flex-md-wrap { flex-wrap: wrap !important; }
  .flex-md-nowrap { flex-wrap: nowrap !important; }
  .justify-content-md-start { justify-content: flex-start !important; }
  .justify-content-md-end { justify-content: flex-end !important; }
  .justify-content-md-center { justify-content: center !important; }
  .justify-content-md-between { justify-content: space-between !important; }
  .justify-content-md-around { justify-content: space-around !important; }
  .justify-content-md-evenly { justify-content: space-evenly !important; }
  .align-items-md-start { align-items: flex-start !important; }
  .align-items-md-end { align-items: flex-end !important; }
  .align-items-md-center { align-items: center !important; }
  .align-items-md-baseline { align-items: baseline !important; }
  .align-items-md-stretch { align-items: stretch !important; }
  .gap-md-0 { gap: 0 !important; }
  .gap-md-1 { gap: var(--wp--preset--spacing--2xs, 0.25rem) !important; }
  .gap-md-2 { gap: var(--wp--preset--spacing--sm, 0.5rem) !important; }
  .gap-md-3 { gap: var(--wp--preset--spacing--md, 1rem) !important; }
  .gap-md-4 { gap: var(--wp--preset--spacing--lg, 1.5rem) !important; }
  .gap-md-5 { gap: var(--wp--preset--spacing--2-xl, 3rem) !important; }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .flex-lg-row { flex-direction: row !important; }
  .flex-lg-row-reverse { flex-direction: row-reverse !important; }
  .flex-lg-column { flex-direction: column !important; }
  .flex-lg-column-reverse { flex-direction: column-reverse !important; }
  .flex-lg-wrap { flex-wrap: wrap !important; }
  .flex-lg-nowrap { flex-wrap: nowrap !important; }
  .justify-content-lg-start { justify-content: flex-start !important; }
  .justify-content-lg-end { justify-content: flex-end !important; }
  .justify-content-lg-center { justify-content: center !important; }
  .justify-content-lg-between { justify-content: space-between !important; }
  .justify-content-lg-around { justify-content: space-around !important; }
  .justify-content-lg-evenly { justify-content: space-evenly !important; }
  .align-items-lg-start { align-items: flex-start !important; }
  .align-items-lg-end { align-items: flex-end !important; }
  .align-items-lg-center { align-items: center !important; }
  .align-items-lg-baseline { align-items: baseline !important; }
  .align-items-lg-stretch { align-items: stretch !important; }
  .gap-lg-0 { gap: 0 !important; }
  .gap-lg-1 { gap: var(--wp--preset--spacing--2xs, 0.25rem) !important; }
  .gap-lg-2 { gap: var(--wp--preset--spacing--sm, 0.5rem) !important; }
  .gap-lg-3 { gap: var(--wp--preset--spacing--md, 1rem) !important; }
  .gap-lg-4 { gap: var(--wp--preset--spacing--lg, 1.5rem) !important; }
  .gap-lg-5 { gap: var(--wp--preset--spacing--2-xl, 3rem) !important; }
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .flex-xl-row { flex-direction: row !important; }
  .flex-xl-row-reverse { flex-direction: row-reverse !important; }
  .flex-xl-column { flex-direction: column !important; }
  .flex-xl-column-reverse { flex-direction: column-reverse !important; }
  .flex-xl-wrap { flex-wrap: wrap !important; }
  .flex-xl-nowrap { flex-wrap: nowrap !important; }
  .justify-content-xl-start { justify-content: flex-start !important; }
  .justify-content-xl-end { justify-content: flex-end !important; }
  .justify-content-xl-center { justify-content: center !important; }
  .justify-content-xl-between { justify-content: space-between !important; }
  .justify-content-xl-around { justify-content: space-around !important; }
  .justify-content-xl-evenly { justify-content: space-evenly !important; }
  .align-items-xl-start { align-items: flex-start !important; }
  .align-items-xl-end { align-items: flex-end !important; }
  .align-items-xl-center { align-items: center !important; }
  .align-items-xl-baseline { align-items: baseline !important; }
  .align-items-xl-stretch { align-items: stretch !important; }
  .gap-xl-0 { gap: 0 !important; }
  .gap-xl-1 { gap: var(--wp--preset--spacing--2xs, 0.25rem) !important; }
  .gap-xl-2 { gap: var(--wp--preset--spacing--sm, 0.5rem) !important; }
  .gap-xl-3 { gap: var(--wp--preset--spacing--md, 1rem) !important; }
  .gap-xl-4 { gap: var(--wp--preset--spacing--lg, 1.5rem) !important; }
  .gap-xl-5 { gap: var(--wp--preset--spacing--2-xl, 3rem) !important; }
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .flex-xxl-row { flex-direction: row !important; }
  .flex-xxl-row-reverse { flex-direction: row-reverse !important; }
  .flex-xxl-column { flex-direction: column !important; }
  .flex-xxl-column-reverse { flex-direction: column-reverse !important; }
  .flex-xxl-wrap { flex-wrap: wrap !important; }
  .flex-xxl-nowrap { flex-wrap: nowrap !important; }
  .justify-content-xxl-start { justify-content: flex-start !important; }
  .justify-content-xxl-end { justify-content: flex-end !important; }
  .justify-content-xxl-center { justify-content: center !important; }
  .justify-content-xxl-between { justify-content: space-between !important; }
  .justify-content-xxl-around { justify-content: space-around !important; }
  .justify-content-xxl-evenly { justify-content: space-evenly !important; }
  .align-items-xxl-start { align-items: flex-start !important; }
  .align-items-xxl-end { align-items: flex-end !important; }
  .align-items-xxl-center { align-items: center !important; }
  .align-items-xxl-baseline { align-items: baseline !important; }
  .align-items-xxl-stretch { align-items: stretch !important; }
  .gap-xxl-0 { gap: 0 !important; }
  .gap-xxl-1 { gap: var(--wp--preset--spacing--2xs, 0.25rem) !important; }
  .gap-xxl-2 { gap: var(--wp--preset--spacing--sm, 0.5rem) !important; }
  .gap-xxl-3 { gap: var(--wp--preset--spacing--md, 1rem) !important; }
  .gap-xxl-4 { gap: var(--wp--preset--spacing--lg, 1.5rem) !important; }
  .gap-xxl-5 { gap: var(--wp--preset--spacing--2-xl, 3rem) !important; }
}

/* ===== DISPLAY UTILITIES ===== */

/* Base display utilities (applies to all screen sizes) */
.d-none { display: none !important; }
.d-inline { display: inline !important; }
.d-inline-block { display: inline-block !important; }
.d-block { display: block !important; }
.d-grid { display: grid !important; }
.d-inline-grid { display: inline-grid !important; }
.d-table { display: table !important; }
.d-table-row { display: table-row !important; }
.d-table-cell { display: table-cell !important; }
.d-flex { display: flex !important; }
.d-inline-flex { display: inline-flex !important; }

/* Small devices (576px and up) */
@media (min-width: 576px) {
  .d-sm-none { display: none !important; }
  .d-sm-inline { display: inline !important; }
  .d-sm-inline-block { display: inline-block !important; }
  .d-sm-block { display: block !important; }
  .d-sm-grid { display: grid !important; }
  .d-sm-inline-grid { display: inline-grid !important; }
  .d-sm-table { display: table !important; }
  .d-sm-table-row { display: table-row !important; }
  .d-sm-table-cell { display: table-cell !important; }
  .d-sm-flex { display: flex !important; }
  .d-sm-inline-flex { display: inline-flex !important; }
}

/* Medium devices (768px and up) */
@media (min-width: 768px) {
  .d-md-none { display: none !important; }
  .d-md-inline { display: inline !important; }
  .d-md-inline-block { display: inline-block !important; }
  .d-md-block { display: block !important; }
  .d-md-grid { display: grid !important; }
  .d-md-inline-grid { display: inline-grid !important; }
  .d-md-table { display: table !important; }
  .d-md-table-row { display: table-row !important; }
  .d-md-table-cell { display: table-cell !important; }
  .d-md-flex { display: flex !important; }
  .d-md-inline-flex { display: inline-flex !important; }
}

/* Large devices (992px and up) */
@media (min-width: 992px) {
  .d-lg-none { display: none !important; }
  .d-lg-inline { display: inline !important; }
  .d-lg-inline-block { display: inline-block !important; }
  .d-lg-block { display: block !important; }
  .d-lg-grid { display: grid !important; }
  .d-lg-inline-grid { display: inline-grid !important; }
  .d-lg-table { display: table !important; }
  .d-lg-table-row { display: table-row !important; }
  .d-lg-table-cell { display: table-cell !important; }
  .d-lg-flex { display: flex !important; }
  .d-lg-inline-flex { display: inline-flex !important; }
}

/* X-Large devices (1200px and up) */
@media (min-width: 1200px) {
  .d-xl-none { display: none !important; }
  .d-xl-inline { display: inline !important; }
  .d-xl-inline-block { display: inline-block !important; }
  .d-xl-block { display: block !important; }
  .d-xl-grid { display: grid !important; }
  .d-xl-inline-grid { display: inline-grid !important; }
  .d-xl-table { display: table !important; }
  .d-xl-table-row { display: table-row !important; }
  .d-xl-table-cell { display: table-cell !important; }
  .d-xl-flex { display: flex !important; }
  .d-xl-inline-flex { display: inline-flex !important; }
}

/* XX-Large devices (1400px and up) */
@media (min-width: 1400px) {
  .d-xxl-none { display: none !important; }
  .d-xxl-inline { display: inline !important; }
  .d-xxl-inline-block { display: inline-block !important; }
  .d-xxl-block { display: block !important; }
  .d-xxl-grid { display: grid !important; }
  .d-xxl-inline-grid { display: inline-grid !important; }
  .d-xxl-table { display: table !important; }
  .d-xxl-table-row { display: table-row !important; }
  .d-xxl-table-cell { display: table-cell !important; }
  .d-xxl-flex { display: flex !important; }
  .d-xxl-inline-flex { display: inline-flex !important; }
}`
  },

  // ===== BORDER UTILITIES =====
  'border-utilities': {
    name: 'Border & Rounded',
    type: 'utility',
    maps: 'theme border color + scaled widths/radii',
    css: `/* Border Utilities - uses theme border color */
.border { border: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-0 { border: 0 !important; }
.border-1 { border-width: 1px !important; }
.border-2 { border-width: 2px !important; }
.border-3 { border-width: 3px !important; }
.border-4 { border-width: 4px !important; }
.border-5 { border-width: 5px !important; }

/* Border sides */
.border-top { border-top: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-end { border-right: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-bottom { border-bottom: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-start { border-left: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-top-0 { border-top: 0 !important; }
.border-end-0 { border-right: 0 !important; }
.border-bottom-0 { border-bottom: 0 !important; }
.border-start-0 { border-left: 0 !important; }

/* Border colors - map to theme colors */
.border-primary { border-color: var(--wp--preset--color--primary) !important; }
.border-secondary { border-color: var(--wp--preset--color--secondary) !important; }
.border-success { border-color: var(--wp--preset--color--success) !important; }
.border-danger { border-color: var(--wp--preset--color--error) !important; }
.border-warning { border-color: var(--wp--preset--color--warning) !important; }
.border-info { border-color: var(--wp--preset--color--info, #0dcaf0) !important; }
.border-light { border-color: var(--wp--preset--color--surface) !important; }
.border-dark { border-color: var(--wp--preset--color--dark) !important; }
.border-white { border-color: var(--wp--preset--color--white) !important; }

/* Backend/Editor button link targeting for borders */
.border .wp-block-button__link { border: 1px solid var(--wp--preset--color--border, #dee2e6) !important; }
.border-0 .wp-block-button__link { border: 0 !important; }
.border-1 .wp-block-button__link { border-width: 1px !important; }
.border-2 .wp-block-button__link { border-width: 2px !important; }
.border-3 .wp-block-button__link { border-width: 3px !important; }
.border-4 .wp-block-button__link { border-width: 4px !important; }
.border-5 .wp-block-button__link { border-width: 5px !important; }
.border-primary .wp-block-button__link { border-color: var(--wp--preset--color--primary) !important; }
.border-secondary .wp-block-button__link { border-color: var(--wp--preset--color--secondary) !important; }
.border-success .wp-block-button__link { border-color: var(--wp--preset--color--success) !important; }
.border-danger .wp-block-button__link { border-color: var(--wp--preset--color--error) !important; }
.border-warning .wp-block-button__link { border-color: var(--wp--preset--color--warning) !important; }
.border-info .wp-block-button__link { border-color: var(--wp--preset--color--info, #0dcaf0) !important; }
.border-light .wp-block-button__link { border-color: var(--wp--preset--color--surface) !important; }
.border-dark .wp-block-button__link { border-color: var(--wp--preset--color--dark) !important; }
.border-white .wp-block-button__link { border-color: var(--wp--preset--color--white) !important; }

/* Rounded corners - scaled using theme spacing as base */
.rounded { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-0 { border-radius: 0 !important; }
.rounded-1 { border-radius: calc(var(--wp--preset--spacing--xs, 0.25rem) * 0.5) !important; }
.rounded-2 { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-3 { border-radius: var(--wp--preset--spacing--sm, 0.5rem) !important; }
.rounded-4 { border-radius: var(--wp--preset--spacing--md, 1rem) !important; }
.rounded-5 { border-radius: var(--wp--preset--spacing--lg, 2rem) !important; }
.rounded-circle { border-radius: 50% !important; }
.rounded-pill { border-radius: 50rem !important; }

/* Rounded sides */
.rounded-top { border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-end { border-top-right-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; border-bottom-right-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-bottom { border-bottom-right-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; border-bottom-left-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-start { border-top-left-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; border-bottom-left-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }

/* Descendant selectors - when utility class is on wrapper, apply to child anchor */
.rounded a { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-0 a { border-radius: 0 !important; }
.rounded-1 a { border-radius: calc(var(--wp--preset--spacing--xs, 0.25rem) * 0.5) !important; }
.rounded-2 a { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-3 a { border-radius: var(--wp--preset--spacing--sm, 0.5rem) !important; }
.rounded-4 a { border-radius: var(--wp--preset--spacing--md, 1rem) !important; }
.rounded-5 a { border-radius: var(--wp--preset--spacing--lg, 2rem) !important; }
.rounded-circle a { border-radius: 50% !important; }
.rounded-pill a { border-radius: 50rem !important; }

/* Backend/Editor button link targeting */
.rounded .wp-block-button__link { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-0 .wp-block-button__link { border-radius: 0 !important; }
.rounded-1 .wp-block-button__link { border-radius: calc(var(--wp--preset--spacing--xs, 0.25rem) * 0.5) !important; }
.rounded-2 .wp-block-button__link { border-radius: var(--wp--preset--spacing--xs, 0.375rem) !important; }
.rounded-3 .wp-block-button__link { border-radius: var(--wp--preset--spacing--sm, 0.5rem) !important; }
.rounded-4 .wp-block-button__link { border-radius: var(--wp--preset--spacing--md, 1rem) !important; }
.rounded-5 .wp-block-button__link { border-radius: var(--wp--preset--spacing--lg, 2rem) !important; }
.rounded-circle .wp-block-button__link { border-radius: 50% !important; }
.rounded-pill .wp-block-button__link { border-radius: 50rem !important; }`
  },

  // ===== SHADOW UTILITIES =====
  'shadow-utilities': {
    name: 'Shadow',
    type: 'utility',
    maps: 'theme shadow presets with fallbacks',
    css: `/* Shadow Utilities - uses theme shadow presets with Bootstrap fallbacks */
.shadow-none { box-shadow: none !important; }
.shadow-sm { box-shadow: var(--wp--preset--shadow--sm, 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)) !important; }
.shadow { box-shadow: var(--wp--preset--shadow--md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15)) !important; }
.shadow-lg { box-shadow: var(--wp--preset--shadow--lg, 0 1rem 3rem rgba(0, 0, 0, 0.175)) !important; }

/* Additional shadow variants for theme compatibility */
.shadow-xs { box-shadow: var(--wp--preset--shadow--xs, 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)) !important; }
.shadow-xl { box-shadow: var(--wp--preset--shadow--xl, 0 1.5rem 4rem rgba(0, 0, 0, 0.2)) !important; }

/* Inset shadows */
.shadow-inset { box-shadow: var(--wp--preset--shadow--inset, inset 0 1px 2px rgba(0, 0, 0, 0.075)) !important; }

/* Descendant selectors - when utility class is on wrapper, apply to child anchor */
.shadow-none a { box-shadow: none !important; }
.shadow-sm a { box-shadow: var(--wp--preset--shadow--sm, 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)) !important; }
.shadow a { box-shadow: var(--wp--preset--shadow--md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15)) !important; }
.shadow-lg a { box-shadow: var(--wp--preset--shadow--lg, 0 1rem 3rem rgba(0, 0, 0, 0.175)) !important; }
.shadow-xs a { box-shadow: var(--wp--preset--shadow--xs, 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)) !important; }
.shadow-xl a { box-shadow: var(--wp--preset--shadow--xl, 0 1.5rem 4rem rgba(0, 0, 0, 0.2)) !important; }
.shadow-inset a { box-shadow: var(--wp--preset--shadow--inset, inset 0 1px 2px rgba(0, 0, 0, 0.075)) !important; }

/* Backend/Editor button link targeting */
.shadow-none .wp-block-button__link { box-shadow: none !important; }
.shadow-sm .wp-block-button__link { box-shadow: var(--wp--preset--shadow--sm, 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)) !important; }
.shadow .wp-block-button__link { box-shadow: var(--wp--preset--shadow--md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15)) !important; }
.shadow-lg .wp-block-button__link { box-shadow: var(--wp--preset--shadow--lg, 0 1rem 3rem rgba(0, 0, 0, 0.175)) !important; }
.shadow-xs .wp-block-button__link { box-shadow: var(--wp--preset--shadow--xs, 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)) !important; }
.shadow-xl .wp-block-button__link { box-shadow: var(--wp--preset--shadow--xl, 0 1.5rem 4rem rgba(0, 0, 0, 0.2)) !important; }
.shadow-inset .wp-block-button__link { box-shadow: var(--wp--preset--shadow--inset, inset 0 1px 2px rgba(0, 0, 0, 0.075)) !important; }`
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Returns combined CSS for the given component names.
 * Deduplicates and concatenates CSS from multiple components.
 *
 * @param {string[]} components - Array of component names (keys from cssLibrary)
 * @returns {string} Combined CSS string with all component styles
 *
 * @example
 * const css = getCssForComponents(['card', 'card-body', 'card-title']);
 * // Returns combined CSS for card components
 */
export function getCssForComponents(components) {
  if (!Array.isArray(components) || components.length === 0) {
    return '';
  }

  const cssBlocks = [];
  const seen = new Set();

  for (const componentName of components) {
    // Skip duplicates
    if (seen.has(componentName)) {
      continue;
    }
    seen.add(componentName);

    // Look up component in library
    const component = cssLibrary[componentName];
    if (component && component.css) {
      cssBlocks.push(component.css);
    }
  }

  // Consolidate :root declarations at top of CSS output
  return consolidateCss(cssBlocks);
}

/**
 * Extract :root declarations and consolidate at top of CSS output
 * @param {string[]} cssBlocks - Array of CSS blocks
 * @returns {string} Consolidated CSS with :root at top
 */
function consolidateCss(cssBlocks) {
  let rootVars = [];
  let otherCss = [];

  for (const css of cssBlocks) {
    // Extract :root block if present
    const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
    if (rootMatch) {
      // Extract individual variables from :root
      const vars = rootMatch[1].trim().split('\n').map(v => v.trim()).filter(v => v);
      rootVars.push(...vars);
      // Add remaining CSS (without :root block)
      const withoutRoot = css.replace(/:root\s*\{[^}]+\}\s*/, '').trim();
      if (withoutRoot) {
        otherCss.push(withoutRoot);
      }
    } else {
      otherCss.push(css);
    }
  }

  let output = '/* Bootstrap-inspired styles for Gutenberg blocks */\n';
  output += '/* Generated by Bootstrap to Gutenberg Converter */\n\n';

  // Output consolidated :root at top if we have variables
  if (rootVars.length > 0) {
    // Deduplicate variables (keep last occurrence)
    const varMap = {};
    for (const v of rootVars) {
      const match = v.match(/^\s*(--[^:]+):/);
      if (match) {
        varMap[match[1]] = v;
      }
    }
    output += ':root {\n';
    output += Object.values(varMap).join('\n');
    output += '\n}\n\n';
  }

  // Output remaining CSS
  output += otherCss.join('\n\n');

  return output;
}

/**
 * Returns all components grouped by their type.
 *
 * @returns {Object.<string, Object.<string, {name: string, type: string, css: string, maps?: string}>>}
 *          Object with type names as keys, each containing an object of components of that type
 *
 * @example
 * const grouped = getComponentsByType();
 * // Returns: { component: { card: {...}, alert: {...} }, utility: { 'bg-primary': {...} }, typography: { lead: {...} } }
 */
export function getComponentsByType() {
  const grouped = {};

  for (const [key, value] of Object.entries(cssLibrary)) {
    const type = value.type || 'other';

    if (!grouped[type]) {
      grouped[type] = {};
    }

    grouped[type][key] = value;
  }

  return grouped;
}

export default cssLibrary;
