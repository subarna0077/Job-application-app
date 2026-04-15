
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
    email: string;
    id: string;
    name: string;
}

interface UserContextType {
    login: (data: LoginFormType) => Promise<void>;
    logout: () => void;
    register: (data: RegisterFormType) => Promise<void>;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

interface LoginFormType {
    email: string;
    password: string;
}

interface RegisterFormType {
    name: string;
    email: string;
    password: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState(true)


    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(() => {
        const id = localStorage.getItem("userId")
        const email = localStorage.getItem("email")
        const name = localStorage.getItem("name")

        if(!id) return null
        return {
            id,
            email: email || "",
            name: name || ""
        }

    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token')

    })

    const login = async (LoginFormData: LoginFormType) => {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(LoginFormData)
        })

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('name', data.user.name)
            localStorage.setItem('email', data.user.email)
            setUser(data.user)
            setIsAuthenticated(true)
            alert('User logged in successfully')
            navigate('/dashboard')
        } else {
            alert('Failed to login user')
        }
    }

    const register = async (RegisterFormData: RegisterFormType) => {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(RegisterFormData)
        })
        if (response.ok) {
            alert('User registered successfully')
        } else {
            alert('Failed to register user')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId')
        const email = localStorage.getItem('email')
        const name = localStorage.getItem('name')
        if (token && userId) {
            setIsAuthenticated(true)
            setUser({ id: userId, email: email as string, name: name as string })
        }
        setLoading(false)


    }, [])


    return (
        <UserContext.Provider
            value={{ login, logout, register, user, isAuthenticated, loading }}

        >{children}</UserContext.Provider>
    )
}

export const useUserContext = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('Context must be within the provider')
    }
    return context;
}