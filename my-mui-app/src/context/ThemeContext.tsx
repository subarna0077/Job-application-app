import { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from '../theme/theme'

type ThemeMode = "light" | "dark"

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [mode, setMode] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem('theme') as ThemeMode
        return stored || 'dark'
    })

    const toggleTheme = () => {
        setMode(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', newMode)
            return newMode
        })
    }

    // Memoize theme (important for performance)
    const muiTheme = useMemo(() => getTheme(mode), [mode])

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useThemeContext = ()=>{
    const context = useContext(ThemeContext)
    if(!context) {
        throw new Error("Context must be within the provider range.")
    }
    return context;
}