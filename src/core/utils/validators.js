/**
 * Validator Utilities
 *
 * Boolean checks for element classification and validation.
 * These functions determine element types and characteristics.
 *
 * Extracted from bootToGutenberg.html lines 1987-2010, 2098-2120
 */

/**
 * Check if element has a specific class
 * @param {Element} el - DOM element
 * @param {string} className - Class name to check
 * @returns {boolean}
 */
export function hasClass(el, className) {
  return el.classList && el.classList.contains(className)
}

/**
 * Check if element is a Bootstrap column
 * @param {Element} el - DOM element
 * @returns {boolean}
 */
export function isColumn(el) {
  const classes = Array.from(el.classList || [])
  return classes.some(cls => cls === 'col' || cls.match(/^col-/))
}

/**
 * Check if element has flex display class (including responsive variants)
 * @param {Element} el - DOM element
 * @returns {boolean}
 */
export function hasFlexDisplay(el) {
  if (!el.classList) return false
  const classes = Array.from(el.classList)
  const flexRegex = /^d-(sm-|md-|lg-|xl-|xxl-)?(inline-)?flex$/
  return classes.some(c => flexRegex.test(c))
}

/**
 * Check if element has border or rounded utility classes
 * @param {Element} el - DOM element
 * @returns {boolean}
 */
export function hasBorderUtilities(el) {
  if (!el.classList) return false
  const classes = Array.from(el.classList)
  const borderRegex = /^(border|rounded)(-|$)/
  return classes.some(c => borderRegex.test(c))
}

/**
 * Check if element has inline styles that can't be mapped to Gutenberg JSON
 * @param {Element} el - DOM element
 * @returns {boolean}
 */
export function hasUnmappedStyles(el) {
  const style = el.getAttribute('style')
  if (!style || !style.trim()) return false

  // Styles we can map to Gutenberg JSON (spacing, colors handled elsewhere)
  // Everything else is "unmapped" and requires wp:html
  const mappedProperties = [
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'background-color', 'color',
    'font-size', 'line-height', 'font-weight',
    'border-radius'
  ]

  // Parse inline style
  const styleProps = style.split(';')
    .map(s => s.trim())
    .filter(s => s)
    .map(s => s.split(':')[0].trim().toLowerCase())

  // Check if any style property is NOT in our mapped list
  return styleProps.some(prop => !mappedProperties.includes(prop))
}

/**
 * Check if button is an outline variant
 * @param {Element} el - Button element
 * @returns {boolean}
 */
export function isOutlineButton(el) {
  const classes = Array.from(el.classList || [])
  return classes.some(cls => cls.startsWith('btn-outline-'))
}
