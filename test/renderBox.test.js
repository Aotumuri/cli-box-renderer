const test = require('node:test');
const assert = require('node:assert/strict');
const { renderBox } = require('../index');

const ansiPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g;
const combiningMarkPattern =
  /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08d3-\u08e1\u08e3-\u0902\u093a\u093c\u0941-\u0948\u094d\u0951-\u0957\u0962-\u0963\u0981\u09bc\u09c1-\u09c4\u09cd\u09e2-\u09e3\u0a01-\u0a02\u0a3c\u0a41-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a82\u0abc\u0ac1-\u0ac5\u0ac7-\u0ac8\u0acd\u0ae2-\u0ae3\u0b01\u0b3c\u0b3f\u0b41-\u0b44\u0b4d\u0b56-\u0b57\u0b62-\u0b63\u0b82\u0bc0\u0bcd\u0c00\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c62-\u0c63\u0c81\u0cbc\u0cbf\u0cc6\u0ccc-\u0ccd\u0ce2-\u0ce3\u0d00-\u0d01\u0d3b-\u0d3c\u0d41-\u0d44\u0d4d\u0d62-\u0d63\u0d81\u0dca\u0dd2-\u0dd4\u0dd6\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039-\u103a\u103d-\u103e\u1058-\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085-\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b4-\u17b5\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u1885-\u1886\u18a9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193b\u1a17-\u1a18\u1a1b\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80-\u1b81\u1ba2-\u1ba5\u1ba8-\u1ba9\u1bab-\u1bad\u1be6\u1be8-\u1be9\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1cf4\u1cf8-\u1cf9\u1dc0-\u1df9\u1dfb-\u1dff\u200c-\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302d\u3099-\u309a\ua66f\ua674-\ua67d\ua69e-\ua69f\ua6f0-\ua6f1\ua802\ua806\ua80b\ua825-\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31-\uaa32\uaa35-\uaa36\uaa43\uaa4c\uaa7c\uaab0\uaab2-\uaab4\uaab7-\uaab8\uaabe-\uaabf\uaac1\uaaec-\uaaed\uaaf6\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\uff9e-\uff9f]/u;

function isFullwidthCodePoint(codePoint) {
  return (
    codePoint >= 0x1100 &&
    (codePoint <= 0x115f ||
      codePoint === 0x2329 ||
      codePoint === 0x232a ||
      (0x2e80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303f) ||
      (0x3250 <= codePoint && codePoint <= 0x4dbf) ||
      (0x4e00 <= codePoint && codePoint <= 0xa4c6) ||
      (0xa960 <= codePoint && codePoint <= 0xa97c) ||
      (0xac00 <= codePoint && codePoint <= 0xd7a3) ||
      (0xf900 <= codePoint && codePoint <= 0xfaff) ||
      (0xfe10 <= codePoint && codePoint <= 0xfe19) ||
      (0xfe30 <= codePoint && codePoint <= 0xfe6b) ||
      (0xff01 <= codePoint && codePoint <= 0xff60) ||
      (0xffe0 <= codePoint && codePoint <= 0xffe6) ||
      (0x1f300 <= codePoint && codePoint <= 0x1f64f) ||
      (0x1f900 <= codePoint && codePoint <= 0x1f9ff) ||
      (0x20000 <= codePoint && codePoint <= 0x3fffd))
  );
}

function charDisplayWidth(codePoint) {
  if (codePoint === 0x200d) return 0;
  if (combiningMarkPattern.test(String.fromCodePoint(codePoint))) return 0;
  return isFullwidthCodePoint(codePoint) ? 2 : 1;
}

function visibleWidth(input) {
  const cleaned = String(input).replace(ansiPattern, '');
  let width = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const codePoint = cleaned.codePointAt(i);
    width += charDisplayWidth(codePoint);
    if (codePoint > 0xffff) {
      i += 1;
    }
  }

  return width;
}

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

test('keeps borders aligned with fullwidth characters', () => {
  withColumns(120, () => {
    const content = '日本語を入れるとズレる';
    const { text, isNarrow } = renderBox(content, { boxWidth: 24 });
    assert.equal(isNarrow, false);

    const lines = text.split('\n');
    const widths = lines.map((line) => visibleWidth(line));
    widths.forEach((width) => {
      assert.equal(width, widths[0], 'line width mismatch when rendering fullwidth text');
    });
  });
});
