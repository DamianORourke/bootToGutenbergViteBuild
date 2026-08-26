/**
 * BootstrapToGutenbergConverter
 *
 * Main converter class that orchestrates the conversion of Bootstrap HTML
 * to WordPress Gutenberg block markup.
 *
 * Architecture:
 * - Constructor initializes mappings and state
 * - convert() is the main entry point
 * - processNode() dispatches to appropriate handlers
 * - Handlers are organized by category in separate modules
 * - Extractors pull attributes/classes from DOM elements
 * - Utils provide block wrapping and validation helpers
 *
 * Extracted from bootToGutenberg.html lines 309-2292
 */

// Import handlers (organized by category)
import {
  handleContainer,
  handleRow,
  handleColumn,
  handleGroup,
  handleFlexGroup,
  handleBorderElement
} from './handlers/layoutHandlers.js'

import {
  handleHeading,
  handleParagraph,
  handleButton,
  handleConsecutiveButtons,
  handleImage,
  handleBadge
} from './handlers/elementHandlers.js'

import {
  handleCard,
  handleCardGroup,
  handleCardContent,
  processCardChildren,
  processCardChildrenWithClasses,
  processCardBodyContent,
  handleAlert,
  handleBreadcrumb,
  handleButtonGroup,
  handleDropdownToggleButton,
  handleDropdownMenu,
  handleListGroup,
  handleTable
} from './handlers/componentHandlers.js'

import {
  handleAccordion,
  handleAccordionItem,
  handleAccordionHeader,
  handleAccordionCollapse,
  handleModal,
  handleCarousel,
  handleNavTabs,
  handleNavItem,
  handleTabContent,
  handleCollapse,
  handleDropdown,
  handleNavbar,
  handleToast
} from './handlers/interactiveHandlers.js'

// Import extractors
import {
  extractSpacing,
  extractColors,
  extractButtonColors,
  extractFontSize,
  extractTextAlign,
  extractJustifyContent,
  extractAlignItems,
  extractFlexDirection,
  extractColumnWidth,
  extractUtilityClasses,
  extractBootstrapClasses,
  extractDataAttributes,
  extractInlineStyle,
  extractUnmappedStyles,
  extractUtilityStyles,
  styleJsonToInlineCss
} from './extractors/attributeExtractor.js'

// Import utilities
import {
  wrapBlock,
  wrapHtmlBlock,
  wrapAsHtml,
  generateHtmlAttrs,
  convertSpacingToVar
} from './utils/blockFormatter.js'

import {
  hasClass,
  isColumn,
  hasFlexDisplay,
  hasBorderUtilities,
  hasUnmappedStyles,
  isOutlineButton
} from './utils/validators.js'

export class BootstrapToGutenbergConverter {
  constructor() {
    this.warnings = []
    this.indentLevel = 0
    this.indentStr = '  '
    this.parentTextAlign = null // Track inherited text alignment
    this.usedCssComponents = new Set() // Track CSS components needed

    // Spacing mappings: Bootstrap -> Theme slug
    this.spacingMap = {
      '0': '0',
      '1': '2xs',
      '2': 'sm',
      '3': 'md',
      '4': 'lg',
      '5': '2-xl'
    }

    // Color mappings: Bootstrap -> Theme slug
    this.bgColorMap = {
      'bg-primary': 'primary',
      'bg-secondary': 'secondary',
      'bg-success': 'success',
      'bg-danger': 'error',
      'bg-warning': 'warning',
      'bg-light': 'surface',
      'bg-dark': 'dark',
      'bg-white': 'white',
      'bg-transparent': 'transparent'
    }

    this.textColorMap = {
      'text-primary': 'primary',
      'text-secondary': 'text-secondary',
      'text-success': 'success',
      'text-danger': 'error',
      'text-warning': 'warning',
      'text-light': 'surface',
      'text-dark': 'dark',
      'text-white': 'white',
      'text-muted': 'text-muted'
    }

    // Font size mappings: Bootstrap -> Theme slug
    this.fontSizeMap = {
      'fs-1': '6x-large',
      'fs-2': '5x-large',
      'fs-3': '4x-large',
      'fs-4': '3x-large',
      'fs-5': '2x-large',
      'fs-6': 'x-large'
    }

    // Column width percentages
    this.colWidthMap = {
      '1': '8.33%',
      '2': '16.66%',
      '3': '25%',
      '4': '33.33%',
      '5': '41.66%',
      '6': '50%',
      '7': '58.33%',
      '8': '66.66%',
      '9': '75%',
      '10': '83.33%',
      '11': '91.66%',
      '12': '100%'
    }

    // Bootstrap spacing (0-5) to WordPress preset spacing (0, 20, 30, 40, 50, 60, 70, 80)
    // Bootstrap: 0=0, 1=0.25rem, 2=0.5rem, 3=1rem, 4=1.5rem, 5=3rem
    // GUC uses --wp--preset--spacing--{20,30,40,50,60,70,80}
    this.bootstrapSpacingToPreset = {
      '0': '0',
      '1': '20',
      '2': '30',
      '3': '40',
      '4': '50',
      '5': '50'  // BS 5 (3rem) maps to preset 50 (mobile-first)
    }

    // Utility class to inline style mapping
    // Maps Bootstrap utilities to CSS property-value pairs for inline styles
    this.utilityStyleMap = {
      // Display
      'd-flex': { 'display': 'flex' },
      'd-inline-flex': { 'display': 'inline-flex' },
      'd-block': { 'display': 'block' },
      'd-inline-block': { 'display': 'inline-block' },
      'd-inline': { 'display': 'inline' },
      'd-none': { 'display': 'none' },
      'd-grid': { 'display': 'grid' },

      // Flex direction
      'flex-row': { 'flex-direction': 'row' },
      'flex-column': { 'flex-direction': 'column' },
      'flex-row-reverse': { 'flex-direction': 'row-reverse' },
      'flex-column-reverse': { 'flex-direction': 'column-reverse' },

      // Flex wrap
      'flex-wrap': { 'flex-wrap': 'wrap' },
      'flex-nowrap': { 'flex-wrap': 'nowrap' },
      'flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },

      // Justify content
      'justify-content-start': { 'justify-content': 'flex-start' },
      'justify-content-end': { 'justify-content': 'flex-end' },
      'justify-content-center': { 'justify-content': 'center' },
      'justify-content-between': { 'justify-content': 'space-between' },
      'justify-content-around': { 'justify-content': 'space-around' },
      'justify-content-evenly': { 'justify-content': 'space-evenly' },

      // Align items
      'align-items-start': { 'align-items': 'flex-start' },
      'align-items-end': { 'align-items': 'flex-end' },
      'align-items-center': { 'align-items': 'center' },
      'align-items-baseline': { 'align-items': 'baseline' },
      'align-items-stretch': { 'align-items': 'stretch' },

      // Align self
      'align-self-start': { 'align-self': 'flex-start' },
      'align-self-end': { 'align-self': 'flex-end' },
      'align-self-center': { 'align-self': 'center' },
      'align-self-baseline': { 'align-self': 'baseline' },
      'align-self-stretch': { 'align-self': 'stretch' },

      // Flex grow/shrink
      'flex-grow-0': { 'flex-grow': '0' },
      'flex-grow-1': { 'flex-grow': '1' },
      'flex-shrink-0': { 'flex-shrink': '0' },
      'flex-shrink-1': { 'flex-shrink': '1' },

      // Gap (1,2 → sm, 3 → md, 4 → lg, 5 → xl)
      'gap-0': { 'gap': '0' },
      'gap-1': { 'gap': 'var(--wp--preset--spacing--sm)' },
      'gap-2': { 'gap': 'var(--wp--preset--spacing--sm)' },
      'gap-3': { 'gap': 'var(--wp--preset--spacing--md)' },
      'gap-4': { 'gap': 'var(--wp--preset--spacing--lg)' },
      'gap-5': { 'gap': 'var(--wp--preset--spacing--xl)' },

      // Border
      'border': { 'border-width': '1px', 'border-style': 'solid' },
      'border-0': { 'border-width': '0' },
      'border-1': { 'border-width': '1px' },
      'border-2': { 'border-width': '2px' },
      'border-3': { 'border-width': '3px' },
      'border-4': { 'border-width': '4px' },
      'border-5': { 'border-width': '5px' },

      // Border color
      'border-primary': { 'border-color': 'var(--wp--preset--color--primary)' },
      'border-secondary': { 'border-color': 'var(--wp--preset--color--secondary)' },
      'border-success': { 'border-color': 'var(--wp--preset--color--success)' },
      'border-danger': { 'border-color': 'var(--wp--preset--color--error)' },
      'border-warning': { 'border-color': 'var(--wp--preset--color--warning)' },
      'border-info': { 'border-color': 'var(--wp--preset--color--info)' },
      'border-light': { 'border-color': 'var(--wp--preset--color--surface)' },
      'border-dark': { 'border-color': 'var(--wp--preset--color--dark)' },
      'border-black': { 'border-color': '#000' },
      'border-white': { 'border-color': '#fff' },

      // Border radius (1,2 → sm, 3 → md, 4 → lg, 5 → xl)
      'rounded': { 'border-radius': 'var(--wp--preset--spacing--sm)' },
      'rounded-0': { 'border-radius': '0' },
      'rounded-1': { 'border-radius': 'var(--wp--preset--spacing--sm)' },
      'rounded-2': { 'border-radius': 'var(--wp--preset--spacing--sm)' },
      'rounded-3': { 'border-radius': 'var(--wp--preset--spacing--md)' },
      'rounded-4': { 'border-radius': 'var(--wp--preset--spacing--lg)' },
      'rounded-5': { 'border-radius': 'var(--wp--preset--spacing--xl)' },
      'rounded-circle': { 'border-radius': 'var(--wp--custom--border-radius--circle, 50%)' },
      'rounded-pill': { 'border-radius': 'var(--wp--custom--border-radius--pill, 50rem)' },

      // Shadows
      'shadow-none': { 'box-shadow': 'none' },
      'shadow-sm': { 'box-shadow': '0 0.125rem 0.25rem rgba(0,0,0,0.075)' },
      'shadow': { 'box-shadow': '0 0.5rem 1rem rgba(0,0,0,0.15)' },
      'shadow-lg': { 'box-shadow': '0 1rem 3rem rgba(0,0,0,0.175)' },
      'shadow-xl': { 'box-shadow': '0 1.5rem 4rem rgba(0,0,0,0.2)' },
      'shadow-1': { 'box-shadow': '0 0.125rem 0.25rem rgba(0,0,0,0.075)' },
      'shadow-2': { 'box-shadow': '0 0.25rem 0.5rem rgba(0,0,0,0.1)' },
      'shadow-3': { 'box-shadow': '0 0.5rem 1rem rgba(0,0,0,0.15)' },
      'shadow-4': { 'box-shadow': '0 0.75rem 1.5rem rgba(0,0,0,0.175)' },
      'shadow-5': { 'box-shadow': '0 1rem 2rem rgba(0,0,0,0.2)' },

      // Padding (1,2 → sm, 3 → md, 4 → lg, 5 → xl)
      'p-0': { 'padding': '0' },
      'p-1': { 'padding': 'var(--wp--preset--spacing--sm)' },
      'p-2': { 'padding': 'var(--wp--preset--spacing--sm)' },
      'p-3': { 'padding': 'var(--wp--preset--spacing--md)' },
      'p-4': { 'padding': 'var(--wp--preset--spacing--lg)' },
      'p-5': { 'padding': 'var(--wp--preset--spacing--xl)' },
      'pt-0': { 'padding-top': '0' },
      'pt-1': { 'padding-top': 'var(--wp--preset--spacing--sm)' },
      'pt-2': { 'padding-top': 'var(--wp--preset--spacing--sm)' },
      'pt-3': { 'padding-top': 'var(--wp--preset--spacing--md)' },
      'pt-4': { 'padding-top': 'var(--wp--preset--spacing--lg)' },
      'pt-5': { 'padding-top': 'var(--wp--preset--spacing--xl)' },
      'pb-0': { 'padding-bottom': '0' },
      'pb-1': { 'padding-bottom': 'var(--wp--preset--spacing--sm)' },
      'pb-2': { 'padding-bottom': 'var(--wp--preset--spacing--sm)' },
      'pb-3': { 'padding-bottom': 'var(--wp--preset--spacing--md)' },
      'pb-4': { 'padding-bottom': 'var(--wp--preset--spacing--lg)' },
      'pb-5': { 'padding-bottom': 'var(--wp--preset--spacing--xl)' },
      'ps-0': { 'padding-left': '0' },
      'ps-1': { 'padding-left': 'var(--wp--preset--spacing--sm)' },
      'ps-2': { 'padding-left': 'var(--wp--preset--spacing--sm)' },
      'ps-3': { 'padding-left': 'var(--wp--preset--spacing--md)' },
      'ps-4': { 'padding-left': 'var(--wp--preset--spacing--lg)' },
      'ps-5': { 'padding-left': 'var(--wp--preset--spacing--xl)' },
      'pe-0': { 'padding-right': '0' },
      'pe-1': { 'padding-right': 'var(--wp--preset--spacing--sm)' },
      'pe-2': { 'padding-right': 'var(--wp--preset--spacing--sm)' },
      'pe-3': { 'padding-right': 'var(--wp--preset--spacing--md)' },
      'pe-4': { 'padding-right': 'var(--wp--preset--spacing--lg)' },
      'pe-5': { 'padding-right': 'var(--wp--preset--spacing--xl)' },
      'px-0': { 'padding-left': '0', 'padding-right': '0' },
      'px-1': { 'padding-left': 'var(--wp--preset--spacing--sm)', 'padding-right': 'var(--wp--preset--spacing--sm)' },
      'px-2': { 'padding-left': 'var(--wp--preset--spacing--sm)', 'padding-right': 'var(--wp--preset--spacing--sm)' },
      'px-3': { 'padding-left': 'var(--wp--preset--spacing--md)', 'padding-right': 'var(--wp--preset--spacing--md)' },
      'px-4': { 'padding-left': 'var(--wp--preset--spacing--lg)', 'padding-right': 'var(--wp--preset--spacing--lg)' },
      'px-5': { 'padding-left': 'var(--wp--preset--spacing--xl)', 'padding-right': 'var(--wp--preset--spacing--xl)' },
      'py-0': { 'padding-top': '0', 'padding-bottom': '0' },
      'py-1': { 'padding-top': 'var(--wp--preset--spacing--sm)', 'padding-bottom': 'var(--wp--preset--spacing--sm)' },
      'py-2': { 'padding-top': 'var(--wp--preset--spacing--sm)', 'padding-bottom': 'var(--wp--preset--spacing--sm)' },
      'py-3': { 'padding-top': 'var(--wp--preset--spacing--md)', 'padding-bottom': 'var(--wp--preset--spacing--md)' },
      'py-4': { 'padding-top': 'var(--wp--preset--spacing--lg)', 'padding-bottom': 'var(--wp--preset--spacing--lg)' },
      'py-5': { 'padding-top': 'var(--wp--preset--spacing--xl)', 'padding-bottom': 'var(--wp--preset--spacing--xl)' },

      // Margin (1,2 → sm, 3 → md, 4 → lg, 5 → xl)
      'm-0': { 'margin': '0' },
      'm-1': { 'margin': 'var(--wp--preset--spacing--sm)' },
      'm-2': { 'margin': 'var(--wp--preset--spacing--sm)' },
      'm-3': { 'margin': 'var(--wp--preset--spacing--md)' },
      'm-4': { 'margin': 'var(--wp--preset--spacing--lg)' },
      'm-5': { 'margin': 'var(--wp--preset--spacing--xl)' },
      'm-auto': { 'margin': 'auto' },
      'mt-0': { 'margin-top': '0' },
      'mt-1': { 'margin-top': 'var(--wp--preset--spacing--sm)' },
      'mt-2': { 'margin-top': 'var(--wp--preset--spacing--sm)' },
      'mt-3': { 'margin-top': 'var(--wp--preset--spacing--md)' },
      'mt-4': { 'margin-top': 'var(--wp--preset--spacing--lg)' },
      'mt-5': { 'margin-top': 'var(--wp--preset--spacing--xl)' },
      'mt-auto': { 'margin-top': 'auto' },
      'mb-0': { 'margin-bottom': '0' },
      'mb-1': { 'margin-bottom': 'var(--wp--preset--spacing--sm)' },
      'mb-2': { 'margin-bottom': 'var(--wp--preset--spacing--sm)' },
      'mb-3': { 'margin-bottom': 'var(--wp--preset--spacing--md)' },
      'mb-4': { 'margin-bottom': 'var(--wp--preset--spacing--lg)' },
      'mb-5': { 'margin-bottom': 'var(--wp--preset--spacing--xl)' },
      'mb-auto': { 'margin-bottom': 'auto' },
      'ms-0': { 'margin-left': '0' },
      'ms-1': { 'margin-left': 'var(--wp--preset--spacing--sm)' },
      'ms-2': { 'margin-left': 'var(--wp--preset--spacing--sm)' },
      'ms-3': { 'margin-left': 'var(--wp--preset--spacing--md)' },
      'ms-4': { 'margin-left': 'var(--wp--preset--spacing--lg)' },
      'ms-5': { 'margin-left': 'var(--wp--preset--spacing--xl)' },
      'ms-auto': { 'margin-left': 'auto' },
      'me-0': { 'margin-right': '0' },
      'me-1': { 'margin-right': 'var(--wp--preset--spacing--sm)' },
      'me-2': { 'margin-right': 'var(--wp--preset--spacing--sm)' },
      'me-3': { 'margin-right': 'var(--wp--preset--spacing--md)' },
      'me-4': { 'margin-right': 'var(--wp--preset--spacing--lg)' },
      'me-5': { 'margin-right': 'var(--wp--preset--spacing--xl)' },
      'me-auto': { 'margin-right': 'auto' },
      'mx-0': { 'margin-left': '0', 'margin-right': '0' },
      'mx-1': { 'margin-left': 'var(--wp--preset--spacing--sm)', 'margin-right': 'var(--wp--preset--spacing--sm)' },
      'mx-2': { 'margin-left': 'var(--wp--preset--spacing--sm)', 'margin-right': 'var(--wp--preset--spacing--sm)' },
      'mx-3': { 'margin-left': 'var(--wp--preset--spacing--md)', 'margin-right': 'var(--wp--preset--spacing--md)' },
      'mx-4': { 'margin-left': 'var(--wp--preset--spacing--lg)', 'margin-right': 'var(--wp--preset--spacing--lg)' },
      'mx-5': { 'margin-left': 'var(--wp--preset--spacing--xl)', 'margin-right': 'var(--wp--preset--spacing--xl)' },
      'mx-auto': { 'margin-left': 'auto', 'margin-right': 'auto' },
      'my-0': { 'margin-top': '0', 'margin-bottom': '0' },
      'my-1': { 'margin-top': 'var(--wp--preset--spacing--sm)', 'margin-bottom': 'var(--wp--preset--spacing--sm)' },
      'my-2': { 'margin-top': 'var(--wp--preset--spacing--sm)', 'margin-bottom': 'var(--wp--preset--spacing--sm)' },
      'my-3': { 'margin-top': 'var(--wp--preset--spacing--md)', 'margin-bottom': 'var(--wp--preset--spacing--md)' },
      'my-4': { 'margin-top': 'var(--wp--preset--spacing--lg)', 'margin-bottom': 'var(--wp--preset--spacing--lg)' },
      'my-5': { 'margin-top': 'var(--wp--preset--spacing--xl)', 'margin-bottom': 'var(--wp--preset--spacing--xl)' },
      'my-auto': { 'margin-top': 'auto', 'margin-bottom': 'auto' },

      // Text alignment
      'text-start': { 'text-align': 'left' },
      'text-center': { 'text-align': 'center' },
      'text-end': { 'text-align': 'right' },

      // Text transform
      'text-lowercase': { 'text-transform': 'lowercase' },
      'text-uppercase': { 'text-transform': 'uppercase' },
      'text-capitalize': { 'text-transform': 'capitalize' },

      // Font weight
      'fw-light': { 'font-weight': '300' },
      'fw-lighter': { 'font-weight': 'lighter' },
      'fw-normal': { 'font-weight': '400' },
      'fw-medium': { 'font-weight': '500' },
      'fw-semibold': { 'font-weight': '600' },
      'fw-bold': { 'font-weight': '700' },
      'fw-bolder': { 'font-weight': 'bolder' },

      // Font style
      'fst-italic': { 'font-style': 'italic' },
      'fst-normal': { 'font-style': 'normal' },

      // Text decoration
      'text-decoration-none': { 'text-decoration': 'none' },
      'text-decoration-underline': { 'text-decoration': 'underline' },
      'text-decoration-line-through': { 'text-decoration': 'line-through' },

      // Position
      'position-static': { 'position': 'static' },
      'position-relative': { 'position': 'relative' },
      'position-absolute': { 'position': 'absolute' },
      'position-fixed': { 'position': 'fixed' },
      'position-sticky': { 'position': 'sticky' },

      // Overflow
      'overflow-auto': { 'overflow': 'auto' },
      'overflow-hidden': { 'overflow': 'hidden' },
      'overflow-visible': { 'overflow': 'visible' },
      'overflow-scroll': { 'overflow': 'scroll' },

      // Width/Height
      'w-25': { 'width': '25%' },
      'w-50': { 'width': '50%' },
      'w-75': { 'width': '75%' },
      'w-100': { 'width': '100%' },
      'w-auto': { 'width': 'auto' },
      'h-25': { 'height': '25%' },
      'h-50': { 'height': '50%' },
      'h-75': { 'height': '75%' },
      'h-100': { 'height': '100%' },
      'h-auto': { 'height': 'auto' }
    }

    // Track generated custom classes for CSS output
    this.generatedCustomClasses = []
    this.customClassCounter = 0

    // Interactive Bootstrap components (supported with data attributes preserved)
    this.interactiveComponents = [
      'accordion', 'modal', 'carousel', 'tab', 'collapse', 'offcanvas', 'dropdown'
    ]

    // Components requiring JS initialization (partial support)
    this.initRequiredComponents = [
      'tooltip', 'popover', 'toast'
    ]

    // Bootstrap to GUC (Gutenberg Utility Classes) mapping
    // Source: https://github.com/muax3000/gutenberg-utility-classes
    // Converts Bootstrap responsive classes to WordPress-native breakpoint classes
    this.bootstrapToGucMap = {
      // Visibility: d-none d-md-block pattern
      // Bootstrap uses min-width breakpoints; GUC uses mobile/tablet/desktop
      'd-none': 'hide-on-mobile hide-on-tablet hide-on-desktop',
      'd-sm-none': null,
      'd-md-none': null,
      'd-lg-none': null,
      'd-block': null,
      'd-sm-block': null,
      'd-md-block': null,
      'd-lg-block': null,

      // Stacking: flex-column flex-md-row pattern
      'flex-column': 'stack-from-mobile',
      'flex-md-row': null,
      'flex-lg-row': null,
    }

    // GUC width value mapping (Bootstrap col-N to GUC percentage)
    this.colToGucWidth = {
      '1': '10',
      '2': '20',
      '3': '25',
      '4': '33',
      '5': '40',
      '6': '50',
      '7': '60',
      '8': '66',
      '9': '75',
      '10': '80',
      '11': '90',
      '12': '100'
    }

    // Bootstrap breakpoint to GUC device mapping
    this.breakpointToDevice = {
      'xs': 'mobile',
      'sm': 'mobile',
      'md': 'tablet',
      'lg': 'desktop',
      'xl': 'desktop',
      'xxl': 'desktop'
    }

    // Bind external methods to this instance
    this._bindMethods()
  }

  /**
   * Bind imported handler/extractor/utility functions to this instance
   * This allows them to access converter state via 'this'
   */
  _bindMethods() {
    // Layout handlers
    this.handleContainer = handleContainer.bind(this)
    this.handleRow = handleRow.bind(this)
    this.handleColumn = handleColumn.bind(this)
    this.handleGroup = handleGroup.bind(this)
    this.handleFlexGroup = handleFlexGroup.bind(this)
    this.handleBorderElement = handleBorderElement.bind(this)

    // Element handlers
    this.handleHeading = handleHeading.bind(this)
    this.handleParagraph = handleParagraph.bind(this)
    this.handleButton = handleButton.bind(this)
    this.handleConsecutiveButtons = handleConsecutiveButtons.bind(this)
    this.handleImage = handleImage.bind(this)
    this.handleBadge = handleBadge.bind(this)

    // Component handlers
    this.handleCard = handleCard.bind(this)
    this.handleCardGroup = handleCardGroup.bind(this)
    this.handleCardContent = handleCardContent.bind(this)
    this.processCardChildren = processCardChildren.bind(this)
    this.processCardChildrenWithClasses = processCardChildrenWithClasses.bind(this)
    this.processCardBodyContent = processCardBodyContent.bind(this)
    this.handleAlert = handleAlert.bind(this)
    this.handleBreadcrumb = handleBreadcrumb.bind(this)
    this.handleButtonGroup = handleButtonGroup.bind(this)
    this.handleDropdownToggleButton = handleDropdownToggleButton.bind(this)
    this.handleDropdownMenu = handleDropdownMenu.bind(this)
    this.handleListGroup = handleListGroup.bind(this)
    this.handleTable = handleTable.bind(this)

    // Interactive handlers
    this.handleAccordion = handleAccordion.bind(this)
    this.handleAccordionItem = handleAccordionItem.bind(this)
    this.handleAccordionHeader = handleAccordionHeader.bind(this)
    this.handleAccordionCollapse = handleAccordionCollapse.bind(this)
    this.handleModal = handleModal.bind(this)
    this.handleCarousel = handleCarousel.bind(this)
    this.handleNavTabs = handleNavTabs.bind(this)
    this.handleNavItem = handleNavItem.bind(this)
    this.handleTabContent = handleTabContent.bind(this)
    this.handleCollapse = handleCollapse.bind(this)
    this.handleDropdown = handleDropdown.bind(this)
    this.handleNavbar = handleNavbar.bind(this)
    this.handleToast = handleToast.bind(this)

    // Extractors
    this.extractSpacing = extractSpacing.bind(this)
    this.extractColors = extractColors.bind(this)
    this.extractButtonColors = extractButtonColors.bind(this)
    this.extractFontSize = extractFontSize.bind(this)
    this.extractTextAlign = extractTextAlign.bind(this)
    this.extractJustifyContent = extractJustifyContent.bind(this)
    this.extractAlignItems = extractAlignItems.bind(this)
    this.extractFlexDirection = extractFlexDirection.bind(this)
    this.extractColumnWidth = extractColumnWidth.bind(this)
    this.extractUtilityClasses = extractUtilityClasses.bind(this)
    this.extractBootstrapClasses = extractBootstrapClasses.bind(this)
    this.extractDataAttributes = extractDataAttributes.bind(this)
    this.extractInlineStyle = extractInlineStyle.bind(this)
    this.extractUnmappedStyles = extractUnmappedStyles.bind(this)
    this.extractUtilityStyles = extractUtilityStyles.bind(this)
    this.styleJsonToInlineCss = styleJsonToInlineCss.bind(this)

    // Block formatting utilities
    this.wrapBlock = wrapBlock.bind(this)
    this.wrapHtmlBlock = wrapHtmlBlock.bind(this)
    this.wrapAsHtml = wrapAsHtml.bind(this)
    this.generateHtmlAttrs = generateHtmlAttrs.bind(this)
    this.convertSpacingToVar = convertSpacingToVar.bind(this)

    // Validators
    this.hasClass = hasClass.bind(this)
    this.isColumn = isColumn.bind(this)
    this.hasFlexDisplay = hasFlexDisplay.bind(this)
    this.hasBorderUtilities = hasBorderUtilities.bind(this)
    this.hasUnmappedStyles = hasUnmappedStyles.bind(this)
    this.isOutlineButton = isOutlineButton.bind(this)
  }

  /**
   * Main conversion entry point
   * @param {string} html - Bootstrap HTML to convert
   * @returns {string} - Gutenberg block markup
   */
  convert(html) {
    this.warnings = []
    this.indentLevel = 0
    this.usedCssComponents.clear()
    this.generatedCustomClasses = []
    this.customClassCounter = 0

    if (!html || !html.trim()) {
      return ''
    }

    // Check for unsupported components
    this.checkUnsupported(html)

    // Parse HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString('<div id="root">' + html + '</div>', 'text/html')
    const root = doc.getElementById('root')

    if (!root) {
      this.addWarning('error', 'Failed to parse HTML')
      return ''
    }

    // Process children
    let output = ''
    for (const child of root.childNodes) {
      output += this.processNode(child)
    }

    return output.trim()
  }

  /**
   * Check for unsupported or interactive components and add warnings
   */
  checkUnsupported(html) {
    const lowerHtml = html.toLowerCase()

    // Check for interactive components (supported with Bootstrap JS)
    for (const component of this.interactiveComponents) {
      if (lowerHtml.includes(component)) {
        this.addWarning('info', 'Interactive component detected: ' + component + ' (requires Bootstrap JS)')
      }
    }

    // Check for init-required components (partial support)
    for (const component of this.initRequiredComponents) {
      if (lowerHtml.includes(component)) {
        this.addWarning('warning', component + ' requires JS initialization - add Bootstrap.Tooltip/Popover.getInstance() call')
      }
    }

    // Check for responsive breakpoint classes
    const breakpointPattern = /col-(sm|md|lg|xl|xxl)-\d+/g
    if (breakpointPattern.test(html)) {
      this.addWarning('info', 'Responsive breakpoint classes will be simplified to single width values')
    }

    // Inform about data attributes (they WILL work with Bootstrap JS loaded)
    if (html.includes('data-bs-') || html.includes('data-toggle')) {
      this.addWarning('info', 'Bootstrap data attributes preserved - ensure Bootstrap JS is enqueued')
    }

    // Check for navbar (recommend nav walker for WP menus)
    if (lowerHtml.includes('navbar')) {
      this.addWarning('info', 'Navbar detected - consider using wp-bootstrap-navwalker for WP menus')
    }
  }

  /**
   * Process a DOM node and dispatch to appropriate handler
   */
  processNode(node) {
    // Skip text nodes that are only whitespace
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim()
      return text ? text : ''
    }

    // Skip non-element nodes
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const el = node
    const tagName = el.tagName.toLowerCase()

    // Determine element type and convert
    if (this.hasClass(el, 'container') || this.hasClass(el, 'container-fluid')) {
      return this.handleContainer(el)
    }

    if (this.hasClass(el, 'row')) {
      return this.handleRow(el)
    }

    if (this.isColumn(el)) {
      return this.handleColumn(el)
    }

    if (tagName.match(/^h[1-6]$/)) {
      return this.handleHeading(el)
    }

    if (tagName === 'p') {
      // Paragraphs with flex display should be handled as flex groups
      if (this.hasClass(el, 'd-flex') || this.hasClass(el, 'd-inline-flex') || this.hasFlexDisplay(el)) {
        return this.handleFlexGroup(el)
      }
      return this.handleParagraph(el)
    }

    if (this.hasClass(el, 'btn')) {
      return this.handleButton(el)
    }

    if (this.hasClass(el, 'card-group')) {
      return this.handleCardGroup(el)
    }

    if (this.hasClass(el, 'card')) {
      return this.handleCard(el)
    }

    if (this.hasClass(el, 'list-group')) {
      return this.handleListGroup(el)
    }

    if (tagName === 'img') {
      return this.handleImage(el)
    }

    // Check alert before d-flex (icon alerts have both classes)
    if (this.hasClass(el, 'alert')) {
      return this.handleAlert(el)
    }

    // Standalone badges
    if (this.hasClass(el, 'badge') && tagName === 'span') {
      return this.handleBadge(el)
    }

    // Breadcrumb navigation
    if (this.hasClass(el, 'breadcrumb') || (tagName === 'nav' && el.querySelector('.breadcrumb'))) {
      return this.handleBreadcrumb(el)
    }

    // Button group
    if (this.hasClass(el, 'btn-group') || this.hasClass(el, 'btn-group-vertical')) {
      return this.handleButtonGroup(el)
    }

    // Dropdown (check before d-flex as dropdowns may have flex classes)
    if (this.hasClass(el, 'dropdown')) {
      return this.handleDropdown(el)
    }

    // Check for flex display (including responsive variants)
    if (this.hasClass(el, 'd-flex') || this.hasFlexDisplay(el)) {
      return this.handleFlexGroup(el)
    }

    // Bootstrap interactive components
    if (this.hasClass(el, 'accordion')) {
      return this.handleAccordion(el)
    }

    if (this.hasClass(el, 'accordion-item')) {
      return this.handleAccordionItem(el)
    }

    if (this.hasClass(el, 'modal')) {
      return this.handleModal(el)
    }

    if (this.hasClass(el, 'carousel')) {
      return this.handleCarousel(el)
    }

    if (this.hasClass(el, 'nav-tabs') || this.hasClass(el, 'nav-pills')) {
      return this.handleNavTabs(el)
    }

    if (this.hasClass(el, 'tab-content')) {
      return this.handleTabContent(el)
    }

    if (this.hasClass(el, 'collapse') || this.hasClass(el, 'offcanvas')) {
      return this.handleCollapse(el)
    }

    if (this.hasClass(el, 'navbar')) {
      return this.handleNavbar(el)
    }

    if (this.hasClass(el, 'toast') || this.hasClass(el, 'toast-container')) {
      return this.handleToast(el)
    }

    if (tagName === 'table') {
      return this.handleTable(el)
    }

    // Elements with border/rounded utilities
    if (this.hasBorderUtilities(el)) {
      return this.handleBorderElement(el)
    }

    // Generic div/section handling
    if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
      return this.handleGroup(el)
    }

    // Pass through other elements
    return this.handleGeneric(el)
  }

  /**
   * Handle generic/unrecognized elements
   */
  handleGeneric(el) {
    const tagName = el.tagName.toLowerCase()

    // SVG elements should always be preserved as wp:html
    if (tagName === 'svg') {
      return this.wrapAsHtml(el)
    }

    // Inline elements should always be preserved as wp:html
    const inlineElements = ['span', 'strong', 'em', 'b', 'i', 'u', 'small', 'mark', 'sub', 'sup', 'code', 'kbd', 'samp']
    if (inlineElements.includes(tagName)) {
      return this.wrapAsHtml(el)
    }

    // For unrecognized elements with unmapped styles, wrap as wp:html
    // to preserve exact styling without validation errors
    if (this.hasUnmappedStyles(el)) {
      this.extractUtilityClasses(el) // Track CSS for any utility classes
      return this.wrapAsHtml(el)
    }

    // For unrecognized elements without unmapped styles, process children
    return this.processChildren(el)
  }

  /**
   * Process all children of an element
   */
  processChildren(el) {
    let output = ''
    this.indentLevel++

    // Track parent text alignment for inheritance
    const prevTextAlign = this.parentTextAlign
    const elTextAlign = this.extractTextAlign(el)
    if (elTextAlign) {
      this.parentTextAlign = elTextAlign
    }

    // Collect children for button grouping
    const children = Array.from(el.childNodes)
    let i = 0

    while (i < children.length) {
      const child = children[i]

      // Check if this is a button and look for adjacent buttons
      if (child.nodeType === Node.ELEMENT_NODE && this.hasClass(child, 'btn')) {
        // Collect consecutive buttons
        const buttonGroup = [child]
        let j = i + 1
        while (j < children.length) {
          const next = children[j]
          if (next.nodeType === Node.TEXT_NODE && !next.textContent.trim()) {
            j++ // Skip whitespace
            continue
          }
          if (next.nodeType === Node.ELEMENT_NODE && this.hasClass(next, 'btn')) {
            buttonGroup.push(next)
            j++
          } else {
            break
          }
        }

        // Process button group
        if (buttonGroup.length > 1) {
          output += this.handleConsecutiveButtons(buttonGroup)
        } else {
          output += this.handleButton(child)
        }
        i = j
      } else {
        output += this.processNode(child)
        i++
      }
    }

    // Restore previous text alignment
    this.parentTextAlign = prevTextAlign

    this.indentLevel--
    return output
  }

  /**
   * Helper to find spacing class value
   */
  findSpacingClass(classes, prefix) {
    for (const cls of classes) {
      if (cls.startsWith(prefix)) {
        const value = cls.substring(prefix.length)
        // Handle auto separately
        if (value === 'auto') return null
        return this.spacingMap[value] || null
      }
    }
    return null
  }

  // ===== WARNING/TRACKING METHODS =====

  addWarning(type, message) {
    this.warnings.push({ type: type, message: message })
  }

  getWarnings() {
    return this.warnings
  }

  getUsedCssComponents() {
    return Array.from(this.usedCssComponents)
  }

  trackCss(component) {
    this.usedCssComponents.add(component)
  }

  trackUtilityClasses(el) {
    // Track Bootstrap utility classes for CSS generation
    const classes = Array.from(el.classList || [])
    const utilityPatterns = [
      /^bg-(primary|secondary|success|danger|warning|info|light|dark|white)$/,
      /^text-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/,
      /^text-bg-(primary|secondary|success|danger|warning|info|light|dark)$/
    ]

    for (const cls of classes) {
      for (const pattern of utilityPatterns) {
        if (pattern.test(cls)) {
          this.trackCss(cls)
        }
      }
    }
  }

  // Map Bootstrap utility classes to GUC (Gutenberg Utility Classes)
  // Returns { gucClasses: [], unmappedBootstrap: [], consumedClasses: [], wpAttrs: {} }
  // consumedClasses are Bootstrap classes that were successfully mapped
  // wpAttrs contains WordPress block attributes (style object with color, typography, etc.)
  mapBootstrapToGucClasses(el) {
    const classes = Array.from(el.classList || [])
    const gucClasses = []
    const unmappedBootstrap = []
    const consumedClasses = []
    const wpAttrs = {} // WordPress block attributes
    let hasRounded = false

    for (const cls of classes) {
      let mapped = false

      // Spacing utilities: m-*, my-*, mx-*, p-*, py-*, px-*, gap-*
      // Bootstrap pattern: {type}{axis?}-{size} where size is 0-5
      // GUC pattern: {type}{axis?}-{preset}-mobile where preset is 0,20,30,40,50,60,70,80
      const spacingMatch = cls.match(/^(m|p)(y|x)?-([0-5])$/)
      if (spacingMatch) {
        const [, type, axis, size] = spacingMatch
        const preset = this.bootstrapSpacingToPreset[size]
        if (preset) {
          const gucClass = `${type}${axis || ''}-${preset}-mobile`
          gucClasses.push(gucClass)
          consumedClasses.push(cls)
          mapped = true
        }
      }

      // Gap utilities: gap-*
      const gapMatch = cls.match(/^gap-([0-5])$/)
      if (gapMatch) {
        const [, size] = gapMatch
        const preset = this.bootstrapSpacingToPreset[size]
        if (preset) {
          gucClasses.push(`gap-${preset}-mobile`)
          consumedClasses.push(cls)
          mapped = true
        }
      }

      // Text alignment: text-center, text-start, text-end
      // These apply at all breakpoints, so use style attribute not GUC responsive classes
      if (cls === 'text-center' || cls === 'text-start' || cls === 'text-end') {
        const alignMap = {
          'text-center': 'center',
          'text-start': 'left',
          'text-end': 'right'
        }
        wpAttrs.style = wpAttrs.style || {}
        wpAttrs.style.typography = wpAttrs.style.typography || {}
        wpAttrs.style.typography.textAlign = alignMap[cls]
        consumedClasses.push(cls)
        mapped = true
      }

      // Background colors: bg-* -> WordPress style.color.background with var:preset format
      const bgColorPresetMap = {
        'bg-primary': 'primary',
        'bg-secondary': 'secondary',
        'bg-success': 'success',
        'bg-danger': 'error',
        'bg-warning': 'warning',
        'bg-info': 'info',
        'bg-light': 'light',
        'bg-dark': 'dark',
        'bg-white': 'white',
        'bg-body-tertiary': 'surface',
        'bg-body-secondary': 'surface',
        'bg-body': 'base'
      }
      if (bgColorPresetMap[cls]) {
        wpAttrs.style = wpAttrs.style || {}
        wpAttrs.style.color = wpAttrs.style.color || {}
        wpAttrs.style.color.background = 'var:preset|color|' + bgColorPresetMap[cls]
        consumedClasses.push(cls)
        mapped = true
      }

      // Text colors: text-* -> WordPress style.color.text with var:preset format
      const textColorPresetMap = {
        'text-primary': 'primary',
        'text-secondary': 'secondary',
        'text-success': 'success',
        'text-danger': 'error',
        'text-warning': 'warning',
        'text-info': 'info',
        'text-light': 'light',
        'text-dark': 'dark',
        'text-white': 'white',
        'text-muted': 'text-muted',
        'text-body-emphasis': 'contrast'
      }
      if (textColorPresetMap[cls]) {
        wpAttrs.style = wpAttrs.style || {}
        wpAttrs.style.color = wpAttrs.style.color || {}
        wpAttrs.style.color.text = 'var:preset|color|' + textColorPresetMap[cls]
        consumedClasses.push(cls)
        mapped = true
      }

      // Rounded utilities: preserve class AND add border, border-1, border-secondary
      const roundedMatch = cls.match(/^rounded(-[0-5]|-circle|-pill)?$/)
      if (roundedMatch) {
        gucClasses.push(cls) // Preserve rounded-* class
        hasRounded = true
        consumedClasses.push(cls)
        mapped = true
      }

      // Shadow utilities: preserve as-is
      if (/^shadow(-sm|-lg|-none)?$/.test(cls)) {
        gucClasses.push(cls)
        consumedClasses.push(cls)
        mapped = true
      }

      // Border utilities: preserve as-is
      if (cls === 'border' || /^border-[0-5]$/.test(cls) || /^border-(primary|secondary|success|danger|warning|info|light|dark|white)$/.test(cls)) {
        gucClasses.push(cls)
        consumedClasses.push(cls)
        mapped = true
      }

      // Track unmapped Bootstrap utilities for reporting
      if (!mapped) {
        const bsUtilityPatterns = [
          /^(bg-|text-|border-|rounded|shadow|d-|flex-|justify-|align-|order-|col-)/
        ]
        if (bsUtilityPatterns.some(p => p.test(cls))) {
          unmappedBootstrap.push(cls)
        }
      }
    }

    // If rounded was used, add border, border-1, and border-secondary for visibility
    if (hasRounded) {
      if (!gucClasses.includes('border')) {
        gucClasses.push('border')
      }
      if (!gucClasses.some(c => /^border-[0-5]$/.test(c))) {
        gucClasses.push('border-1')
      }
      if (!gucClasses.some(c => /^border-(primary|secondary|success|danger|warning|info|light|dark|white)$/.test(c))) {
        gucClasses.push('border-secondary')
      }
    }

    return { gucClasses, unmappedBootstrap, consumedClasses, wpAttrs }
  }

  /**
   * Generate a custom CSS class from Bootstrap utility classes
   * Returns { className, css, unmappedClasses }
   */
  generateCustomClass(el) {
    const classes = Array.from(el.classList || [])
    const cssDeclarations = {}
    const unmappedClasses = []
    const mappedClasses = []

    for (const cls of classes) {
      if (this.utilityStyleMap[cls]) {
        Object.assign(cssDeclarations, this.utilityStyleMap[cls])
        mappedClasses.push(cls)
      } else {
        // Keep track of unmapped classes (like 'bi', custom classes)
        unmappedClasses.push(cls)
      }
    }

    // Only generate if we have mapped declarations
    if (Object.keys(cssDeclarations).length === 0) {
      return null
    }

    // Generate class name
    this.customClassCounter++
    const className = 'custom-' + this.customClassCounter

    // Build CSS string
    let css = '.' + className + ' {\n'
    for (const [prop, value] of Object.entries(cssDeclarations)) {
      css += '  ' + prop + ': ' + value + ';\n'
    }
    css += '}\n'

    // Add placeholder for child elements
    css += '\n/* Extend for children */\n'
    css += '.' + className + ' svg {\n  /* width: 1.5rem; height: 1.5rem; */\n}\n'
    css += '.' + className + ' span {\n  /* margin: 0; */\n}\n'

    // Store for later retrieval
    this.generatedCustomClasses.push({ className, css, mappedClasses, unmappedClasses })

    return { className, css, unmappedClasses }
  }

  /**
   * Get all generated custom classes
   */
  getGeneratedCustomClasses() {
    return this.generatedCustomClasses
  }

  /**
   * Convert Bootstrap responsive classes to Gutenberg Utility Classes (GUC)
   * Returns { gucClasses: [], remainingClasses: [] }
   */
  convertToGucClasses(classes) {
    const gucClasses = []
    const remainingClasses = []

    // Detect stacking patterns: flex-column + flex-md-row = stack-on-mobile
    const hasFlexColumn = classes.includes('flex-column')
    const hasFlexSmRow = classes.includes('flex-sm-row')
    const hasFlexMdRow = classes.includes('flex-md-row')
    const hasFlexLgRow = classes.includes('flex-lg-row')

    if (hasFlexColumn && (hasFlexSmRow || hasFlexMdRow)) {
      gucClasses.push('stack-on-mobile')
    } else if (hasFlexColumn && hasFlexLgRow) {
      gucClasses.push('stack-on-mobile')
      gucClasses.push('stack-on-tablet')
    } else if (hasFlexColumn && !hasFlexSmRow && !hasFlexMdRow && !hasFlexLgRow) {
      gucClasses.push('stack-from-mobile')
    }

    // Detect visibility patterns: d-none d-md-block
    const hasDNone = classes.includes('d-none')
    const hasDSmBlock = classes.includes('d-sm-block') || classes.includes('d-sm-flex')
    const hasDMdBlock = classes.includes('d-md-block') || classes.includes('d-md-flex')
    const hasDLgBlock = classes.includes('d-lg-block') || classes.includes('d-lg-flex')

    if (hasDNone) {
      if (hasDSmBlock) {
        gucClasses.push('hide-on-mobile')
      } else if (hasDMdBlock) {
        gucClasses.push('hide-on-mobile')
      } else if (hasDLgBlock) {
        gucClasses.push('hide-on-mobile')
        gucClasses.push('hide-on-tablet')
      }
    }

    // Reverse pattern: d-block d-md-none (visible on mobile, hidden on md+)
    const hasDBlock = classes.includes('d-block') || classes.includes('d-flex')
    const hasDMdNone = classes.includes('d-md-none')
    const hasDLgNone = classes.includes('d-lg-none')

    if (hasDBlock && hasDMdNone) {
      gucClasses.push('show-on-mobile')
    } else if (hasDBlock && hasDLgNone) {
      gucClasses.push('hide-on-desktop')
    }

    // Process remaining classes
    for (const cls of classes) {
      // Skip classes we've already converted
      if (/^flex-(column|row)$/.test(cls)) continue
      if (/^flex-(sm|md|lg|xl|xxl)-(row|column)$/.test(cls)) continue
      if (/^d-(none|block|flex)$/.test(cls)) continue
      if (/^d-(sm|md|lg|xl|xxl)-(none|block|flex)$/.test(cls)) continue

      // Convert responsive column classes to GUC width
      const colMatch = cls.match(/^col-(sm|md|lg|xl|xxl)?-?(\d+)$/)
      if (colMatch) {
        const breakpoint = colMatch[1] || 'xs'
        const colNum = colMatch[2]
        const device = this.breakpointToDevice[breakpoint] || 'mobile'
        const widthPct = this.colToGucWidth[colNum]
        if (widthPct) {
          gucClasses.push(`width-${widthPct}-${device}`)
        }
        continue
      }

      // Pass through other classes
      remainingClasses.push(cls)
    }

    return { gucClasses, remainingClasses }
  }

  /**
   * Build class string with custom classes FIRST, then native WordPress classes
   * (custom-class-first pattern for CSS specificity)
   */
  buildClassString(customClasses, nativeClass) {
    const customs = Array.isArray(customClasses) ? customClasses : [customClasses]
    const filtered = customs.filter(c => c && c.trim())
    if (filtered.length === 0) {
      return nativeClass
    }
    return filtered.join(' ') + ' ' + nativeClass
  }
}

export default BootstrapToGutenbergConverter
