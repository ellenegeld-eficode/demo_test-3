# Styling Guidelines

Apply a black and yellow theme to all UI and styling work (HTML, CSS, JS-generated markup).

## Color palette

Define colors as CSS custom properties in `:root` and reference them with `var(--name)`. Do not hard-code color values elsewhere.

```css
:root {
  --bg: #000000;          /* page background */
  --card: #111111;        /* surfaces, cards, containers */
  --display-bg: #1a1a1a;  /* inset areas, inputs, displays */
  --text: #ffffff;        /* primary text on dark surfaces */
  --muted: #b3b3b3;       /* secondary text */
  --accent: #ffd400;      /* primary yellow: buttons, highlights, focus */
  --accent-hover: #ffea4d;/* lighter yellow for hover */
  --on-accent: #000000;   /* text/icons placed on yellow */
  --border: #333333;      /* subtle dividers */
}
```

## Rules

- Backgrounds are black or near-black; yellow is reserved for accents (primary actions, active states, highlights, focus rings, key headings).
- Text on dark surfaces is white or light gray. Text on yellow is always black.
- Use yellow sparingly so it stands out; avoid large yellow areas except for primary buttons.
- Hover/active states: lighten yellow for primary elements; lighten the surface (`--display-bg`) for neutral elements.
- Keep WCAG AA contrast (4.5:1 for body text). Never place yellow text on white or light backgrounds.
- Provide a visible focus style, e.g. `outline: 2px solid var(--accent); outline-offset: 2px;`.
- Do not introduce other hues (blue, purple, red, etc.) except for essential status colors, and keep those minimal.

## General conventions

- Keep styles in `style.css`; avoid inline styles.
- Reuse existing variables and class names before adding new ones.
- Preserve the existing layout, radius, spacing, and font settings unless asked to change them.
