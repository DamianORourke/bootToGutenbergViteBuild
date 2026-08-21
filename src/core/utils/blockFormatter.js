/**
 * Block Formatter Utilities
 *
 * Utilities for formatting Gutenberg block output:
 * - Wrapping content in block comments
 * - Generating HTML attributes from JSON
 * - Converting spacing to CSS variables
 *
 * Extracted from bootToGutenberg.html lines 1517-1708, 2248-2257
 */

/**
 * Wrap content in Gutenberg block comment syntax
 * Note: 'this' refers to converter instance when bound
 * @param {string} blockName - Block name (e.g., 'wp:group')
 * @param {Object} attrs - Block attributes
 * @param {string} innerHtml - Inner HTML content
 * @returns {string} Formatted block markup
 */
export function wrapBlock(blockName, attrs, innerHtml) {
  const indent = this.indentStr.repeat(this.indentLevel)
  const attrStr = Object.keys(attrs).length > 0 ? ' ' + JSON.stringify(attrs) : ''

  let output = '\n' + indent + '<!-- ' + blockName + attrStr + ' -->'
  output += '\n' + indent + innerHtml
  output += '\n' + indent + '<!-- /' + blockName + ' -->'

  return output
}

/**
 * Wrap content in wp:html block (for complex/unsupported elements)
 * Note: 'this' refers to converter instance when bound
 * @param {string} html - Raw HTML content
 * @returns {string} wp:html block markup
 */
export function wrapHtmlBlock(html) {
  const indent = this.indentStr.repeat(this.indentLevel)
  return '\n' + indent + '<!-- wp:html -->\n' + indent + html + '\n' + indent + '<!-- /wp:html -->'
}

/**
 * Wrap element in wp:html to preserve exact markup
 * @param {Element} el - DOM element
 * @returns {string} wp:html block markup
 */
export function wrapAsHtml(el) {
  return this.wrapHtmlBlock(el.outerHTML)
}

/**
 * Generate HTML classes and style attribute from block attributes
 * WordPress expects the HTML to include has-* classes matching JSON attributes
 * @param {Object} attrs - Gutenberg attributes
 * @param {string} preserveStyle - Raw inline styles to preserve (unmapped styles)
 * @returns {{ classes: string, style: string }}
 */
export function generateHtmlAttrs(attrs, preserveStyle = '') {
  const classes = []
  const styles = []

  // Custom className (responsive utilities, etc.)
  if (attrs.className) {
    classes.push(attrs.className)
  }

  // Background color
  if (attrs.backgroundColor) {
    classes.push('has-' + attrs.backgroundColor + '-background-color')
    classes.push('has-background')
  }

  // Text color
  if (attrs.textColor) {
    classes.push('has-' + attrs.textColor + '-color')
    classes.push('has-text-color')
  }

  // Spacing (padding)
  if (attrs.style && attrs.style.spacing && attrs.style.spacing.padding) {
    const p = attrs.style.spacing.padding
    if (p.top) styles.push('padding-top:' + this.convertSpacingToVar(p.top))
    if (p.right) styles.push('padding-right:' + this.convertSpacingToVar(p.right))
    if (p.bottom) styles.push('padding-bottom:' + this.convertSpacingToVar(p.bottom))
    if (p.left) styles.push('padding-left:' + this.convertSpacingToVar(p.left))
  }

  // Spacing (margin)
  if (attrs.style && attrs.style.spacing && attrs.style.spacing.margin) {
    const m = attrs.style.spacing.margin
    if (m.top) styles.push('margin-top:' + this.convertSpacingToVar(m.top))
    if (m.bottom) styles.push('margin-bottom:' + this.convertSpacingToVar(m.bottom))
  }

  // Border radius
  if (attrs.style && attrs.style.border && attrs.style.border.radius) {
    styles.push('border-radius:' + attrs.style.border.radius)
  }

  // Preserve unmapped inline styles from original element
  if (preserveStyle) {
    styles.push(preserveStyle)
  }

  return {
    classes: classes.length > 0 ? ' ' + classes.join(' ') : '',
    style: styles.length > 0 ? ' style="' + styles.join(';') + '"' : ''
  }
}

/**
 * Convert spacing value to CSS variable
 * @param {string} value - Spacing value (e.g., 'var:preset|spacing|lg')
 * @returns {string} CSS variable (e.g., 'var(--wp--preset--spacing--lg)')
 */
export function convertSpacingToVar(value) {
  if (value.startsWith('var:preset|spacing|')) {
    const slug = value.replace('var:preset|spacing|', '')
    return 'var(--wp--preset--spacing--' + slug + ')'
  }
  return value
}
