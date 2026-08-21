/**
 * Element Handlers
 *
 * Handle basic HTML elements:
 * - h1-h6 headings -> wp:heading
 * - p paragraphs -> wp:paragraph
 * - img images -> wp:image
 * - button, a.btn buttons -> wp:button
 * - span.badge badges -> wp:paragraph with badge class
 *
 * Extracted from bootToGutenberg.html lines 689-843, 1135-1163, 1319-1330
 *
 * Note: All functions are bound to the converter instance via _bindMethods()
 */

/**
 * Handle heading elements (h1-h6)
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleHeading(el) {
  const level = parseInt(el.tagName.charAt(1))
  const textAlign = this.extractTextAlign(el) || this.parentTextAlign
  const fontSize = this.extractFontSize(el)
  const colors = this.extractColors(el)

  const attrs = { level: level }
  const classes = ['wp-block-heading']

  if (textAlign) {
    attrs.textAlign = textAlign
    classes.push('has-text-align-' + textAlign)
  }

  if (fontSize) {
    attrs.fontSize = fontSize
    classes.push('has-' + fontSize + '-font-size')
  }

  if (colors.textColor) {
    attrs.textColor = colors.textColor
    classes.push('has-' + colors.textColor + '-color')
    classes.push('has-text-color')
  }

  const text = el.innerHTML

  return this.wrapBlock('wp:heading', attrs,
    '<h' + level + ' class="' + classes.join(' ') + '">' + text + '</h' + level + '>'
  )
}

/**
 * Handle paragraph elements
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleParagraph(el) {
  const textAlign = this.extractTextAlign(el) || this.parentTextAlign
  const fontSize = this.extractFontSize(el)
  const colors = this.extractColors(el)
  const spacing = this.extractSpacing(el)

  const attrs = {}
  const classes = []

  if (textAlign) {
    attrs.align = textAlign
    classes.push('has-text-align-' + textAlign)
  }

  if (fontSize) {
    attrs.fontSize = fontSize
    classes.push('has-' + fontSize + '-font-size')
  }

  if (colors.textColor) {
    attrs.textColor = colors.textColor
    classes.push('has-' + colors.textColor + '-color')
    classes.push('has-text-color')
  }

  if (Object.keys(spacing).length > 0) {
    attrs.style = { spacing: spacing }
  }

  const text = el.innerHTML
  const classAttr = classes.length > 0 ? ' class="' + classes.join(' ') + '"' : ''

  return this.wrapBlock('wp:paragraph', attrs,
    '<p' + classAttr + '>' + text + '</p>'
  )
}

/**
 * Handle button elements
 * @param {Element} el - DOM element
 * @param {boolean} skipWrapper - If true, don't wrap in wp:buttons container
 * @returns {string} Gutenberg block markup
 */
export function handleButton(el, skipWrapper = false) {
  const colors = this.extractButtonColors(el)
  const isOutline = this.isOutlineButton(el)

  const buttonAttrs = {}
  // Start with base class only - wp-element-button must come LAST per WordPress block validation
  const linkClasses = ['wp-block-button__link']
  const wrapperClasses = ['wp-block-button']

  // WordPress expects: text color classes BEFORE background color classes
  if (colors.textColor && !isOutline) {
    buttonAttrs.textColor = colors.textColor
    linkClasses.push('has-' + colors.textColor + '-color', 'has-text-color')
  }

  if (colors.backgroundColor && !isOutline) {
    buttonAttrs.backgroundColor = colors.backgroundColor
    linkClasses.push('has-' + colors.backgroundColor + '-background-color', 'has-background')
  }

  // Collect className parts for JSON attribute
  const classNameParts = []

  if (isOutline) {
    classNameParts.push('is-style-outline')
    wrapperClasses.push('is-style-outline')
    // For outline buttons, color is handled via style.color.text (not textColor)
    // This avoids conflicts between preset and custom color in WordPress editor
    if (colors.outlineColor) {
      linkClasses.push('has-' + colors.outlineColor + '-color', 'has-text-color')
    }
  }

  // Extract utility classes and convert to JSON style
  let { jsonStyle, unmappedClasses } = this.extractUtilityStyles(el)

  // Initialize buttonAttrs.style and merge utility styles
  buttonAttrs.style = buttonAttrs.style || {}
  if (jsonStyle.border) {
    buttonAttrs.style.border = { ...(buttonAttrs.style.border || {}), ...jsonStyle.border }
  }
  if (jsonStyle.shadow) {
    buttonAttrs.style.shadow = jsonStyle.shadow
  }

  // For outline buttons, add outline-specific styling
  // RULE: JSON style attributes must match inline styles EXACTLY (same format, same values)
  // This includes !important on color.text to override WordPress class-based !important
  if (isOutline && colors.outlineColor) {
    // Merge border properties (preserves radius from utilities)
    buttonAttrs.style.border = {
      ...(buttonAttrs.style.border || {}),
      width: '2px',
      style: 'solid',
      color: 'var(--wp--preset--color--' + colors.outlineColor + ')'
    }
    buttonAttrs.style.color = {
      text: 'var(--wp--preset--color--' + colors.outlineColor + ') !important',
      background: 'transparent'
    }

    // Add classes WordPress expects
    linkClasses.push('has-background', 'has-border-color')
  } else if (isOutline) {
    // Fallback if no color detected
    buttonAttrs.style.border = {
      ...(buttonAttrs.style.border || {}),
      width: '2px',
      style: 'solid',
      color: 'currentColor'
    }
    buttonAttrs.style.color = {
      text: 'currentColor !important',
      background: 'transparent'
    }

    linkClasses.push('has-background', 'has-border-color')
  }

  // Generate inline style string from the JSON style object
  const inlineStyle = this.styleJsonToInlineCss(buttonAttrs.style)

  // Any unmapped utility classes go to className (will need CSS support)
  if (unmappedClasses.length > 0) {
    classNameParts.push(...unmappedClasses)
    wrapperClasses.push(...unmappedClasses)
  }

  if (classNameParts.length > 0) {
    buttonAttrs.className = classNameParts.join(' ')
  }

  // wp-element-button MUST be last class per WordPress block validation
  linkClasses.push('wp-element-button')

  const text = el.textContent.trim()
  const href = el.getAttribute('href') || '#'

  // Only preserve data attributes for Bootstrap JS components (collapse, modal, etc.)
  // Do NOT preserve 'role' as WordPress handles button semantics natively
  let extraAttrs = ''
  const attrsToPreserve = ['aria-expanded', 'aria-controls', 'data-bs-toggle', 'data-bs-target']
  for (const attr of attrsToPreserve) {
    if (el.hasAttribute(attr)) {
      extraAttrs += ' ' + attr + '="' + el.getAttribute(attr) + '"'
    }
  }

  // Add inline style attribute if we have utility styles
  const styleAttr = inlineStyle ? ' style="' + inlineStyle + '"' : ''

  // HTML must include has-* classes that WordPress generates from JSON attributes
  const buttonHtml = this.wrapBlock('wp:button', buttonAttrs,
    '<div class="' + wrapperClasses.join(' ') + '"><a class="' + linkClasses.join(' ') + '" href="' + href + '"' + styleAttr + extraAttrs + '>' + text + '</a></div>'
  )

  // If called with skipWrapper=true, just return the button (for grouping)
  if (skipWrapper) {
    return buttonHtml
  }

  // Wrap single button in buttons container with layout
  const buttonsAttrs = {
    layout: { type: 'flex', justifyContent: 'center' }
  }

  // Use inherited text alignment for buttons container
  if (this.parentTextAlign === 'center') {
    buttonsAttrs.layout.justifyContent = 'center'
  } else if (this.parentTextAlign === 'right') {
    buttonsAttrs.layout.justifyContent = 'right'
  } else if (this.parentTextAlign === 'left') {
    buttonsAttrs.layout.justifyContent = 'left'
  }

  return this.wrapBlock('wp:buttons', buttonsAttrs,
    '<div class="wp-block-buttons">' + buttonHtml + '</div>'
  )
}

/**
 * Handle consecutive buttons (group them in one wp:buttons container)
 * @param {Element[]} buttons - Array of button elements
 * @returns {string} Gutenberg block markup
 */
export function handleConsecutiveButtons(buttons) {
  // Process consecutive buttons found in flow and wrap in a single wp:buttons container
  let buttonHtmls = ''
  for (const btn of buttons) {
    buttonHtmls += this.handleButton(btn, true)
  }

  // Determine layout based on inherited text alignment
  const buttonsAttrs = {
    layout: { type: 'flex', justifyContent: 'left' }
  }

  if (this.parentTextAlign === 'center') {
    buttonsAttrs.layout.justifyContent = 'center'
  } else if (this.parentTextAlign === 'right') {
    buttonsAttrs.layout.justifyContent = 'right'
  }

  return this.wrapBlock('wp:buttons', buttonsAttrs,
    '<div class="wp-block-buttons">' + buttonHtmls + '</div>'
  )
}

/**
 * Handle image elements
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleImage(el) {
  let src = el.getAttribute('src') || ''
  const alt = el.getAttribute('alt') || ''
  const classes = Array.from(el.classList || [])

  // Default placeholder for missing or placeholder.com images
  const defaultPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23E2E8F0" width="800" height="400"/%3E%3Ctext fill="%2394A3B8" font-family="system-ui" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Placeholder%3C/text%3E%3C/svg%3E'

  if (!src || src.includes('placeholder.com') || src.includes('via.placeholder')) {
    src = defaultPlaceholder
  }

  const attrs = {}

  if (classes.includes('img-fluid') || classes.includes('w-100')) {
    attrs.sizeSlug = 'full'
  }

  if (classes.includes('rounded')) {
    attrs.style = { border: { radius: '0.5rem' } }
  }

  if (classes.includes('rounded-circle')) {
    attrs.style = { border: { radius: '9999px' } }
  }

  return this.wrapBlock('wp:image', attrs,
    '<figure class="wp-block-image"><img src="' + src + '" alt="' + alt + '"/></figure>'
  )
}

/**
 * Handle standalone badge elements
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleBadge(el) {
  // Convert standalone badge to wp:paragraph with badge classes
  this.trackCss('badge')
  this.trackUtilityClasses(el)

  const classList = Array.from(el.classList).join(' ')
  const content = el.textContent.trim()

  return this.wrapBlock('wp:paragraph', { className: classList },
    '<p class="' + classList + '">' + content + '</p>'
  )
}
