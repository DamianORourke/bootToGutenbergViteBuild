/**
 * Component Handlers
 *
 * Handle Bootstrap component elements:
 * - card, card-group, card-body -> wp:group with styled structure
 * - alert -> wp:group with alert classes
 * - breadcrumb -> wp:list (ordered)
 * - btn-group -> wp:group with flex layout
 * - dropdown -> wp:group with dropdown classes
 * - table -> wp:table
 * - list-group -> wp:list
 *
 * Extracted from bootToGutenberg.html lines 845-1090, 1253-1503, 952-990, 991-1090
 *
 * Note: All functions are bound to the converter instance via _bindMethods()
 */

/**
 * Handle Bootstrap card-group
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleCardGroup(el) {
  // Card group → wp:columns with card-group class
  // Parent controls layout, children just need card class
  this.trackCss('card-group')
  this.trackCss('card')
  const cards = el.querySelectorAll(':scope > .card')
  let columnsInner = ''

  for (const card of cards) {
    const cardInner = this.processCardChildrenWithClasses(card)
    const columnAttrs = { className: 'card' }

    columnsInner += this.wrapBlock('wp:column', columnAttrs,
      '<div class="wp-block-column card">' + cardInner + '</div>'
    )
  }

  const columnsAttrs = { className: 'card-group' }
  return this.wrapBlock('wp:columns', columnsAttrs,
    '<div class="card-group wp-block-columns">' + columnsInner + '</div>'
  )
}

/**
 * Process card children with Bootstrap class names
 * @param {Element} el - Card element
 * @returns {string} Gutenberg block markup
 */
export function processCardChildrenWithClasses(el) {
  // Process card children, adding Bootstrap class names to native blocks
  let output = ''
  this.trackCss('card')

  const cardImg = el.querySelector('.card-img-top, .card-img')
  const cardHeader = el.querySelector('.card-header')
  const cardBody = el.querySelector('.card-body')
  const cardFooter = el.querySelector('.card-footer')

  if (cardImg) {
    this.trackCss('card-img-top')
    const src = cardImg.getAttribute('src') || ''
    const alt = cardImg.getAttribute('alt') || ''
    const imgAttrs = { className: 'card-img-top' }
    output += this.wrapBlock('wp:image', imgAttrs,
      '<figure class="card-img-top wp-block-image"><img src="' + src + '" alt="' + alt + '"/></figure>'
    )
  }

  if (cardHeader) {
    this.trackCss('card-header')
    const headerAttrs = { className: 'card-header' }
    const headerContent = this.processChildren(cardHeader)
    output += this.wrapBlock('wp:group', headerAttrs,
      '<div class="card-header wp-block-group">' + headerContent + '</div>'
    )
  }

  if (cardBody) {
    this.trackCss('card-body')
    const bodyAttrs = { className: 'card-body' }
    const bodyContent = this.processCardBodyContent(cardBody)
    output += this.wrapBlock('wp:group', bodyAttrs,
      '<div class="card-body wp-block-group">' + bodyContent + '</div>'
    )
  }

  if (cardFooter) {
    this.trackCss('card-footer')
    this.trackCss('text-muted')
    const footerAttrs = { className: 'card-footer' }
    // Card footer content must be wrapped in a block (not raw text)
    const footerText = cardFooter.textContent.trim()
    const footerContent = this.wrapBlock('wp:paragraph', { className: 'text-muted', fontSize: 'small' },
      '<p class="has-small-font-size text-muted">' + footerText + '</p>'
    )
    output += this.wrapBlock('wp:group', footerAttrs,
      '<div class="card-footer wp-block-group">' + footerContent + '</div>'
    )
  }

  return output
}

/**
 * Process card-body children with Bootstrap class names
 * @param {Element} el - Card body element
 * @returns {string} Gutenberg block markup
 */
export function processCardBodyContent(el) {
  // Process card-body children with Bootstrap class names
  let output = ''

  for (const child of el.children) {
    const tagName = child.tagName.toLowerCase()

    if (child.classList.contains('card-title')) {
      this.trackCss('card-title')
      const level = tagName.match(/^h([1-6])$/) ? parseInt(tagName.charAt(1)) : 5
      const attrs = { level: level, className: 'card-title' }
      output += this.wrapBlock('wp:heading', attrs,
        '<' + tagName + ' class="card-title wp-block-heading">' + child.innerHTML + '</' + tagName + '>'
      )
    } else if (child.classList.contains('card-text')) {
      this.trackCss('card-text')
      const attrs = { className: 'card-text' }
      output += this.wrapBlock('wp:paragraph', attrs,
        '<p class="card-text">' + child.innerHTML + '</p>'
      )
    } else if (child.classList.contains('btn')) {
      output += this.handleButton(child)
    } else {
      output += this.processNode(child)
    }
  }

  return output
}

/**
 * Handle Bootstrap card
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleCard(el) {
  this.trackCss('card')

  // Collect all classes from original element
  const originalClasses = Array.from(el.classList || [])

  // Separate utility classes from card class
  // Utility classes like width-25-desktop should pass through
  const utilityClasses = originalClasses.filter(cls =>
    cls !== 'card' && (
      cls.startsWith('width-') ||
      cls.startsWith('m-') || cls.startsWith('mt-') || cls.startsWith('mb-') ||
      cls.startsWith('ms-') || cls.startsWith('me-') || cls.startsWith('mx-') || cls.startsWith('my-') ||
      cls.startsWith('p-') || cls.startsWith('pt-') || cls.startsWith('pb-') ||
      cls.startsWith('ps-') || cls.startsWith('pe-') || cls.startsWith('px-') || cls.startsWith('py-') ||
      cls.startsWith('gap-') || cls.startsWith('order-') ||
      cls.startsWith('hide-') || cls.startsWith('show-') ||
      cls.startsWith('stack-') || cls.startsWith('text-')
    )
  )

  // Custom classes (not Bootstrap, not utility)
  const customClasses = originalClasses.filter(cls =>
    cls !== 'card' && !utilityClasses.includes(cls) &&
    !cls.startsWith('d-') && !cls.startsWith('flex-') &&
    !cls.startsWith('justify-') && !cls.startsWith('align-')
  )

  // Build className: utility classes + custom classes + card
  const classNames = [...utilityClasses, ...customClasses, 'card'].filter(Boolean)
  const attrs = { className: classNames.join(' ') }

  // Preserve inline styles with matching JSON decorator
  const originalStyle = el.getAttribute('style') || ''
  if (originalStyle) {
    // Parse style to JSON format for decorator
    const styleObj = {}
    originalStyle.split(';').forEach(decl => {
      const [prop, value] = decl.split(':').map(s => s.trim())
      if (prop && value) {
        // Convert CSS property to camelCase for JSON
        const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        styleObj[camelProp] = value
      }
    })
    if (Object.keys(styleObj).length > 0) {
      attrs.style = styleObj
    }
  }
  const styleAttr = originalStyle ? ' style="' + originalStyle + '"' : ''

  // Use proper card children processing with Bootstrap classes
  const children = this.processCardChildrenWithClasses(el)

  // Build class list: wp-block-column + utility + custom + card
  const divClasses = ['wp-block-column', ...utilityClasses, ...customClasses, 'card'].filter(Boolean)

  return this.wrapBlock('wp:column', attrs,
    '<div class="' + divClasses.join(' ') + '"' + styleAttr + '>' + children + '</div>'
  )
}

/**
 * Handle card content without wrapping
 * @param {Element} el - Card element
 * @returns {string} Gutenberg block markup
 */
export function handleCardContent(el) {
  // Process card content without wrapping in a group block
  // Used when card is inside a card-group (column handles the wrapper)
  return this.processCardChildren(el)
}

/**
 * Process card children
 * @param {Element} el - Card element
 * @returns {string} Gutenberg block markup
 */
export function processCardChildren(el) {
  let output = ''

  // Look for card-body, card-header, card-footer
  const cardBody = el.querySelector('.card-body')
  const cardHeader = el.querySelector('.card-header')
  const cardFooter = el.querySelector('.card-footer')
  const cardImg = el.querySelector('.card-img-top, .card-img')

  if (cardImg) {
    output += this.handleImage(cardImg)
  }

  if (cardHeader) {
    output += this.processChildren(cardHeader)
  }

  if (cardBody) {
    output += this.processChildren(cardBody)
  } else {
    output += this.processChildren(el)
  }

  if (cardFooter) {
    output += this.processChildren(cardFooter)
  }

  return output
}

/**
 * Handle Bootstrap alert
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleAlert(el) {
  // Track base alert CSS
  this.trackCss('alert')

  // Track variant-specific CSS
  const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
  for (const variant of variants) {
    if (this.hasClass(el, 'alert-' + variant)) {
      this.trackCss('alert-' + variant)
    }
  }

  // If dismissible, use wp:html to preserve Bootstrap JS functionality
  if (this.hasClass(el, 'alert-dismissible')) {
    this.trackCss('alert-dismissible')
    return this.wrapHtmlBlock(el.outerHTML)
  }

  // Filter out layout classes that Gutenberg handles
  const layoutClasses = ['d-flex', 'align-items-center', 'align-items-start', 'align-items-end']
  const filteredClasses = Array.from(el.classList)
    .filter(c => !layoutClasses.includes(c))
    .join(' ')

  // Check if this is a flex layout alert (has d-flex)
  const isFlexAlert = this.hasClass(el, 'd-flex')

  // If contains SVG (icon alerts), convert to native block with SVG in wp:html
  if (el.querySelector('svg')) {
    const svg = el.querySelector('svg')
    const textContent = el.textContent.trim()

    const attrs = {
      className: filteredClasses,
      layout: isFlexAlert
        ? { type: 'flex', verticalAlignment: 'center' }
        : { type: 'default' }
    }

    // SVG as wp:html, text as paragraph
    const svgBlock = this.wrapHtmlBlock(svg.outerHTML)
    const textBlock = this.wrapBlock('wp:paragraph', {},
      '<p>' + textContent + '</p>'
    )

    return this.wrapBlock('wp:group', attrs,
      '<div class="' + filteredClasses + ' wp-block-group">' + svgBlock + textBlock + '</div>'
    )
  }

  // Convert to wp:group with alert classes
  const content = el.textContent.trim()

  const attrs = {
    className: filteredClasses,
    layout: { type: 'default' }
  }
  const innerBlock = this.wrapBlock('wp:paragraph', {},
    '<p>' + content + '</p>'
  )

  return this.wrapBlock('wp:group', attrs,
    '<div class="' + filteredClasses + ' wp-block-group">' + innerBlock + '</div>'
  )
}

/**
 * Handle Bootstrap breadcrumb
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleBreadcrumb(el) {
  // Convert to native wp:group (nav) with wp:list
  this.trackCss('breadcrumb')

  // Find the ol.breadcrumb (might be the element itself or inside nav)
  const ol = el.tagName.toLowerCase() === 'ol' ? el : el.querySelector('ol.breadcrumb')
  if (!ol) {
    return this.wrapHtmlBlock(el.outerHTML)
  }

  // Build list items
  let listItems = ''
  const items = ol.querySelectorAll(':scope > li')
  for (const li of items) {
    const link = li.querySelector('a')
    const isActive = li.classList.contains('active')
    let itemContent = ''

    if (link) {
      itemContent = '<a href="' + (link.getAttribute('href') || '#') + '">' + link.textContent.trim() + '</a>'
    } else {
      itemContent = li.textContent.trim()
    }

    const itemClasses = isActive ? 'breadcrumb-item active' : 'breadcrumb-item'
    listItems += this.wrapBlock('wp:list-item', { className: itemClasses },
      '<li class="' + itemClasses + '">' + itemContent + '</li>'
    )
  }

  // Wrap in wp:list (ordered)
  const listBlock = this.wrapBlock('wp:list', { ordered: true, className: 'breadcrumb' },
    '<ol class="breadcrumb wp-block-list">' + listItems + '</ol>'
  )

  // If original was nav, wrap in wp:group with tagName nav
  if (el.tagName.toLowerCase() === 'nav') {
    const navAttrs = {
      tagName: 'nav',
      className: 'breadcrumb-nav',
      layout: { type: 'default' }
    }
    return this.wrapBlock('wp:group', navAttrs,
      '<nav class="breadcrumb-nav wp-block-group">' + listBlock + '</nav>'
    )
  }

  return listBlock
}

/**
 * Handle Bootstrap button group
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleButtonGroup(el) {
  // Convert btn-group to native blocks
  this.trackCss('btn-group')

  const isVertical = this.hasClass(el, 'btn-group-vertical')

  // If contains form inputs (checkbox/radio toggle), use wp:html
  if (el.querySelector('input')) {
    return this.wrapHtmlBlock(el.outerHTML)
  }

  // Check for dropdown elements
  const hasDropdown = el.querySelector('[data-bs-toggle="dropdown"]') || el.querySelector('.dropdown-menu')
  const dropdownMenu = el.querySelector('.dropdown-menu')

  let output = ''

  // Get all direct button children (not buttons inside dropdown-menu)
  const buttons = el.querySelectorAll(':scope > .btn, :scope > button.btn')

  for (const btn of buttons) {
    const isDropdownToggle = btn.hasAttribute('data-bs-toggle') && btn.getAttribute('data-bs-toggle') === 'dropdown'

    if (isDropdownToggle) {
      // Dropdown toggle button - preserve data attributes
      output += this.handleDropdownToggleButton(btn)
    } else {
      // Regular button
      output += this.handleButton(btn, true)
    }
  }

  // If there's a dropdown menu, convert it
  if (dropdownMenu) {
    this.trackCss('dropdown')
    output += this.handleDropdownMenu(dropdownMenu)
  }

  // Wrap in wp:group with btn-group class (use group for dropdown support)
  const layoutType = isVertical
    ? { type: 'flex', orientation: 'vertical' }
    : { type: 'flex', flexWrap: 'nowrap' }

  const attrs = {
    className: 'btn-group',
    layout: layoutType
  }

  return this.wrapBlock('wp:group', attrs,
    '<div class="btn-group wp-block-group">' + output + '</div>'
  )
}

/**
 * Handle dropdown toggle button
 * @param {Element} el - Button element
 * @returns {string} Gutenberg block markup
 */
export function handleDropdownToggleButton(el) {
  const colors = this.extractButtonColors(el)
  const isOutline = this.isOutlineButton(el)
  const isSplit = this.hasClass(el, 'dropdown-toggle-split')

  const buttonAttrs = {}
  // Start with base class only - wp-element-button must come LAST per WordPress block validation
  const linkClasses = ['wp-block-button__link']
  const wrapperClasses = ['wp-block-button', 'dropdown-toggle']

  if (isSplit) {
    wrapperClasses.push('dropdown-toggle-split')
  }

  if (colors.backgroundColor && !isOutline) {
    buttonAttrs.backgroundColor = colors.backgroundColor
    linkClasses.push('has-' + colors.backgroundColor + '-background-color', 'has-background')
    buttonAttrs.textColor = 'white'
    linkClasses.push('has-white-color', 'has-text-color')
  }

  if (isOutline) {
    buttonAttrs.className = 'is-style-outline dropdown-toggle'
    wrapperClasses.push('is-style-outline')
    // Apply outline color as textColor (controls border and text in WP outline buttons)
    if (colors.outlineColor) {
      buttonAttrs.textColor = colors.outlineColor
      linkClasses.push('has-' + colors.outlineColor + '-color', 'has-text-color')
    }
  } else {
    buttonAttrs.className = wrapperClasses.slice(1).join(' ') // Skip wp-block-button
  }

  // wp-element-button MUST be last class per WordPress block validation
  linkClasses.push('wp-element-button')

  // Get button content (may include visually-hidden span for split buttons)
  const text = el.innerHTML

  const buttonHtml = '<div class="' + wrapperClasses.join(' ') + '"><a class="' + linkClasses.join(' ') +
    '" href="#" data-bs-toggle="dropdown" aria-expanded="false">' + text + '</a></div>'

  return this.wrapBlock('wp:button', buttonAttrs, buttonHtml)
}

/**
 * Handle dropdown menu
 * @param {Element} el - Dropdown menu element
 * @returns {string} Gutenberg block markup
 */
export function handleDropdownMenu(el) {
  const menuItems = el.querySelectorAll(':scope > li')
  let listInner = ''

  for (const item of menuItems) {
    const divider = item.querySelector('.dropdown-divider, hr')
    if (divider) {
      listInner += this.wrapBlock('wp:list-item', {},
        '<li><hr class="dropdown-divider"></li>'
      )
    } else {
      const link = item.querySelector('a')
      if (link) {
        const href = link.getAttribute('href') || '#'
        const text = link.textContent.trim()
        listInner += this.wrapBlock('wp:list-item', {},
          '<li><a class="dropdown-item" href="' + href + '">' + text + '</a></li>'
        )
      } else {
        listInner += this.wrapBlock('wp:list-item', {},
          '<li>' + item.innerHTML + '</li>'
        )
      }
    }
  }

  const listAttrs = { className: 'dropdown-menu' }
  return this.wrapBlock('wp:list', listAttrs,
    '<ul class="dropdown-menu wp-block-list">' + listInner + '</ul>'
  )
}

/**
 * Handle Bootstrap list-group
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleListGroup(el) {
  // List group -> wp:list with list-group class
  this.trackCss('list-group')
  const items = el.querySelectorAll('.list-group-item')
  let listItems = ''

  for (const item of items) {
    this.trackCss('list-group-item')

    // Extract text and badge content
    let textContent = ''
    let badgeHtml = ''

    for (const node of item.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        textContent += node.textContent.trim()
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (this.hasClass(node, 'badge')) {
          this.trackCss('badge')
          this.trackUtilityClasses(node)
          const badgeClasses = Array.from(node.classList).join(' ')
          badgeHtml = ' <span class="' + badgeClasses + '">' + node.textContent.trim() + '</span>'
        }
      }
    }

    // Build list item with inline badge if present
    const itemContent = textContent + badgeHtml
    listItems += this.wrapBlock('wp:list-item', { className: 'list-group-item' },
      '<li class="list-group-item">' + itemContent + '</li>'
    )
  }

  const listAttrs = { className: 'list-group' }
  return this.wrapBlock('wp:list', listAttrs,
    '<ul class="list-group wp-block-list">' + listItems + '</ul>'
  )
}

/**
 * Handle Bootstrap table
 * @param {Element} el - DOM element
 * @returns {string} Gutenberg block markup
 */
export function handleTable(el) {
  // Convert Bootstrap table to wp:table block
  this.trackCss('table')

  const attrs = {}
  const classes = []

  // Map Bootstrap table classes to Gutenberg styles
  if (this.hasClass(el, 'table-striped')) {
    classes.push('is-style-stripes')
  }
  if (this.hasClass(el, 'table-bordered')) {
    classes.push('table-bordered')
    this.trackCss('table-bordered')
  }
  if (this.hasClass(el, 'table-hover')) {
    classes.push('table-hover')
    this.trackCss('table-hover')
  }
  if (this.hasClass(el, 'table-sm')) {
    classes.push('table-sm')
    this.trackCss('table-sm')
  }

  // Track color utility classes
  this.trackUtilityClasses(el)

  if (classes.length > 0) {
    attrs.className = classes.join(' ')
  }

  // Helper to build cell with preserved attributes
  const buildCell = (cell) => {
    const tag = cell.tagName.toLowerCase()
    let attrStr = ''

    // Preserve important table attributes
    if (cell.hasAttribute('scope')) {
      attrStr += ' scope="' + cell.getAttribute('scope') + '"'
    }
    if (cell.hasAttribute('colspan')) {
      attrStr += ' colspan="' + cell.getAttribute('colspan') + '"'
    }
    if (cell.hasAttribute('rowspan')) {
      attrStr += ' rowspan="' + cell.getAttribute('rowspan') + '"'
    }

    return '<' + tag + attrStr + '>' + cell.textContent.trim() + '</' + tag + '>'
  }

  // Build thead
  let theadHtml = ''
  const thead = el.querySelector('thead')
  if (thead) {
    let headerRows = ''
    for (const row of thead.querySelectorAll('tr')) {
      let headerCells = ''
      for (const cell of row.querySelectorAll('th, td')) {
        headerCells += buildCell(cell)
      }
      headerRows += '<tr>' + headerCells + '</tr>'
    }
    theadHtml = '<thead>' + headerRows + '</thead>'
  }

  // Build tbody
  let tbodyHtml = ''
  const tbody = el.querySelector('tbody')
  if (tbody) {
    let bodyRows = ''
    for (const row of tbody.querySelectorAll('tr')) {
      let bodyCells = ''
      for (const cell of row.querySelectorAll('th, td')) {
        bodyCells += buildCell(cell)
      }
      bodyRows += '<tr>' + bodyCells + '</tr>'
    }
    tbodyHtml = '<tbody>' + bodyRows + '</tbody>'
  }

  // Build tfoot if present
  let tfootHtml = ''
  const tfoot = el.querySelector('tfoot')
  if (tfoot) {
    let footRows = ''
    for (const row of tfoot.querySelectorAll('tr')) {
      let footCells = ''
      for (const cell of row.querySelectorAll('th, td')) {
        footCells += buildCell(cell)
      }
      footRows += '<tr>' + footCells + '</tr>'
    }
    tfootHtml = '<tfoot>' + footRows + '</tfoot>'
  }

  const figureClass = 'wp-block-table' + (classes.length > 0 ? ' ' + classes.join(' ') : '')
  const tableHtml = '<figure class="' + figureClass + '"><table>' + theadHtml + tbodyHtml + tfootHtml + '</table></figure>'

  return this.wrapBlock('wp:table', attrs, tableHtml)
}
