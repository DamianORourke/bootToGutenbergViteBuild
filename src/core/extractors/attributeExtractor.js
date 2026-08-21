/**
 * Attribute Extractors
 *
 * Extract Bootstrap classes and convert to Gutenberg JSON attributes.
 * These functions analyze element classes and styles to determine
 * the appropriate Gutenberg block properties.
 *
 * Extracted from bootToGutenberg.html lines 1614-1643, 1799-2095, 2124-2154
 *
 * Note: All functions are bound to the converter instance via _bindMethods()
 * They access converter state (spacingMap, bgColorMap, etc.) via 'this'
 */

/**
 * Extract padding/margin from Bootstrap spacing classes
 * @param {Element} el - DOM element
 * @returns {Object} Gutenberg spacing object
 */
export function extractSpacing(el) {
  const classes = Array.from(el.classList || [])
  const spacing = {}

  const paddingTop = this.findSpacingClass(classes, 'pt-') || this.findSpacingClass(classes, 'py-')
  const paddingBottom = this.findSpacingClass(classes, 'pb-') || this.findSpacingClass(classes, 'py-')
  const paddingLeft = this.findSpacingClass(classes, 'ps-') || this.findSpacingClass(classes, 'px-')
  const paddingRight = this.findSpacingClass(classes, 'pe-') || this.findSpacingClass(classes, 'px-')
  const paddingAll = this.findSpacingClass(classes, 'p-')

  const marginTop = this.findSpacingClass(classes, 'mt-') || this.findSpacingClass(classes, 'my-')
  const marginBottom = this.findSpacingClass(classes, 'mb-') || this.findSpacingClass(classes, 'my-')

  const padding = {}
  if (paddingAll) {
    padding.top = 'var:preset|spacing|' + paddingAll
    padding.bottom = 'var:preset|spacing|' + paddingAll
    padding.left = 'var:preset|spacing|' + paddingAll
    padding.right = 'var:preset|spacing|' + paddingAll
  }
  if (paddingTop) padding.top = 'var:preset|spacing|' + paddingTop
  if (paddingBottom) padding.bottom = 'var:preset|spacing|' + paddingBottom
  if (paddingLeft) padding.left = 'var:preset|spacing|' + paddingLeft
  if (paddingRight) padding.right = 'var:preset|spacing|' + paddingRight

  if (Object.keys(padding).length > 0) {
    spacing.padding = padding
  }

  const margin = {}
  if (marginTop) margin.top = 'var:preset|spacing|' + marginTop
  if (marginBottom) margin.bottom = 'var:preset|spacing|' + marginBottom

  if (Object.keys(margin).length > 0) {
    spacing.margin = margin
  }

  return spacing
}

/**
 * Extract background and text colors from Bootstrap classes
 * @param {Element} el - DOM element
 * @returns {{ backgroundColor?: string, textColor?: string }}
 */
export function extractColors(el) {
  const classes = Array.from(el.classList || [])
  const colors = {}

  for (const cls of classes) {
    if (this.bgColorMap[cls]) {
      colors.backgroundColor = this.bgColorMap[cls]
    }
    if (this.textColorMap[cls]) {
      colors.textColor = this.textColorMap[cls]
    }
  }

  return colors
}

/**
 * Extract button-specific colors
 * @param {Element} el - Button element
 * @returns {{ backgroundColor?: string, textColor?: string, outlineColor?: string }}
 */
export function extractButtonColors(el) {
  const classes = Array.from(el.classList || [])
  const colors = {}

  const btnColorMap = {
    'btn-primary': 'primary',
    'btn-secondary': 'secondary',
    'btn-success': 'success',
    'btn-danger': 'error',
    'btn-warning': 'warning',
    'btn-dark': 'dark',
    'btn-light': 'surface'
  }

  // Outline button color map (border/text color)
  const btnOutlineColorMap = {
    'btn-outline-primary': 'primary',
    'btn-outline-secondary': 'secondary',
    'btn-outline-success': 'success',
    'btn-outline-danger': 'error',
    'btn-outline-warning': 'warning',
    'btn-outline-dark': 'dark',
    'btn-outline-light': 'surface'
  }

  for (const cls of classes) {
    if (btnColorMap[cls]) {
      colors.backgroundColor = btnColorMap[cls]
      colors.textColor = cls === 'btn-light' || cls === 'btn-warning' ? 'dark' : 'white'
    }
    // Extract outline button color (used for border/text)
    if (btnOutlineColorMap[cls]) {
      colors.outlineColor = btnOutlineColorMap[cls]
    }
  }

  return colors
}

/**
 * Extract font size from fs-* classes
 * @param {Element} el - DOM element
 * @returns {string|null} Font size slug
 */
export function extractFontSize(el) {
  const classes = Array.from(el.classList || [])

  for (const cls of classes) {
    if (this.fontSizeMap[cls]) {
      return this.fontSizeMap[cls]
    }
  }

  // Check for lead class
  if (classes.includes('lead')) {
    return 'large'
  }

  return null
}

/**
 * Extract text alignment from Bootstrap classes
 * @param {Element} el - DOM element
 * @returns {string|null} 'left' | 'center' | 'right' | null
 */
export function extractTextAlign(el) {
  const classes = Array.from(el.classList || [])

  if (classes.includes('text-center')) return 'center'
  if (classes.includes('text-start') || classes.includes('text-left')) return 'left'
  if (classes.includes('text-end') || classes.includes('text-right')) return 'right'

  return null
}

/**
 * Extract flex justify-content from Bootstrap classes
 * @param {Element} el - DOM element
 * @returns {string|null}
 */
export function extractJustifyContent(el) {
  const classes = Array.from(el.classList || [])

  if (classes.includes('justify-content-center')) return 'center'
  if (classes.includes('justify-content-start')) return 'left'
  if (classes.includes('justify-content-end')) return 'right'
  if (classes.includes('justify-content-between')) return 'space-between'
  if (classes.includes('justify-content-around')) return 'space-around'

  return null
}

/**
 * Extract flex align-items from Bootstrap classes
 * @param {Element} el - DOM element
 * @returns {string|null}
 */
export function extractAlignItems(el) {
  const classes = Array.from(el.classList || [])

  if (classes.includes('align-items-center')) return 'center'
  if (classes.includes('align-items-start')) return 'top'
  if (classes.includes('align-items-end')) return 'bottom'

  return null
}

/**
 * Extract flex direction from Bootstrap classes
 * @param {Element} el - DOM element
 * @returns {string} 'row' | 'column' | 'row-reverse' | 'column-reverse'
 */
export function extractFlexDirection(el) {
  const classes = Array.from(el.classList || [])

  // Only check base classes (without breakpoint) for Gutenberg layout
  // Responsive classes are preserved in className for CSS handling
  if (classes.includes('flex-column')) return 'column'
  if (classes.includes('flex-column-reverse')) return 'column-reverse'
  if (classes.includes('flex-row-reverse')) return 'row-reverse'
  if (classes.includes('flex-row')) return 'row'

  // Default is row
  return 'row'
}

/**
 * Extract column width from col-* classes
 * @param {Element} el - DOM element
 * @returns {string|null} Width percentage
 */
export function extractColumnWidth(el) {
  const classes = Array.from(el.classList || [])

  // First try to find specific width (col-6, col-4, etc.)
  for (const cls of classes) {
    // Match col-N pattern (without breakpoint)
    const match = cls.match(/^col-(\d+)$/)
    if (match) {
      return this.colWidthMap[match[1]] || null
    }
  }

  // Check for responsive classes and use the largest
  for (const cls of classes) {
    const match = cls.match(/^col-(?:sm|md|lg|xl|xxl)-(\d+)$/)
    if (match) {
      return this.colWidthMap[match[1]] || null
    }
  }

  // Just 'col' means auto-width
  if (classes.includes('col')) {
    return null // Let Gutenberg handle equal distribution
  }

  return null
}

/**
 * Extract utility classes that should be preserved
 * @param {Element} el - DOM element
 * @returns {string[]} Array of class names
 */
export function extractUtilityClasses(el) {
  if (!el.classList) return []
  const classes = Array.from(el.classList)

  // Classes that are "consumed" by conversion (don't preserve these)
  const consumedPatterns = [
    /^container(-fluid)?$/,
    /^row$/,
    /^col(-|$)/,
    /^d-flex$/,
    /^d-inline-flex$/,
    /^flex-(row|column|wrap|nowrap)$/,
    /^justify-content-(start|end|center|between|around|evenly)$/,
    /^align-items-(start|end|center|baseline|stretch)$/,
    /^text-(start|center|end)$/,
    /^bg-(primary|secondary|success|danger|warning|info|light|dark|white)$/,
    /^text-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/,
    /^p[trblxy]?-\d$/,
    /^m[trblxy]?-\d$/,
    /^fs-\d$/,
    /^btn(-|$)/,
    /^card(-|$)/,
    /^list-group(-|$)/,
    /^accordion(-|$)/,
    /^alert(-|$)/,
    /^badge$/,
    /^nav(-|$)/,
    /^tab(-|$)/,
    /^modal(-|$)/,
    /^carousel(-|$)/,
    /^dropdown(-|$)/,
    /^collapse$/,
    /^offcanvas(-|$)/,
    /^toast(-|$)/,
    /^table(-|$)/,
    /^img-fluid$/,
    /^lead$/,
    /^display-\d$/
  ]

  // Preserve: known utilities + any custom classes (not consumed)
  const utilityClasses = classes.filter(c => {
    // Skip consumed classes
    if (consumedPatterns.some(pattern => pattern.test(c))) return false
    // Include everything else (known utilities + custom classes)
    return true
  })

  // Track CSS libraries for detected known utilities
  if (utilityClasses.some(c => /-(sm|md|lg|xl|xxl)(-|$)/.test(c) || /^d-(none|inline|inline-block|block|grid|inline-grid|table|table-row|table-cell)$/.test(c) || /^gap(-|$)/.test(c))) {
    this.trackCss('responsive-flex-utilities')
  }
  if (utilityClasses.some(c => /^(border|rounded)(-|$)/.test(c))) {
    this.trackCss('border-utilities')
  }
  if (utilityClasses.some(c => /^shadow(-|$)/.test(c))) {
    this.trackCss('shadow-utilities')
  }

  return utilityClasses
}

/**
 * Extract Bootstrap-specific classes (for wp:html elements)
 * @param {Element} el - DOM element
 * @returns {string[]} Array of Bootstrap class names
 */
export function extractBootstrapClasses(el) {
  const classes = Array.from(el.classList || [])
  // Filter to keep Bootstrap-specific classes
  return classes.filter(cls => {
    return cls.startsWith('accordion') ||
      cls.startsWith('modal') ||
      cls.startsWith('carousel') ||
      cls.startsWith('nav') ||
      cls.startsWith('tab') ||
      cls.startsWith('collapse') ||
      cls.startsWith('offcanvas') ||
      cls.startsWith('show') ||
      cls.startsWith('fade') ||
      cls.startsWith('active') ||
      cls.startsWith('btn') ||
      cls.startsWith('dropdown') ||
      cls.startsWith('navbar') ||
      cls.startsWith('toast')
  })
}

/**
 * Extract data-* and aria-* attributes
 * @param {Element} el - DOM element
 * @returns {string} Attribute string for HTML output
 */
export function extractDataAttributes(el) {
  let dataStr = ''
  for (const attr of el.attributes) {
    if (attr.name.startsWith('data-') || attr.name.startsWith('aria-') || attr.name === 'role') {
      dataStr += ' ' + attr.name + '="' + attr.value + '"'
    }
  }
  return dataStr
}

/**
 * Extract raw inline style attribute from element
 * @param {Element} el - DOM element
 * @returns {string} Style string
 */
export function extractInlineStyle(el) {
  const style = el.getAttribute('style')
  return style && style.trim() ? style.trim() : ''
}

/**
 * Extract only unmapped inline styles (styles that can't be converted to JSON)
 * These need to be preserved in the HTML output
 * @param {Element} el - DOM element
 * @returns {string} Unmapped style string
 */
export function extractUnmappedStyles(el) {
  const style = el.getAttribute('style')
  if (!style || !style.trim()) return ''

  // Styles we map to Gutenberg JSON (these are extracted separately)
  const mappedProperties = [
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'background-color', 'color',
    'font-size', 'line-height', 'font-weight',
    'border-radius'
  ]

  // Parse and filter to keep only unmapped styles
  const unmappedStyles = style.split(';')
    .map(s => s.trim())
    .filter(s => s)
    .filter(s => {
      const prop = s.split(':')[0].trim().toLowerCase()
      return !mappedProperties.includes(prop)
    })

  return unmappedStyles.join(';')
}

/**
 * Convert utility classes to inline CSS styles and JSON style attributes
 * @param {Element} el - DOM element
 * @returns {{ jsonStyle: Object, unmappedClasses: string[] }}
 */
export function extractUtilityStyles(el) {
  const classes = Array.from(el.classList || [])
  const styleProps = {}
  const jsonStyle = {}
  const unmappedClasses = []

  for (const cls of classes) {
    if (this.utilityStyleMap[cls]) {
      // Merge CSS properties
      const cssProps = this.utilityStyleMap[cls]
      Object.assign(styleProps, cssProps)

      // Also build JSON style object for WordPress
      if (cssProps['border-radius']) {
        jsonStyle.border = jsonStyle.border || {}
        jsonStyle.border.radius = cssProps['border-radius']
      }
      if (cssProps['box-shadow']) {
        jsonStyle.shadow = cssProps['box-shadow']
      }
    } else {
      // Check if it's a utility class pattern that we should track but can't map
      const utilityPatterns = [/^rounded/, /^shadow/, /^border-/]
      if (utilityPatterns.some(p => p.test(cls))) {
        unmappedClasses.push(cls)
      }
    }
  }

  return { jsonStyle, unmappedClasses }
}

/**
 * Convert WordPress style JSON object to inline CSS string
 * Handles: style.border.{radius,width,style,color}, style.shadow, style.color.{text,background}
 * @param {Object} styleObj - WordPress style object
 * @returns {string} Inline CSS string
 */
export function styleJsonToInlineCss(styleObj) {
  if (!styleObj || Object.keys(styleObj).length === 0) {
    return ''
  }

  const cssProps = []

  // Text color - value may already include !important from JSON
  if (styleObj.color?.text) {
    cssProps.push('color:' + styleObj.color.text)
  }

  // Border properties
  if (styleObj.border) {
    if (styleObj.border.color) {
      cssProps.push('border-color:' + styleObj.border.color)
    }
    if (styleObj.border.style) {
      cssProps.push('border-style:' + styleObj.border.style)
    }
    if (styleObj.border.width) {
      cssProps.push('border-width:' + styleObj.border.width)
    }
    if (styleObj.border.radius) {
      cssProps.push('border-radius:' + styleObj.border.radius)
    }
  }

  // Background color
  if (styleObj.color?.background) {
    cssProps.push('background-color:' + styleObj.color.background)
  }

  // Box shadow
  if (styleObj.shadow) {
    cssProps.push('box-shadow:' + styleObj.shadow)
  }

  return cssProps.join(';')
}
