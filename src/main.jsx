import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import SetupNeeded from './components/SetupNeeded.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { VehicleProvider } from './context/VehicleContext.jsx'
import { isSupabaseConfigured } from './lib/supabase.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSupabaseConfigured ? (
      <BrowserRouter>
        <SettingsProvider>
          <VehicleProvider>
            <App />
          </VehicleProvider>
        </SettingsProvider>
      </BrowserRouter>
    ) : (
      <SetupNeeded />
    )}
  </StrictMode>
)
