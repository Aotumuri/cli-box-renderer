# cli-box-renderer

Render boxed CLI UI blocks with borders, wrapping, optional highlighting, and narrow-terminal handling.

## Install

```sh
npm install cli-box-renderer
```

## Usage

```js
const { renderBox } = require('cli-box-renderer');

const lines = [
  'Title: Box Example',
  '',
  'Line 1: Hello, world!',
  'Line 2: This will wrap automatically if too long.'
];

const { text } = renderBox(lines, { borderStyle: 'double', boxWidth: null });
console.log(text);
```

## API

### `renderBox(contentLines, options?)`

- `contentLines` (`string | string[]`): Text to box. Strings with `\n` are split into lines.
- `options.borderStyle` (`'round' | 'single' | 'double'`, default `'round'`): Border characters.
- `options.boxWidth` (`number | null`, default `null`): Fixed inner width (min 15); `null` auto-sizes up to terminal width. Throws if `boxWidth < 15`; renders a narrow-warning box if the terminal is too small.

Returns `{ text, isNarrow }`, where `isNarrow` is `true` if the terminal was too small and a warning box was rendered.

## Notes

- Depends only on `chalk`.
- Uses `process.stdout.columns` to size/wrap content; warns in a box if inner width < 15.
- MIT licensed.
