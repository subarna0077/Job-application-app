import { Routes, Route , Navigate} from "react-router-dom"
import { Login } from "../pages/Login"
import { Register } from '../pages/Register'
import { Dashboard } from "../pages/Dashboard"
import { ProtectedRoute } from "../components/ProtectedRoute"
import Layout from "../components/Layout"
export const AppRouter = () => {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/login"/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>

            <Route path="/dashboard" element={<ProtectedRoute>
                <Layout>
                    <Dashboard />
                </Layout>
            </ProtectedRoute>}></Route>
        </Routes>

    )
}

