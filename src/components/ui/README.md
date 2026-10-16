# shadcn/ui + DESIGN.md

Full shadcn registry (`radix-nova`, JSX) themed with Notion Analysis tokens from `DESIGN.md`.

## Setup

- Config: [`components.json`](../../../components.json)
- Theme: [`src/index.css`](../../index.css) (`:root` semantic vars + `@theme inline`)
- Brand extras: [`src/styles/theme.css`](../../styles/theme.css) (night band, stickers, spacing, shadows)
- Typography: [`src/styles/typography.css`](../../styles/typography.css)
- Utils: `import { cn } from "@/lib/utils"` (re-exports `cn` package)

## Token map (DESIGN.md → shadcn)

| DESIGN.md | shadcn CSS var | Utility |
| --- | --- | --- |
| `canvas-soft` | `--background` | `bg-background` |
| `ink` | `--foreground` | `text-foreground` |
| `surface` | `--card` / `--popover` | `bg-card` |
| `primary` | `--primary` | `bg-primary` |
| `on-primary` | `--primary-foreground` | `text-primary-foreground` |
| soft support | `--secondary` / `--muted` / `--accent` | `bg-secondary`, `bg-muted` |
| `ink-muted` | `--muted-foreground` | `text-muted-foreground` |
| `hairline` | `--border` / `--input` | `border-border` |
| `primary` | `--ring` | `ring-ring` |
| `rounded.lg` (12px) | `--radius` | `rounded-lg` |

Brand-only (not shadcn semantics):

- `bg-night` — indigo hero (`DESIGN.md` secondary)
- `accent-sky` … `accent-brown` — sticker palette only
- `text-display-1` … `text-eyebrow` — type scale

## Usage

```js
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NavBar, HeroBand, Footer } from '@/components/brand'
```

Add more later:

```bash
npx shadcn@latest add <component>
```

## Do / Don’t

**Do:** reserve `primary` for CTAs/links; keep pages on `background` (`canvas-soft`); stickers decorative only.

**Don’t:** paint CTAs with sticker colors; use `bg-secondary` for the night hero — use `bg-night` instead.
