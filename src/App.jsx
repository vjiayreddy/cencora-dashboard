import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Footer,
  HeroBand,
  Input,
  NavBar,
} from './components/ui'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="flex min-h-dvh flex-col bg-canvas-soft">
      <NavBar className="border-b border-hairline">
        <span className="text-title font-semibold text-ink">Design System</span>
        <nav className="ml-auto flex items-center gap-md">
          <a href="#components" className="text-ink no-underline hover:text-primary">
            Components
          </a>
          <Button variant="utility">Get started</Button>
        </nav>
      </NavBar>

      <HeroBand className="flex flex-col gap-lg">
        <Badge className="self-start bg-white/10 text-on-primary">
          Notion Analysis tokens
        </Badge>
        <h1 className="max-w-3xl text-display-1 text-on-primary max-md:text-[40px]">
          Meet the design system
        </h1>
        <p className="max-w-xl text-body-md font-normal text-white/80">
          Warm canvas, Inter type, and a single structural blue — wired from
          DESIGN.md into Tailwind tokens and React primitives.
        </p>
        <div className="flex flex-wrap gap-sm">
          <Button variant="primary">Primary CTA</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </HeroBand>

      <main
        id="components"
        className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col gap-xl px-md py-xxl"
      >
        <div className="flex flex-col gap-xs">
          <h2 className="text-heading-2 text-ink">Primitives</h2>
          <p className="text-body-md text-ink-muted">
            Smoke screen for tokens and UI components.
          </p>
        </div>

        <div className="grid gap-lg md:grid-cols-2">
          <Card>
            <div className="mb-md flex items-center justify-between gap-sm">
              <h3 className="text-heading-3">Buttons</h3>
              <Badge>chrome</Badge>
            </div>
            <p className="mb-lg text-body-sm text-ink-muted">
              Primary, secondary, utility, and icon variants.
            </p>
            <div className="flex flex-wrap items-center gap-sm">
              <Button
                variant="primary"
                onClick={() => setCount((c) => c + 1)}
              >
                Count is {count}
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="utility">Utility</Button>
              <Button variant="icon" aria-label="Icon button">
                +
              </Button>
            </div>
          </Card>

          <Card elevated>
            <h3 className="mb-md text-heading-3">Elevated card</h3>
            <p className="mb-lg text-body-sm text-ink-muted">
              Soft layered shadow (Level 1) instead of a hairline border.
            </p>
            <label className="mb-xxs block text-eyebrow text-ink-muted">
              Text input
            </label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name ? (
              <p className="mt-sm text-caption text-ink-secondary">
                Hello, {name}
              </p>
            ) : null}
          </Card>
        </div>

        <Card>
          <h3 className="mb-sm text-title">Sticker palette (decorative)</h3>
          <p className="mb-md text-body-sm text-ink-muted">
            Accents for illustrations and category dots — never CTAs.
          </p>
          <div className="flex flex-wrap gap-xs">
            {[
              'bg-accent-sky',
              'bg-accent-purple',
              'bg-accent-pink',
              'bg-accent-orange',
              'bg-accent-teal',
              'bg-accent-green',
              'bg-accent-brown',
            ].map((swatch) => (
              <span
                key={swatch}
                className={`size-8 rounded-full ${swatch}`}
                title={swatch}
              />
            ))}
          </div>
        </Card>
      </main>

      <Footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-md">
          <span>Design system scaffold · tokens from DESIGN.md</span>
          <span className="text-ink-faint">canvas-soft · primary · Inter</span>
        </div>
      </Footer>
    </div>
  )
}

export default App
