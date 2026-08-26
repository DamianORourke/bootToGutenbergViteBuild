/**
 * Layout Handlers
 *
 * Handle Bootstrap layout elements:
 * - container, container-fluid -> wp:group with constrained layout
 * - row -> wp:columns
 * - col-* -> wp:column
 * - d-flex groups -> wp:group with flex layout
 *
 * Extracted from bootToGutenberg.html lines 601-687, 1166-1217, 1710-1765, 2161-2187
 *
 * Note: All functions are bound to the converter instance via _bindMethods()
 */

/**
 * Handle Bootstrap container
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleContainer(el) {
  const isFluid = this.hasClass(el, 'container-fluid')
  const unmappedStyles = this.extractUnmappedStyles(el)

  // Map Bootstrap utilities to GUC classes and WP attributes
  const { gucClasses, unmappedBootstrap, consumedClasses, wpAttrs } = this.mapBootstrapToGucClasses(el)

  const attrs = {
    layout: { type: 'constrained' }
  }

  if (isFluid) {
    attrs.align = 'full'
  }

  // Apply WordPress style attributes from mapping (color, spacing, border, etc.)
  if (wpAttrs.style) {
    attrs.style = wpAttrs.style
  }

  // Add GUC utility classes to className
  if (gucClasses.length > 0) {
    attrs.className = gucClasses.join(' ')
  }

  const children = this.processChildren(el)
  const htmlAttrs = this.generateHtmlAttrs(attrs, unmappedStyles)

  return this.wrapBlock('wp:group', attrs,
    '<div class="wp-block-group' + htmlAttrs.classes + '"' + htmlAttrs.style + '>' + children + '</div>'
  )
}

/**
 * Handle Bootstrap row
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleRow(el) {
  const spacing = this.extractSpacing(el)
  const attrs = {}

  if (Object.keys(spacing).length > 0) {
    attrs.style = { spacing: spacing }
  }

  const children = this.processChildren(el)

  return this.wrapBlock('wp:columns', attrs,
    '<div class="wp-block-columns">' + children + '</div>'
  )
}

/**
 * Handle Bootstrap column
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleColumn(el) {
  const width = this.extractColumnWidth(el)
  const spacing = this.extractSpacing(el)
  const colors = this.extractColors(el)

  const attrs = {}

  // Add width as percentage string, but skip 100% (full-width is default)
  // Only add explicit width for partial columns (col-6 = 50%, col-4 = 33.33%, etc.)
  if (width && width !== '100%') {
    attrs.width = width
  }

  if (Object.keys(spacing).length > 0 || colors.backgroundColor) {
    attrs.style = {}
    if (Object.keys(spacing).length > 0) {
      attrs.style.spacing = spacing
    }
  }

  if (colors.backgroundColor) {
    attrs.backgroundColor = colors.backgroundColor
  }

  const children = this.processChildren(el)

  // Let WordPress generate flex-basis from the width JSON attribute
  // Don't add style manually - WordPress validates that JSON matches HTML
  return this.wrapBlock('wp:column', attrs,
    '<div class="wp-block-column">' + children + '</div>'
  )
}

/**
 * Handle flex group (d-flex)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleFlexGroup(el) {
  const colors = this.extractColors(el)

  // Generate custom class from utility classes
  const customClass = this.generateCustomClass(el)

  const attrs = {}

  // Use simple group with custom class - all flex/layout handled by CSS
  if (customClass) {
    // Include custom class plus any unmapped classes (like 'bi', 'alert', etc.)
    const allClasses = [customClass.className, ...customClass.unmappedClasses].filter(Boolean)
    attrs.className = allClasses.join(' ')
  } else {
    // Fallback: no mappable utilities, use traditional flex layout
    const justifyContent = this.extractJustifyContent(el)
    const alignItems = this.extractAlignItems(el)
    const flexDirection = this.extractFlexDirection(el)
    const spacing = this.extractSpacing(el)
    const utilityClasses = this.extractUtilityClasses(el)

    attrs.layout = {
      type: 'flex',
      flexWrap: 'nowrap'
    }

    if (flexDirection === 'column') {
      attrs.layout.orientation = 'vertical'
    } else {
      attrs.layout.orientation = 'horizontal'
    }

    if (justifyContent) {
      attrs.layout.justifyContent = justifyContent
    }

    if (alignItems) {
      attrs.layout.verticalAlignment = alignItems
    }

    if (Object.keys(spacing).length > 0) {
      attrs.style = { spacing: spacing }
    }

    if (utilityClasses.length > 0) {
      attrs.className = utilityClasses.join(' ')
    }
  }

  if (colors.backgroundColor) {
    attrs.backgroundColor = colors.backgroundColor
  }

  const children = this.processChildren(el)

  // Build class string
  let classStr = 'wp-block-group'
  if (attrs.className) {
    classStr += ' ' + attrs.className
  }

  return this.wrapBlock('wp:group', attrs,
    '<div class="' + classStr + '">' + children + '</div>'
  )
}

/**
 * Handle generic group (div, section)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleGroup(el) {
  const unmappedStyles = this.extractUnmappedStyles(el)

  // Map Bootstrap utilities to GUC classes and WP attributes
  const { gucClasses, unmappedBootstrap, consumedClasses, wpAttrs } = this.mapBootstrapToGucClasses(el)

  const attrs = {}

  // Apply WordPress style attributes from mapping (color, spacing, border, etc.)
  if (wpAttrs.style) {
    attrs.style = wpAttrs.style
  }

  // Add GUC utility classes to className
  if (gucClasses.length > 0) {
    attrs.className = gucClasses.join(' ')
  }

  const children = this.processChildren(el)

  // Only wrap if there are meaningful attributes, inline styles, or multiple children
  if (Object.keys(attrs).length === 0 && !unmappedStyles) {
    return children
  }

  const htmlAttrs = this.generateHtmlAttrs(attrs, unmappedStyles)

  return this.wrapBlock('wp:group', attrs,
    '<div class="wp-block-group' + htmlAttrs.classes + '"' + htmlAttrs.style + '>' + children + '</div>'
  )
}

/**
 * Handle elements with border/rounded utilities
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleBorderElement(el) {
  const unmappedStyles = this.extractUnmappedStyles(el)

  // Map Bootstrap utilities to GUC classes and WP attributes
  const { gucClasses, unmappedBootstrap, consumedClasses, wpAttrs } = this.mapBootstrapToGucClasses(el)

  const children = this.processChildren(el)
  const tagName = el.tagName.toLowerCase()

  const attrs = {}

  // Apply WordPress style attributes from mapping (color, spacing, border, etc.)
  if (wpAttrs.style) {
    attrs.style = wpAttrs.style
  }

  // Add GUC utility classes to className
  if (gucClasses.length > 0) {
    attrs.className = gucClasses.join(' ')
  }

  // Recognized container elements can become wp:group
  const groupElements = ['div', 'section', 'article', 'aside', 'main']

  // If element has content or is a recognized container, wrap in group
  if (children.trim() || groupElements.includes(tagName)) {
    const htmlAttrs = this.generateHtmlAttrs(attrs, unmappedStyles)
    return this.wrapBlock('wp:group', attrs,
      '<div class="wp-block-group' + htmlAttrs.classes + '"' + htmlAttrs.style + '>' + children + '</div>'
    )
  }

  // Non-container empty border element - preserve original tag using wp:html
  const classAttr = gucClasses.length ? ' class="' + gucClasses.join(' ') + '"' : ''
  const styleAttr = unmappedStyles ? ' style="' + unmappedStyles + '"' : ''
  return this.wrapHtmlBlock('<' + tagName + classAttr + styleAttr + '></' + tagName + '>')
}
