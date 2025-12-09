/**
 * Panel mapping definitions for SVG visualization
 *
 * These mappings connect SVG colors/classes to logical panel IDs
 * for different case models in the visualizer component.
 */

// Map SVG classes to panel IDs based on the SVG structure
// For 8-panel models (regular models)
export const CLASS_TO_PANEL_8: { [key: string]: string } = {
  b: 'side1', // Panel 1: Left side (black)
  c: 'side2', // Panel 2: Right side (magenta)
  i: 'back1', // Panel 3: Top front (orange) - バック1
  e: 'back2', // Panel 4: Second top (red - behind panel 3) - バック2
  d: 'bottom1', // Panel 5: Center upper (green)
  g: 'bottom2', // Panel 6: Center lower (green)
  f: 'front1', // Panel 7: Bottom front (yellow) - フロント1
  h: 'front2', // Panel 8: Bottom back (brown) - フロント2
};

// For 12-panel models (x2 models) - based on the image provided
export const CLASS_TO_PANEL_12: { [key: string]: string } = {
  a: 'side1', // A サイド1
  b: 'side2', // B サイド2
  c: 'side3', // C サイド3
  d: 'side4', // D サイド4
  e: 'back1', // E バック1
  f: 'back2', // F バック2
  g: 'bottom1', // G ボトム1
  h: 'bottom2', // H ボトム2
  i: 'bottom3', // I ボトム3
  j: 'bottom4', // J ボトム4
  k: 'front1', // K フロント1
  l: 'front2', // L フロント2
};

// Common color mappings shared by both 10BOX variants
export const COLOR_TO_PANEL_10BOX_COMMON: { [key: string]: string } = {
  '#00a99d': 'main-side1', // メイン: サイド1 (teal)
  // main-side2 has no fill style, handled by position
  '#ef4136': 'main-back1', // メイン: バック1 (red)
  '#ed1c24': 'main-bottom1', // メイン: ボトム1 (darker red)
  '#fff200': 'main-bottom2', // メイン: ボトム2 (yellow)
  '#00a651': 'main-front', // メイン: フロント (green)
  '#00aeef': 'main-side3', // メイン: サイド3 (cyan)
  '#2e3192': 'main-side4', // メイン: サイド4 (dark blue)
  '#662d91': 'lid-side1', // フタ: サイド1 (purple)
  '#a97c50': 'lid-back', // フタ: バック (brown)
  '#a7a9ac': 'lid-top1', // フタ: トップ1 (light gray)
  '#939598': 'lid-top2', // フタ: トップ2 (gray)
  '#58595b': 'lid-front', // フタ: フロント (dark gray)
  '#808285': 'lid-side2', // フタ: サイド2 (gray)
  '#ec008c': 'stand-angle1', // スタンド: アングル1 (bright magenta/pink)
  '#9e1f63': 'stand-angle2', // スタンド: アングル2 (darker purple)
  '#e179dd': 'stand-support1', // スタンド: サポート1 (light pink)
  '#e1d57f': 'stand-support2', // スタンド: サポート2 (yellow/tan)
};

// For 10BOX Shallow model - uses common mappings (all 18 panels)
// SVG path positions (after v3 update with new stand parts):
// Position 1: #2e3192 (dark blue) -> Panel 8 (main-side4)
// Position 2: #00aeef (cyan) -> Panel 7 (main-side3)
// Position 3: No fill style -> Panel 2 (main-side2)
// Position 4: #00a99d (teal) -> Panel 1 (main-side1)
// Position 5: #ef4136 (red) -> Panel 3 (main-back1)
// Position 6: #00a651 (green) -> Panel 6 (main-front)
// Position 7: #fff200 (yellow) -> Panel 5 (main-bottom2)
// Position 8: #ed1c24 (darker red) -> Panel 4 (main-bottom1)
export const COLOR_TO_PANEL_10BOX_SHALLOW: { [key: string]: string } = {
  ...COLOR_TO_PANEL_10BOX_COMMON,
};

// For 10BOX Deep model - 14 panels (8 main + 6 lid, no stand parts)
// Uses common mappings but excludes stand parts (legs removed from deep model)
// SVG path order (0-indexed):
// Path 0: #00aeef (cyan) -> main-side3
// Path 1: #00a99d (teal) -> main-side1
// Path 2: #2e3192 (dark blue) -> main-side4
// Path 3: No fill style -> main-side2
// Path 4: #ef4136 (red) -> main-back1
// Path 5: #00a651 (green) -> main-front
// Path 6: #fff200 (yellow) -> main-bottom2
// Path 7: #ed1c24 (darker red) -> main-bottom1
// Path 8: #939598 (gray) -> lid-top2
// Path 9: #a7a9ac (light gray) -> lid-top1
// Path 10: #808285 (gray) -> lid-side2
// Path 11: #662d91 (purple) -> lid-side1
// Path 12: #58595b (dark gray) -> lid-front
// Path 13: #a97c50 (brown) -> lid-back
export const COLOR_TO_PANEL_10BOX_DEEP: { [key: string]: string } = (() => {
  // Exclude stand parts from common mappings (deep model has no legs)
  const standPartColors = ['#ec008c', '#9e1f63', '#e179dd', '#e1d57f'];
  return Object.fromEntries(
    Object.entries(COLOR_TO_PANEL_10BOX_COMMON).filter(
      ([color]) => !standPartColors.includes(color),
    ),
  );
})();

// For zudo-block-60-open Type A and B models - 2 panels
export const COLOR_TO_PANEL_OPEN_2: { [key: string]: string } = {
  '#9e005d': 'side1', // Left panel (purple/magenta)
  '#00a99d': 'side2', // Right panel (teal/cyan)
};

// For zudo-block-60-open Upgrade model - 6 panels
export const COLOR_TO_PANEL_OPEN_UPGRADE: { [key: string]: string } = {
  '#fbb040': 'back1', // Position 1: バック1 (orange)
  '#be1e2d': 'back2', // Position 2: バック2 (red)
  '#ff7bac': 'bottom1', // Position 3: ボトム1 (pink)
  '#ed1e79': 'bottom2', // Position 4: ボトム2 (magenta/red)
  '#f9ed32': 'top1', // Position 5: トップ1 (yellow)
  '#c69c6d': 'top2', // Position 6: トップ2 (tan/beige)
};

// For zudo-stand models - 4 panels (all variants use same mapping)
export const COLOR_TO_PANEL_ZUDO_STAND: { [key: string]: string } = {
  '#fbb040': 'angle1', // Left angle (orange)
  '#ed1e79': 'angle2', // Right angle (pink)
  '#be1e2d': 'support1', // Top support (red)
  '#ff7bac': 'support2', // Bottom support (light pink)
};

// For 5box-shallow model - 11 panels (5 main + 6 lid)
// Maps SVG path colors to panel IDs based on visual positions
export const COLOR_TO_PANEL_5BOX_SHALLOW: { [key: string]: string } = {
  '#00a99d': 'main-side1', // Visual pos 1: Left side -> Panel 1: メイン: サイド1
  '#ef4136': 'main-side2', // Visual pos 2: Top strip -> Panel 2: メイン: バック
  '#ed1c24': 'main-back1', // Visual pos 3: Center main -> Panel 3: メイン: ボトム
  '#00a651': 'main-bottom1', // Visual pos 4: Bottom strip -> Panel 4: メイン: フロント
  '#00aeef': 'main-bottom2', // Visual pos 5: Right side -> Panel 5: メイン: サイド2
  '#662d91': 'main-front', // Visual pos 6: Lid left edge -> Panel 6: フタ: サイド1
  '#a97c50': 'lid-side1', // Visual pos 7: Transition strip -> Panel 7: フタ: バック
  '#a7a9ac': 'lid-side2', // Visual pos 8: Lid left section -> Panel 8: フタ: トップ1
  '#939598': 'lid-back1', // Visual pos 9: Lid right section -> Panel 9: フタ: トップ2
  '#808285': 'lid-back2', // Visual pos 10: Lid right edge -> Panel 10: フタ: フロント
  '#58595b': 'lid-front', // Visual pos 11: Lid bottom strip -> Panel 11: フタ: サイド2
};
