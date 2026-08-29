/**
 * CodeMirror Editor Integration
 * Provides HTML editing with syntax highlighting and Emmet support
 */

// CodeMirror core
import CodeMirror from 'codemirror';

// CodeMirror modes
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

// CodeMirror addons
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/fold/xml-fold.js';

// CodeMirror CSS
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/hint/show-hint.css';

// Emmet expander
import { emmetExpand } from './emmetExpander.js';

/**
 * Create the Emmet expand handler for CodeMirror
 * @param {CodeMirror.Editor} cm - CodeMirror instance
 * @returns {void|CodeMirror.Pass}
 */
function expandEmmetAbbreviation(cm) {
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line);
  const textBeforeCursor = line.substring(0, cursor.ch);

  // Find the abbreviation (text after last space or start of line, allowing Emmet chars)
  const match = textBeforeCursor.match(/([a-z0-9._#>\+\*\[\]="'\{\}\$-]+)$/i);
  if (!match) {
    return CodeMirror.Pass;
  }

  const abbr = match[1];
  const startCh = cursor.ch - abbr.length;

  // Don't expand if it looks like we're inside a tag
  if (textBeforeCursor.match(/<[^>]*$/)) {
    return CodeMirror.Pass;
  }

  const expanded = emmetExpand(abbr);

  if (expanded && expanded !== abbr) {
    cm.replaceRange(expanded,
      { line: cursor.line, ch: startCh },
      { line: cursor.line, ch: cursor.ch }
    );

    // Position cursor and auto-indent
    const lines = expanded.split('\n');
    const endLine = cursor.line + lines.length - 1;
    for (let i = cursor.line; i <= endLine; i++) {
      cm.indentLine(i);
    }
    return;
  }

  return CodeMirror.Pass;
}

/**
 * Initialize CodeMirror on a textarea element
 * @param {HTMLTextAreaElement} textarea - The textarea to replace
 * @param {Object} options - Additional options
 * @param {Function} options.onChange - Callback when content changes
 * @returns {CodeMirror.Editor} - The CodeMirror instance
 */
export function initEditor(textarea, options = {}) {
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    matchTags: { bothTags: true },
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Ctrl-J': 'toMatchingTag',
      'Tab': expandEmmetAbbreviation,
      'Ctrl-E': expandEmmetAbbreviation
    },
    hintOptions: {
      completeSingle: false
    },
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false
  });

  // Set up change callback if provided
  if (options.onChange) {
    editor.on('change', options.onChange);
  }

  return editor;
}

/**
 * Editor wrapper class for easier management
 */
export class Editor {
  constructor(textareaId, options = {}) {
    this.textarea = document.getElementById(textareaId);
    this.options = options;
    this.cm = null;
  }

  /**
   * Initialize the editor
   * @returns {Editor} - Returns this for chaining
   */
  init() {
    if (!this.textarea) {
      console.error('Textarea not found');
      return this;
    }

    this.cm = initEditor(this.textarea, {
      onChange: () => {
        if (this.options.onChange) {
          this.options.onChange(this.getValue());
        }
      }
    });

    return this;
  }

  /**
   * Get the current editor content
   * @returns {string}
   */
  getValue() {
    return this.cm ? this.cm.getValue() : this.textarea.value;
  }

  /**
   * Set the editor content
   * @param {string} value
   */
  setValue(value) {
    if (this.cm) {
      this.cm.setValue(value);
    } else {
      this.textarea.value = value;
    }
  }

  /**
   * Get the CodeMirror wrapper element
   * @returns {HTMLElement}
   */
  getWrapperElement() {
    return this.cm ? this.cm.getWrapperElement() : this.textarea;
  }

  /**
   * Refresh the editor (useful after visibility changes)
   */
  refresh() {
    if (this.cm) {
      this.cm.refresh();
    }
  }

  /**
   * Show the editor
   */
  show() {
    const wrapper = this.getWrapperElement();
    wrapper.classList.remove('hidden');
    this.refresh();
  }

  /**
   * Hide the editor
   */
  hide() {
    const wrapper = this.getWrapperElement();
    wrapper.classList.add('hidden');
  }
}

export default Editor;
