import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthFormShell } from '@/components/auth/AuthFormShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout from '@/layouts/AuthLayout'
import { signUp, useSession } from '@/lib/auth-client'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { data: session, isPending: sessionPending } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hasError = Boolean(error)

  if (sessionPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message || 'Could not create account')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout brandHeadline="Create your workspace account">
      <AuthFormShell
        title="Create your account"
        description="Start with your name and email."
        error={error}
        footer={{
          prompt: 'Already have an account?',
          label: 'Sign in',
          to: '/login',
        }}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={hasError || undefined}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError || undefined}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              aria-invalid={hasError || undefined}
              required
            />
            <p className="text-caption text-muted-foreground">
              Use 8 or more characters.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full text-button lg:h-12 lg:text-base"
            disabled={loading}
          >
            {loading ? <Spinner className="size-4" /> : null}
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </AuthFormShell>
    </AuthLayout>
  )
}
