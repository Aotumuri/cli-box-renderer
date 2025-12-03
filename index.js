const stripAnsi = (str) => str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');

function wrapLine(line, maxWidth) {
  const words = String(line).split(/(\s+)/).filter((w) => w.length > 0);
  const lines = [];
  let current = '';

  const visibleLength = (s) => stripAnsi(s).length;

  words.forEach((word) => {
    if (visibleLength((current || '') + word) > maxWidth) {
      if (current) lines.push(current);
      while (visibleLength(word) > maxWidth) {
        const slice = word.slice(0, maxWidth);
        lines.push(slice);
        word = word.slice(maxWidth);
      }
      current = word;
    } else {
      current += word;
    }
  });

  if (current) lines.push(current);
  if (lines.length === 0) lines.push('');
  return lines;
}

function renderBox(contentLines, options = {}) {
  const { borderStyle = 'round', boxWidth = null } = options;

  const styleMap = {
    round: { topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯', horizontal: '─', vertical: '│' },
    single: { topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘', horizontal: '─', vertical: '│' },
    double: { topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝', horizontal: '═', vertical: '║' }
  };
  const borders = styleMap[borderStyle] || styleMap.round;

  const termColumns = process.stdout.columns || 80;
  const available = termColumns - 4;

  if (boxWidth !== null && boxWidth < 15) {
    throw new Error('boxWidth must be at least 15.');
  }
  if (available < 15) {
    const width = Math.max(3, available);
    const lines = wrapLine('Too narrow to render (need at least 15 columns).', width);
    const contentWidth = Math.max(0, ...lines.map((l) => l.length));
    const horizontal = borders.horizontal.repeat(contentWidth + 2);
    const top = `${borders.topLeft}${horizontal}${borders.topRight}`;
    const bottom = `${borders.bottomLeft}${horizontal}${borders.bottomRight}`;
    const body = lines.map((line) => `${borders.vertical} ${line.padEnd(contentWidth, ' ')} ${borders.vertical}`);
    return { text: [top, ...body, bottom].join('\n'), isNarrow: true };
  }

  const normalized = Array.isArray(contentLines) ? contentLines : String(contentLines).split('\n');
  const termLimit = Math.max(15, available);
  const targetWidth = boxWidth ? Math.max(15, Math.min(boxWidth, termLimit)) : null;

  const wrapped = normalized.flatMap((line) => wrapLine(line, targetWidth || termLimit));

  const maxLine = wrapped.length ? Math.max(...wrapped.map((l) => stripAnsi(l).length)) : 0;
  const contentWidth = targetWidth ? targetWidth : Math.min(termLimit, maxLine);

  const horizontal = borders.horizontal.repeat(contentWidth + 2);
  const top = `${borders.topLeft}${horizontal}${borders.topRight}`;
  const bottom = `${borders.bottomLeft}${horizontal}${borders.bottomRight}`;

  const body = wrapped.map((line) => {
    const visibleLen = stripAnsi(line).length;
    const padding = contentWidth - visibleLen;
    return `${borders.vertical} ${line}${' '.repeat(padding)} ${borders.vertical}`;
  });

  return { text: [top, ...body, bottom].join('\n'), isNarrow: false };
}

module.exports = { renderBox };
