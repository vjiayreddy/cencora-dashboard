import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthFormShell } from '@/components/auth/AuthFormShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout from '@/layouts/AuthLayout'
import { signIn, useSession } from '@/lib/auth-client'

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'password123'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending: sessionPending } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/dashboard'
  const hasError = Boolean(error)

  if (sessionPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (session) {
    return <Navigate to={from} replace />
  }

  function fillDemoAccount() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn.email({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message || 'Invalid email or password')
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <AuthLayout brandHeadline="Sign in to your workspace">
      <AuthFormShell
        title="Welcome back"
        description="Enter your email to continue."
        error={error}
        footer={{
          prompt: 'No account?',
          label: 'Sign up',
          to: '/signup',
        }}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError || undefined}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password">Password</Label>
              <span
                className="cursor-default text-caption text-muted-foreground/70"
                title="Password reset is not available yet"
              >
                Forgot password?
              </span>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={hasError || undefined}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full text-button lg:h-12 lg:text-base"
            disabled={loading}
          >
            {loading ? <Spinner className="size-4" /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={fillDemoAccount}
            disabled={loading}
          >
            Fill demo account
          </Button>
        </form>
      </AuthFormShell>
    </AuthLayout>
  )
}
