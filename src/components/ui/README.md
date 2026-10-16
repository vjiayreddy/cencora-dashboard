# UI design system

Tokens and primitives mapped from root `DESIGN.md` (Notion Analysis).

## Token → class map

| Group | Token examples | Tailwind classes |
| --- | --- | --- |
| Colors | `primary`, `ink`, `canvas-soft`, `hairline` | `bg-primary`, `text-ink`, `bg-canvas-soft`, `border-hairline` |
| Radii | `xs`–`full` | `rounded-xs`, `rounded-lg`, `rounded-full` |
| Spacing | `xxs`–`xxl` | `p-lg`, `gap-sm`, `px-md` |
| Shadows | soft / elevated | `shadow-soft`, `shadow-elevated` |
| Type | display → eyebrow | `text-display-1`, `text-heading-1`, `text-body-md`, `text-eyebrow` |

Theme lives in [`src/styles/theme.css`](../../styles/theme.css). Typography utilities live in [`src/styles/typography.css`](../../styles/typography.css).

## Components

```js
import { Badge, Button, Card, Footer, HeroBand, Input, NavBar } from './components/ui'
```

| Component | DESIGN.md | Notes |
| --- | --- | --- |
| `Button` | `button-primary` / `secondary` / `utility` / `icon` | `variant` prop; primary uses `active:bg-primary-active` |
| `Badge` | `badge-pill` | Primary text on surface |
| `Card` | `feature-card` | `elevated` → soft shadow |
| `Input` | `text-input` | `rounded-xs`, focus soft shadow |
| `NavBar` | `nav-bar` | Sticky white bar shell |
| `HeroBand` | `hero-band` | Full-bleed secondary night band |
| `Footer` | `footer` | canvas-soft band |

Use `cn()` from `src/lib/cn.js` when composing classes.

## Do / Don’t (from DESIGN.md)

**Do**

- Reserve `primary` for the primary action, links, and focus/active signals
- Keep pages on `canvas-soft`; use `surface` for cards and fields
- Keep sticker accents (`accent-*`) in illustrations, icon tiles, and category dots
- Use `rounded-full` for marketing CTAs and `rounded-md` for utility buttons
- Prefer hairline + `shadow-soft` over heavy drop-shadows

**Don’t**

- Paint a CTA with a sticker-palette color
- Introduce a second structural accent beside `primary`
- Put pill radii on form fields — inputs stay at `rounded-xs`
- Set body copy in weight 700 — keep 400 for body, 700 for headlines
