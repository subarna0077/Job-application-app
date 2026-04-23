import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApplicationContextProvider } from './context/ApplicationContext.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from './context/UserContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeContextProvider>
     
      <BrowserRouter>
       <UserContextProvider>
         <ApplicationContextProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </ApplicationContextProvider>

       </UserContextProvider>
        

         
       

      </BrowserRouter>
   

    </ThemeContextProvider>
  </QueryClientProvider>

  ,
)
