export type BorderStyle = 'round' | 'single' | 'double';

export interface RenderBoxOptions {
  borderStyle?: BorderStyle;
  boxWidth?: number | null;
}

export interface RenderBoxResult {
  text: string;
  isNarrow: boolean;
}

export function renderBox(
  contentLines: string | string[],
  options?: RenderBoxOptions
): RenderBoxResult;
