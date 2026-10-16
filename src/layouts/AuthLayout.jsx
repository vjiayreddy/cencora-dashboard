import { Link } from 'react-router-dom'

/**
 * Split-panel auth shell: navy brand panel + form side.
 * Mobile: brand collapses to a compact top strip.
 */
export default function AuthLayout({
  brandHeadline = 'Sign in to your workspace',
  children,
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background md:flex-row">
      <aside className="relative w-full overflow-hidden bg-night px-6 py-8 text-on-primary md:flex md:w-[45%] md:shrink-0 md:flex-col md:justify-between md:px-10 md:py-12 lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,163,217,0.22),transparent_50%)]"
        />
        <div className="relative z-10 flex flex-col gap-3 md:gap-6">
          <Link
            to="/"
            className="w-fit text-title font-semibold text-on-primary no-underline hover:opacity-90"
          >
            Q Scan
          </Link>
          <p className="max-w-[22rem] text-body-md text-on-primary/80 md:text-heading-2 md:leading-tight md:text-on-primary">
            {brandHeadline}
          </p>
        </div>
        <p className="relative z-10 mt-6 hidden text-caption text-on-primary/55 md:mt-0 md:block">
          Secure access to your dashboard
        </p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[28rem]">{children}</div>
      </main>
    </div>
  )
}
