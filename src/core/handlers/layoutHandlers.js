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

  // Apply WordPress style attributes from mapping (color, spacing, border, etc.)
  if (wpAttrs.style) {
    attrs.style = wpAttrs.style
  }

  // Build className: alignfull for fluid containers + any GUC utility classes
  const classNames = []
  if (isFluid) {
    classNames.push('alignfull')
  }
  if (gucClasses.length > 0) {
    classNames.push(...gucClasses)
  }
  if (classNames.length > 0) {
    attrs.className = classNames.join(' ')
  }

  // Process children, auto-wrapping consecutive columns in wp:columns
  const children = processContainerChildren.call(this, el)
  const htmlAttrs = this.generateHtmlAttrs(attrs, unmappedStyles)

  return this.wrapBlock('wp:group', attrs,
    '<div class="wp-block-group' + htmlAttrs.classes + '"' + htmlAttrs.style + '>' + children + '</div>'
  )
}

/**
 * Process container children, auto-wrapping consecutive columns in wp:columns
 * Handles cases like: <div class="container"><h1>...</h1><div class="col-md-6">...</div><div class="col-md-6">...</div></div>
 * @param {Element} el - Container element
 * @returns {string} Processed children markup
 */
function processContainerChildren(el) {
  let output = ''
  let columnBuffer = []

  const flushColumns = () => {
    if (columnBuffer.length === 0) return

    // Check if columns have responsive stacking pattern
    const hasResponsiveStack = columnBuffer.some(col => {
      const classes = Array.from(col.classList || [])
      const hasFullWidthMobile = classes.some(c =>
        /^col-12$/.test(c) || /^col-xs-12$/.test(c)
      )
      const hasResponsiveWidth = classes.some(c =>
        /^col-(sm|md|lg|xl|xxl)-\d+$/.test(c) && !/col-(sm|md|lg|xl|xxl)-12$/.test(c)
      )
      return hasFullWidthMobile && hasResponsiveWidth
    })

    const columnsAttrs = {}
    if (hasResponsiveStack) {
      columnsAttrs.className = 'stack-on-mobile'
    }

    // Process each column
    let columnsContent = ''
    for (const col of columnBuffer) {
      columnsContent += this.handleColumn(col)
    }

    const classStr = hasResponsiveStack
      ? 'wp-block-columns stack-on-mobile'
      : 'wp-block-columns'

    output += this.wrapBlock('wp:columns', columnsAttrs,
      '<div class="' + classStr + '">' + columnsContent + '</div>'
    )

    columnBuffer = []
  }

  for (const child of el.childNodes) {
    // Skip whitespace-only text nodes (don't let them break column grouping)
    if (child.nodeType === 3 && !child.textContent.trim()) {
      continue
    }

    if (child.nodeType === 1 && this.isColumn(child)) {
      // It's a column element - buffer it
      columnBuffer.push(child)
    } else {
      // Not a column - flush any buffered columns first, then process this node
      flushColumns()
      const processed = this.processNode(child)
      if (processed) {
        output += processed
      }
    }
  }

  // Flush any remaining columns
  flushColumns()

  return output
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

  // Check if columns have responsive stacking pattern
  // e.g., col-12 col-md-6 means full width on mobile, 50% on desktop
  const hasResponsiveStack = hasResponsiveStackPattern(el)
  if (hasResponsiveStack) {
    attrs.className = 'stack-on-mobile'
  }

  const children = this.processChildren(el)

  const classStr = hasResponsiveStack
    ? 'wp-block-columns stack-on-mobile'
    : 'wp-block-columns'

  return this.wrapBlock('wp:columns', attrs,
    '<div class="' + classStr + '">' + children + '</div>'
  )
}

/**
 * Check if row contains columns with responsive stacking pattern
 * Pattern: col-12 (or col-xs-12) combined with col-md-N (or col-lg-N, etc.)
 * @param {Element} rowEl - Row element
 * @returns {boolean}
 */
function hasResponsiveStackPattern(rowEl) {
  const cols = rowEl.querySelectorAll('[class*="col-"]')
  for (const col of cols) {
    const classes = Array.from(col.classList || [])
    const hasFullWidthMobile = classes.some(c =>
      /^col-12$/.test(c) || /^col-xs-12$/.test(c)
    )
    const hasResponsiveWidth = classes.some(c =>
      /^col-(sm|md|lg|xl|xxl)-\d+$/.test(c) && !/col-(sm|md|lg|xl|xxl)-12$/.test(c)
    )
    if (hasFullWidthMobile && hasResponsiveWidth) {
      return true
    }
  }
  return false
}

/**
 * Handle Bootstrap column
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleColumn(el) {
  const responsive = this.extractResponsiveColumnClasses(el)
  const spacing = this.extractSpacing(el)
  const colors = this.extractColors(el)

  const attrs = {}
  const columnClasses = ['wp-block-column']

  // Add width as percentage string, but skip 100% (full-width is default)
  // Only add explicit width for partial columns (col-6 = 50%, col-4 = 33.33%, etc.)
  if (responsive.baseWidth && responsive.baseWidth !== '100%') {
    attrs.width = responsive.baseWidth
  }

  // Add Bootstrap responsive column classes
  if (responsive.classes.length > 0) {
    attrs.className = responsive.classes.join(' ')
    columnClasses.push(...responsive.classes)
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
    '<div class="' + columnClasses.join(' ') + '">' + children + '</div>'
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

/**
 * Handle ul/ol elements with utility classes as wp:list
 * HTML entity (tag) is recognized first, then classList is processed
 * All utility classes are converted to CSS and compiled into a single custom class
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleList(el) {
  const tagName = el.tagName.toLowerCase()
  const isOrdered = tagName === 'ol'

  // Generate custom class - all utilities become CSS
  const customClass = this.generateCustomClass(el)
  const listClasses = ['wp-block-list']
  const listAttrs = {}

  if (isOrdered) {
    listAttrs.ordered = true
  }

  // Only output the single custom class (not unmapped classes)
  if (customClass) {
    listAttrs.className = customClass.className
    listClasses.push(customClass.className)
  }

  // Process list items
  let listItems = ''
  for (const child of el.children) {
    if (child.tagName.toLowerCase() === 'li') {
      listItems += handleListItem.call(this, child)
    }
  }

  const listTag = isOrdered ? 'ol' : 'ul'
  return this.wrapBlock('wp:list', listAttrs,
    '<' + listTag + ' class="' + listClasses.join(' ') + '">' + listItems + '</' + listTag + '>'
  )
}

/**
 * Handle li elements as wp:list-item
 * All utility classes are converted to CSS and compiled into a single custom class
 * Content is wrapped in wp:html to preserve SVG, spans, and other complex content
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleListItem(el) {
  // Generate custom class - all utilities become CSS
  const customClass = this.generateCustomClass(el)
  const itemClasses = []
  const itemAttrs = {}

  // Only output the single custom class (not unmapped classes)
  if (customClass) {
    itemAttrs.className = customClass.className
    itemClasses.push(customClass.className)
  }

  // Collect all content from the li element
  // Wrap in wp:html to preserve SVG, spans, and other complex content
  let rawContent = ''
  for (const node of el.childNodes) {
    if (node.nodeType === 3) { // Node.TEXT_NODE
      rawContent += node.textContent
    } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
      rawContent += node.outerHTML
    }
  }

  // Trim but preserve internal spacing
  rawContent = rawContent.trim()

  // Wrap content in wp:html block
  const wrappedContent = this.wrapHtmlBlock(rawContent)

  const classAttr = itemClasses.length > 0 ? ' class="' + itemClasses.join(' ') + '"' : ''
  return this.wrapBlock('wp:list-item', itemAttrs,
    '<li' + classAttr + '>' + wrappedContent + '</li>'
  )
}
