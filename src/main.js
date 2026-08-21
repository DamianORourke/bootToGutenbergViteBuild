/**
 * bootToGutenberg - Main Entry Point
 *
 * This is the Vite entry point that initializes the application.
 * All modules are imported here and wired together.
 */

// Core converter (Phase 3 - COMPLETE)
import { BootstrapToGutenbergConverter } from './core/Converter.js'

// Data modules (Phase 2 - COMPLETE)
import { cssLibrary, getCssForComponents, getComponentsByType } from './data/cssLibrary.js'
import { examples, exampleNames, exampleCategories, notDevelopedExamples } from './data/examples.js'

// UI modules (Phase 4)
// import { initConversionUI } from './ui/conversion.js'
// import { initPreviewUI } from './ui/preview.js'
// import { initCssPanel } from './ui/cssPanel.js'
// import { initExamplesUI } from './ui/examplesUI.js'

// =============================================================================
// APPLICATION STATE
// =============================================================================

const converter = new BootstrapToGutenbergConverter()
let currentExample = null
let currentView = 'code'
let usedCssComponents = new Set()
let generatedCustomClasses = []

// =============================================================================
// INITIALIZATION
// =============================================================================

console.log('bootToGutenberg: Vite module loaded')

/**
 * Initialize the application
 */
function init() {
  console.log('bootToGutenberg: Initializing...')

  // Populate examples dropdown from data module
  populateExamplesDropdown()

  // Bind event listeners (replaces inline onclick handlers)
  bindEventListeners()

  // Initialize UI state
  updateStats()

  console.log('bootToGutenberg: Ready')
  console.log(`bootToGutenberg: Loaded ${Object.keys(examples).length} examples`)
  console.log(`bootToGutenberg: Loaded ${Object.keys(cssLibrary).length} CSS components`)
}

/**
 * Populate the examples dropdown from the data module
 */
function populateExamplesDropdown() {
  const menu = document.getElementById('examplesMenu')
  if (!menu) return

  menu.innerHTML = ''

  for (const [category, keys] of Object.entries(exampleCategories)) {
    // Category header
    const header = document.createElement('div')
    header.className = 'dropdown-category'
    header.textContent = category
    menu.appendChild(header)

    // Example buttons
    for (const key of keys) {
      const btn = document.createElement('button')
      btn.className = 'dropdown-item'
      btn.textContent = exampleNames[key] || key

      // Add (*) for not developed examples
      if (notDevelopedExamples.includes(key)) {
        btn.textContent += ' (*)'
      }

      btn.addEventListener('click', () => loadExample(key))
      menu.appendChild(btn)
    }
  }
}

/**
 * Bind all event listeners
 * Replaces inline onclick="" attributes from original HTML
 */
function bindEventListeners() {
  // Main action buttons
  document.getElementById('convertBtn')?.addEventListener('click', convert)
  document.getElementById('clearBtn')?.addEventListener('click', clearAll)
  document.getElementById('copyBtn')?.addEventListener('click', copyOutput)
  document.getElementById('cssBtn')?.addEventListener('click', showCssPanel)

  // Examples dropdown
  document.getElementById('examplesBtn')?.addEventListener('click', toggleDropdown)

  // View toggle
  document.getElementById('codeViewBtn')?.addEventListener('click', () => setInputView('code'))
  document.getElementById('previewViewBtn')?.addEventListener('click', () => setInputView('preview'))

  // CSS panel
  document.getElementById('cssPanelOverlay')?.addEventListener('click', hideCssPanel)
  document.getElementById('cssPanelClose')?.addEventListener('click', hideCssPanel)
  document.getElementById('copyAllCssBtn')?.addEventListener('click', () => copyCss('all'))
  document.getElementById('copySelectedCssBtn')?.addEventListener('click', () => copyCss('selected'))

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.dropdown')
    if (dropdown && !dropdown.contains(e.target)) {
      document.getElementById('examplesMenu')?.classList.remove('show')
    }
  })

  // Input change handlers
  const inputHtml = document.getElementById('inputHtml')
  if (inputHtml) {
    inputHtml.addEventListener('input', () => {
      updateStats()
      if (currentView === 'preview') {
        updatePreview()
      }
    })
  }
}

// =============================================================================
// EXAMPLES FUNCTIONS
// =============================================================================

/**
 * Load an example into the input textarea
 */
function loadExample(name) {
  if (examples[name]) {
    currentExample = name
    document.getElementById('inputHtml').value = examples[name]
    document.getElementById('examplesMenu').classList.remove('show')
    updateStats()

    // Update selected indicator
    document.getElementById('selectedExample').textContent = exampleNames[name] || name

    // Highlight selected item in dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('selected'))
    const selectedItem = document.querySelector(`.dropdown-item[data-example="${name}"]`)
    if (selectedItem) selectedItem.classList.add('selected')

    // Update preview if active
    if (currentView === 'preview') {
      updatePreview()
    }
  }
}

function toggleDropdown() {
  document.getElementById('examplesMenu')?.classList.toggle('show')
}

// =============================================================================
// CONVERSION FUNCTIONS (Phase 3 - Placeholder)
// =============================================================================

function convert() {
  const inputHtml = document.getElementById('inputHtml')?.value || ''

  if (!inputHtml.trim()) {
    document.getElementById('outputHtml').textContent = ''
    document.getElementById('warningsList').innerHTML = '<div class="no-warnings">No warnings - ready to convert</div>'
    document.getElementById('cssBtn').disabled = true
    return
  }

  // Convert
  const output = converter.convert(inputHtml)
  document.getElementById('outputHtml').textContent = output

  // Update warnings
  const warnings = converter.getWarnings()
  const warningsList = document.getElementById('warningsList')

  if (warnings.length > 0) {
    warningsList.innerHTML = warnings.map(w => {
      const icon = w.type === 'error' ? '!' : w.type === 'warning' ? '⚠' : 'i'
      return `<div class="warning-item ${w.type}">${icon} ${w.message}</div>`
    }).join('')
  } else {
    warningsList.innerHTML = '<div class="no-warnings">No warnings - conversion complete</div>'
  }

  // Update CSS tracking
  usedCssComponents = new Set(converter.getUsedCssComponents())
  generatedCustomClasses = converter.getGeneratedCustomClasses()
  const cssBtn = document.getElementById('cssBtn')
  const totalCount = usedCssComponents.size + generatedCustomClasses.length
  if (totalCount > 0) {
    cssBtn.disabled = false
    let btnText = 'CSS Styles ('
    if (generatedCustomClasses.length > 0) {
      btnText += generatedCustomClasses.length + ' generated'
      if (usedCssComponents.size > 0) btnText += ', '
    }
    if (usedCssComponents.size > 0) {
      btnText += usedCssComponents.size + ' util'
    }
    btnText += ')'
    cssBtn.textContent = btnText
  } else {
    cssBtn.disabled = true
    cssBtn.textContent = 'CSS Styles'
  }

  // Update stats
  updateStats()

  console.log('bootToGutenberg: Conversion complete')
  console.log(`bootToGutenberg: ${usedCssComponents.size} CSS components used`)
}

// =============================================================================
// UI FUNCTIONS
// =============================================================================

function clearAll() {
  document.getElementById('inputHtml').value = ''
  document.getElementById('outputHtml').textContent = ''
  document.getElementById('warningsList').innerHTML = '<div class="no-warnings">No warnings - ready to convert</div>'
  const cssBtn = document.getElementById('cssBtn')
  cssBtn.disabled = true
  cssBtn.textContent = 'CSS Styles'
  document.getElementById('selectedExample').textContent = 'Custom HTML'
  currentExample = null
  usedCssComponents.clear()
  generatedCustomClasses = []
  updateStats()
}

function copyOutput() {
  const output = document.getElementById('outputHtml').textContent
  if (output) {
    navigator.clipboard.writeText(output)
    showNotification('Copied to clipboard!')
  }
}

function setInputView(view) {
  currentView = view
  const codeBtn = document.getElementById('codeViewBtn')
  const previewBtn = document.getElementById('previewViewBtn')
  const input = document.getElementById('inputHtml')
  const preview = document.getElementById('previewFrame')

  if (view === 'code') {
    codeBtn?.classList.add('active')
    previewBtn?.classList.remove('active')
    if (input) input.style.display = 'block'
    if (preview) preview.style.display = 'none'
  } else {
    codeBtn?.classList.remove('active')
    previewBtn?.classList.add('active')
    if (input) input.style.display = 'none'
    if (preview) preview.style.display = 'block'
    updatePreview()
  }
}

function updatePreview() {
  const html = document.getElementById('inputHtml')?.value || ''
  const preview = document.getElementById('previewFrame')
  if (!preview) return

  const previewHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
      <style>body { padding: 1rem; background: #fff; }</style>
    </head>
    <body>${html}</body>
    </html>
  `
  preview.srcdoc = previewHtml
}

function updateStats() {
  const input = document.getElementById('inputHtml')?.value || ''
  const output = document.getElementById('outputHtml')?.textContent || ''
  document.getElementById('inputStats').textContent = input.length
  document.getElementById('outputStats').textContent = output.length
}

function showNotification(message) {
  const notification = document.getElementById('copyNotification')
  if (notification) {
    notification.textContent = message
    notification.classList.add('show')
    setTimeout(() => notification.classList.remove('show'), 2000)
  }
}

// =============================================================================
// CSS PANEL FUNCTIONS
// =============================================================================

function showCssPanel() {
  const totalCount = usedCssComponents.size + generatedCustomClasses.length
  if (totalCount === 0) {
    alert('No CSS components used yet. Run a conversion first.')
    return
  }

  const componentsContainer = document.getElementById('cssComponents')
  const cssOutput = document.getElementById('cssOutput')

  if (!componentsContainer || !cssOutput) return

  componentsContainer.innerHTML = ''

  // Show generated custom classes first
  if (generatedCustomClasses.length > 0) {
    const header = document.createElement('div')
    header.className = 'css-group-header'
    header.textContent = 'Generated Classes'
    componentsContainer.appendChild(header)

    for (const gc of generatedCustomClasses) {
      const item = document.createElement('label')
      item.className = 'css-component-item'
      item.innerHTML = `
        <input type="checkbox" checked data-generated="${gc.className}">
        <span>.${gc.className}</span>
      `
      item.querySelector('input').addEventListener('change', updateCssOutput)
      componentsContainer.appendChild(item)
    }
  }

  // Group components by type
  const grouped = getComponentsByType()

  // Build checkboxes grouped by type
  for (const [type, components] of Object.entries(grouped)) {
    // Only show types that have used components
    const usedInType = Object.keys(components).filter(name => usedCssComponents.has(name))
    if (usedInType.length === 0) continue

    // Type header
    const header = document.createElement('div')
    header.className = 'css-group-header'
    header.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's'
    componentsContainer.appendChild(header)

    // Checkboxes
    for (const name of usedInType) {
      const component = components[name]
      const item = document.createElement('label')
      item.className = 'css-component-item'
      item.innerHTML = `
        <input type="checkbox" checked data-component="${name}">
        <span>${component.name}</span>
        ${component.maps ? `<span class="css-map-info">${component.maps}</span>` : ''}
      `
      item.querySelector('input').addEventListener('change', updateCssOutput)
      componentsContainer.appendChild(item)
    }
  }

  // Update count and output
  let countText = ''
  if (generatedCustomClasses.length > 0) countText += `${generatedCustomClasses.length} generated, `
  countText += `${usedCssComponents.size} components`
  document.getElementById('cssCount').textContent = countText
  updateCssOutput()

  // Show panel
  document.getElementById('cssPanelOverlay')?.classList.add('show')
  document.getElementById('cssPanel')?.classList.add('show')
}

function hideCssPanel() {
  document.getElementById('cssPanelOverlay')?.classList.remove('show')
  document.getElementById('cssPanel')?.classList.remove('show')
}

function updateCssOutput() {
  const checkboxes = document.querySelectorAll('#cssComponents input[type="checkbox"]:checked')
  const cssBlocks = []

  // Get generated custom class CSS
  checkboxes.forEach(cb => {
    if (cb.dataset.generated) {
      const gc = generatedCustomClasses.find(g => g.className === cb.dataset.generated)
      if (gc) {
        cssBlocks.push('/* Generated from Bootstrap utilities */\n' + gc.css)
      }
    }
  })

  // Get library component CSS
  const selectedComponents = Array.from(checkboxes)
    .filter(cb => cb.dataset.component)
    .map(cb => cb.dataset.component)
  if (selectedComponents.length > 0) {
    cssBlocks.push(getCssForComponents(selectedComponents))
  }

  document.getElementById('cssOutput').value = cssBlocks.join('\n\n')
}

function copyCss(mode) {
  let css = ''

  if (mode === 'all') {
    const cssBlocks = []
    // Add generated class CSS
    for (const gc of generatedCustomClasses) {
      cssBlocks.push('/* Generated from Bootstrap utilities */\n' + gc.css)
    }
    // Add component CSS
    if (usedCssComponents.size > 0) {
      cssBlocks.push(getCssForComponents(Array.from(usedCssComponents)))
    }
    css = cssBlocks.join('\n\n')
  } else {
    css = document.getElementById('cssOutput')?.value || ''
  }

  if (css) {
    navigator.clipboard.writeText(css)
    showNotification('CSS copied to clipboard!')
  }
}

// =============================================================================
// Initialize on DOM ready
// =============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Export for potential external use
export {
  convert,
  clearAll,
  copyOutput,
  loadExample,
  updateStats,
  cssLibrary,
  examples,
  exampleNames
}
