/**
 * Emmet-like abbreviation expander for HTML
 * Supports: tag.class#id, parent>child, sibling+sibling, element*n, [attrs], {text}
 */

// Parse a single element: tag.class1.class2#id[attr="value"]{text}
function parseElement(str) {
  let tag = 'div';
  let classes = [];
  let id = '';
  let attrs = {};
  let text = '';

  // Extract text content {text}
  const textMatch = str.match(/\{([^}]*)\}/);
  if (textMatch) {
    text = textMatch[1];
    str = str.replace(/\{[^}]*\}/, '');
  }

  // Extract attributes [attr="value" attr2='value2']
  const attrMatch = str.match(/\[([^\]]*)\]/);
  if (attrMatch) {
    const attrStr = attrMatch[1];
    const attrRegex = /([a-z-]+)(?:=["']([^"']*)["'])?/gi;
    let m;
    while ((m = attrRegex.exec(attrStr)) !== null) {
      attrs[m[1]] = m[2] || '';
    }
    str = str.replace(/\[[^\]]*\]/, '');
  }

  // Extract id #id
  const idMatch = str.match(/#([a-z0-9_-]+)/i);
  if (idMatch) {
    id = idMatch[1];
    str = str.replace(/#[a-z0-9_-]+/i, '');
  }

  // Extract classes .class1.class2
  const classMatches = str.match(/\.([a-z0-9_-]+)/gi);
  if (classMatches) {
    classes = classMatches.map(c => c.slice(1));
    str = str.replace(/\.[a-z0-9_-]+/gi, '');
  }

  // Remaining is the tag name
  const tagMatch = str.match(/^[a-z0-9]+/i);
  if (tagMatch) {
    tag = tagMatch[0];
  }

  return { tag, classes, id, attrs, text };
}

// Build HTML from parsed element
function buildElement(parsed, indent = '', children = '') {
  const { tag, classes, id, attrs, text } = parsed;
  const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tag);

  let attrStr = '';
  if (id) attrStr += ` id="${id}"`;
  if (classes.length) attrStr += ` class="${classes.join(' ')}"`;
  for (const [k, v] of Object.entries(attrs)) {
    attrStr += v ? ` ${k}="${v}"` : ` ${k}`;
  }

  if (selfClosing) {
    return `${indent}<${tag}${attrStr}>`;
  }

  const content = text || children;
  if (content.includes('\n')) {
    return `${indent}<${tag}${attrStr}>\n${content}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}${attrStr}>${content}</${tag}>`;
}

/**
 * Expand an Emmet abbreviation to HTML
 * @param {string} abbr - The abbreviation to expand
 * @returns {string|null} - Expanded HTML or null if can't expand
 */
export function emmetExpand(abbr) {
  // Handle multiplication: li*3
  const multiplyMatch = abbr.match(/^(.+)\*(\d+)$/);
  if (multiplyMatch) {
    const base = multiplyMatch[1];
    const count = parseInt(multiplyMatch[2]);
    const results = [];
    for (let i = 1; i <= count; i++) {
      // Replace $ with number
      const numbered = base.replace(/\$/g, i);
      const expanded = emmetExpand(numbered);
      if (expanded) results.push(expanded);
    }
    return results.join('\n');
  }

  // Handle sibling: div+p+span
  if (abbr.includes('+') && !abbr.includes('>')) {
    const siblings = abbr.split('+');
    return siblings.map(s => emmetExpand(s)).filter(Boolean).join('\n');
  }

  // Handle child: div>p>span
  if (abbr.includes('>')) {
    const parts = abbr.split('>');
    let result = '';

    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];

      // Handle multiplication in children
      if (part.includes('*')) {
        const expanded = emmetExpand(part);
        if (i === parts.length - 1) {
          result = expanded;
        } else {
          const parsed = parseElement(part.split('*')[0]);
          const childContent = result.split('\n').map(line => '  ' + line).join('\n');
          result = buildElement(parsed, '', '\n' + childContent + '\n');
        }
      } else {
        if (i === parts.length - 1) {
          const parsed = parseElement(part);
          result = buildElement(parsed, '');
        } else {
          const parsed = parseElement(part);
          const childContent = result.split('\n').map(line => '  ' + line).join('\n');
          result = buildElement(parsed, '', '\n' + childContent + '\n');
        }
      }
    }
    return result;
  }

  // Simple element
  const parsed = parseElement(abbr);
  if (parsed.tag || parsed.classes.length || parsed.id) {
    return buildElement(parsed);
  }

  return null;
}

export default emmetExpand;
