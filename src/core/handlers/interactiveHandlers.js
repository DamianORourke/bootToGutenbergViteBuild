/**
 * Interactive Handlers
 *
 * Handle Bootstrap JavaScript components:
 * - accordion -> wp:html (preserves Bootstrap JS functionality)
 * - modal -> wp:html
 * - carousel -> wp:html
 * - nav-tabs/nav-pills -> wp:html
 * - collapse -> wp:group with collapse class and anchor
 * - dropdown -> wp:group with dropdown structure
 * - navbar -> wp:html
 * - toast -> wp:html
 *
 * Many of these output as wp:html blocks to preserve
 * Bootstrap's data-bs-* attributes and JS functionality.
 *
 * Extracted from bootToGutenberg.html lines 1225-1251, 1505-1610
 *
 * Note: All functions are bound to the converter instance via _bindMethods()
 */

/**
 * Handle Bootstrap accordion
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleAccordion(el) {
  // Use wp:html for entire accordion to preserve all Bootstrap structure
  this.trackCss('accordion')
  this.trackCss('accordion-item')
  this.trackCss('accordion-button')
  this.trackCss('accordion-body')
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle accordion item (fallback, not usually called directly)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleAccordionItem(el) {
  // This won't be called since handleAccordion handles the whole thing
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle accordion header (fallback, not usually called directly)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleAccordionHeader(el) {
  // This won't be called since handleAccordion handles the whole thing
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle accordion collapse (fallback, not usually called directly)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleAccordionCollapse(el) {
  // This won't be called since handleAccordion handles the whole thing
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap modal
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleModal(el) {
  // Use wp:html for modal to preserve all Bootstrap structure and data attributes
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap carousel
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleCarousel(el) {
  // Use wp:html for carousel to preserve all Bootstrap structure and data attributes
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap nav-tabs or nav-pills
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleNavTabs(el) {
  // Nav tabs use data-bs-toggle and data-bs-target attributes
  // Use wp:html to preserve Bootstrap JS functionality
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle nav item (fallback, not usually called directly)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleNavItem(el) {
  // This won't be called since handleNavTabs handles the whole nav
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap tab-content
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleTabContent(el) {
  // Tab content panes have IDs that are targeted by nav tabs
  // Use wp:html to preserve Bootstrap JS functionality
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap collapse
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleCollapse(el) {
  // Collapse content -> wp:group with collapse class and ID
  this.trackCss('collapse')

  const collapseId = el.getAttribute('id') || ''
  const attrs = {
    className: 'collapse',
    layout: { type: 'constrained' }
  }

  // Add ID as anchor if present
  if (collapseId) {
    attrs.anchor = collapseId
  }

  // Process inner content
  const innerContent = this.processChildren(el)

  return this.wrapBlock('wp:group', attrs,
    '<div class="wp-block-group collapse" id="' + collapseId + '">' + innerContent + '</div>'
  )
}

/**
 * Handle Bootstrap dropdown
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleDropdown(el) {
  // Convert dropdown to native blocks while preserving Bootstrap classes/attributes
  this.trackCss('dropdown')

  // Find the trigger button and dropdown menu
  const triggerBtn = el.querySelector('[data-bs-toggle="dropdown"]')
  const dropdownMenu = el.querySelector('.dropdown-menu')

  if (!triggerBtn || !dropdownMenu) {
    // Fallback to wp:html if structure is unexpected
    return this.wrapHtmlBlock(el.outerHTML)
  }

  let output = ''

  // Convert the trigger button using shared handler
  output += this.handleDropdownToggleButton(triggerBtn)

  // Convert the dropdown menu using shared handler
  output += this.handleDropdownMenu(dropdownMenu)

  // Wrap in group with dropdown class
  const groupAttrs = {
    className: 'dropdown',
    layout: { type: 'flex', flexWrap: 'nowrap' }
  }

  return this.wrapBlock('wp:group', groupAttrs,
    '<div class="wp-block-group dropdown">' + output + '</div>'
  )
}

/**
 * Handle Bootstrap navbar
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleNavbar(el) {
  // Navbars contain togglers, collapse elements, and dropdowns
  // Use wp:html to preserve all Bootstrap JS functionality
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}

/**
 * Handle Bootstrap toast
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleToast(el) {
  // Toasts use data-bs-* attributes for auto-hide behavior
  // Use wp:html to preserve Bootstrap JS functionality
  const html = el.outerHTML
  return this.wrapHtmlBlock(html)
}
