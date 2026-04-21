import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApplicationContextProvider } from './context/ApplicationContext.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
<ThemeContextProvider>
  <BrowserRouter>
   
      <ApplicationContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ApplicationContextProvider>
  </BrowserRouter>
  </ThemeContextProvider>

  ,
)
