import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/user';
import { useMutation } from '@tanstack/react-query'

interface User {
    email: string;
    id: string;
    name: string;
}

interface UserContextType {
    loginUser: (data: LoginFormType) => void;
    logout: () => void;
    registerUser: (data: RegisterFormType) => void;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
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

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(() => {
        const id = localStorage.getItem("userId")
        const email = localStorage.getItem("email")
        const name = localStorage.getItem("name")

        if (!id) return null
        return {
            id,
            email: email || "",
            name: name || ""
        }
    });

    const { mutate: loginUser, isPending: isLoading, data, isError } = useMutation({
        mutationFn: (formData: LoginFormType) => login(formData),
        onSuccess: (responseData) => {
            localStorage.setItem('token', responseData.accessToken)
            localStorage.setItem('name', responseData.user.name),
            localStorage.setItem('email', responseData.user.email)
            setIsAuthenticated(true)
            setUser(responseData.user)
            navigate('/dashboard')
        },
    })

    console.log('Data from mutation', data)
    console.log(isLoading, isError)

    const { mutate: registerUser } = useMutation({
        mutationFn: (FormData: RegisterFormType) => register(FormData),
        onSuccess: () => {
            navigate('/login')
        }
    })

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
    }



    return (
        <UserContext.Provider
            value={{ loginUser, logout, registerUser, user, isAuthenticated, isLoading }}

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