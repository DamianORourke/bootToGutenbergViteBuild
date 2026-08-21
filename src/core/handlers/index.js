/**
 * Handler Registry
 *
 * Exports all element handlers for the converter.
 * Each handler transforms a specific Bootstrap element type
 * into Gutenberg block markup.
 *
 * @example
 * import * as handlers from './handlers/index.js'
 *
 * handlers.handleContainer(converter, element)
 * handlers.handleCard(converter, element)
 */

// Layout handlers - containers, rows, columns, flex groups
export * from './layoutHandlers.js'

// Component handlers - cards, accordions, alerts, tables, etc.
export * from './componentHandlers.js'

// Element handlers - headings, paragraphs, images, buttons
export * from './elementHandlers.js'

// Interactive handlers - dropdowns, collapse, modals (often wp:html)
export * from './interactiveHandlers.js'
