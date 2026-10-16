import { createAuthClient } from 'better-auth/react'

/**
 * Uses Vite proxy (/api/auth → localhost:8787) so cookies stay same-origin.
 */
export const authClient = createAuthClient()

export const { useSession, signIn, signUp, signOut } = authClient
