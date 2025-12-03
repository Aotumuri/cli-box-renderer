const test = require('node:test');
const assert = require('node:assert/strict');
const { renderBox } = require('../index');

function withColumns(columns, fn) {
  const hadOwn = Object.prototype.hasOwnProperty.call(process.stdout, 'columns');
  const descriptor = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
  Object.defineProperty(process.stdout, 'columns', { value: columns, writable: true, configurable: true });
  try {
    return fn();
  } finally {
    if (hadOwn && descriptor) {
      Object.defineProperty(process.stdout, 'columns', descriptor);
    } else {
      delete process.stdout.columns;
    }
  }
}

test('wraps long content across lines at given width', () => {
  withColumns(120, () => {
    const { text, isNarrow } = renderBox('This is a very long line that should wrap neatly.', { boxWidth: 15 });
    assert.equal(isNarrow, false);

    const body = text.split('\n').slice(1, -1).map((line) => line.slice(2, -2));
    assert.ok(body.length > 1, 'expected wrapped lines');
    body.forEach((segment) => {
      assert.ok(segment.trimEnd().length <= 15, 'segment exceeds width');
    });
  });
});

test('renders warning box when terminal is too narrow', () => {
  withColumns(10, () => {
    const result = renderBox(['content'], {});
    assert.equal(result.isNarrow, true);
    const warning = result.text
      .split('\n')
      .slice(1, -1)
      .map((line) => line.slice(2, -2).trim())
      .join(' ');
    assert.match(warning, /Too narrow to render/, 'warning message missing');
  });
});

test('throws if boxWidth is below 15', () => {
  assert.throws(() => renderBox(['content'], { boxWidth: 10 }), /boxWidth must be at least 15/);
});

test('supports double border style', () => {
  withColumns(120, () => {
    const { text, isNarrow } = renderBox('Double border', { borderStyle: 'double', boxWidth: 20 });
    assert.equal(isNarrow, false);
    assert.ok(text.startsWith('╔'), 'missing double top-left corner');
    assert.ok(text.includes('╚'), 'missing double bottom-left corner');
    assert.ok(text.includes('║ Double border'), 'missing double vertical border with content');
  });
});
