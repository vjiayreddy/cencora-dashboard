import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="h-20 w-20 transition hover:drop-shadow-[0_0_1.5em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-20 w-20 transition hover:drop-shadow-[0_0_1.5em_#61dafbaa]"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
        Vite + React + Tailwind
      </h1>

      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <button
          type="button"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <p className="text-slate-600">
          Edit{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-800">
            src/App.jsx
          </code>{' '}
          and save to test HMR
        </p>
      </div>

      <p className="text-sm text-slate-500">
        Tailwind CSS is configured and ready to use.
      </p>
    </div>
  )
}

export default App
