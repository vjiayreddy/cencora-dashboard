import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer, HeroBand, NavBar } from '@/components/brand'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <NavBar>
        <span className="text-title font-semibold text-foreground">
          Design System
        </span>
        <nav className="ml-auto flex items-center gap-md">
          <a
            href="#components"
            className="text-foreground no-underline hover:text-primary"
          >
            Components
          </a>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </nav>
      </NavBar>

      <HeroBand className="flex flex-col gap-lg">
        <Badge
          variant="outline"
          className="self-start border-white/20 bg-white/10 text-on-primary"
        >
          shadcn + DESIGN.md
        </Badge>
        <h1 className="max-w-3xl text-display-1 text-on-primary max-md:text-[40px]">
          Meet the design system
        </h1>
        <p className="max-w-xl text-body-md font-normal text-white/80">
          Notion tokens mapped onto shadcn semantic CSS variables — full
          registry installed under{' '}
          <code className="text-sm">src/components/ui</code>.
        </p>
        <div className="flex flex-wrap gap-sm">
          <Button asChild>
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </HeroBand>

      <main
        id="components"
        className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col gap-xl px-md py-xxl"
      >
        <div className="flex flex-col gap-xs">
          <h2 className="text-heading-2 text-foreground">Primitives</h2>
          <p className="text-body-md text-muted-foreground">
            Smoke screen for shadcn components themed with DESIGN.md.
          </p>
        </div>

        <div className="grid gap-lg md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-sm">
                <CardTitle className="text-heading-3">Buttons</CardTitle>
                <Badge>chrome</Badge>
              </div>
              <CardDescription>
                Default, secondary, outline, and ghost variants.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-sm">
              <Button onClick={() => setCount((c) => c + 1)}>
                Count is {count}
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3">Form</CardTitle>
              <CardDescription>
                Input + label on the warm canvas with hairline borders.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sm">
              <div className="flex flex-col gap-xxs">
                <Label htmlFor="name" className="text-eyebrow text-muted-foreground">
                  Text input
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {name ? (
                <p className="text-caption text-ink-secondary">Hello, {name}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-title">Sticker palette (decorative)</CardTitle>
            <CardDescription>
              Accents for illustrations and category dots — never CTAs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-md" />
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
          </CardContent>
        </Card>
      </main>

      <Footer>
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-md">
          <span>shadcn registry · tokens from DESIGN.md</span>
          <span className="text-ink-faint">background · primary · Inter</span>
        </div>
      </Footer>
    </div>
  )
}
