import { betterAuth } from 'better-auth'
import { memoryAdapter } from '@better-auth/memory-adapter'

/**
 * In-memory store for local/mock auth.
 * Data resets when the auth server restarts (no native SQLite required).
 */
const memoryDb = {
  user: [],
  session: [],
  account: [],
  verification: [],
}

export const auth = betterAuth({
  database: memoryAdapter(memoryDb),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8787',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  emailAndPassword: {
    enabled: true,
  },
})
