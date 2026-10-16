import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider } from 'ag-grid-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AgGridProvider modules={[AllCommunityModule]}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </AgGridProvider>
  </StrictMode>,
)
