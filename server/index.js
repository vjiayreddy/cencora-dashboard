import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth.js'

const app = new Hono()
const port = Number(process.env.PORT) || 8787

app.use(
  '/api/auth/*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
  }),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/health', (c) => c.json({ ok: true }))

async function seedDemoUser() {
  // Demo credentials for local mock login — reset on server restart
  const email = 'demo@example.com'
  const password = 'password123'

  try {
    await auth.api.signUpEmail({
      body: {
        name: 'Demo User',
        email,
        password,
      },
    })
    console.log(`Seeded demo user: ${email} / ${password}`)
  } catch (error) {
    const message = error?.message || String(error)
    if (/already|exists/i.test(message)) {
      console.log(`Demo user already present: ${email}`)
      return
    }
    console.warn('Demo user seed skipped:', message)
  }
}

serve({ fetch: app.fetch, port }, async (info) => {
  console.log(`Auth server listening on http://localhost:${info.port}`)
  await seedDemoUser()
})
