import { Link } from 'react-router-dom'
import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AuthFormShell({
  title,
  description,
  error,
  footer,
  children,
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-2 text-foreground">{title}</h1>
        {description ? (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {children}

      {footer ? (
        <p className="text-center text-sm text-muted-foreground">
          {footer.prompt}{' '}
          <Link
            to={footer.to}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {footer.label}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
