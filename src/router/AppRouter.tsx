import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import { Register } from '../pages/Register'
import { Dashboard } from "../pages/Dashboard"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Applications } from "../pages/Applications"
import Layout from "../components/Layout"
import { Settings } from "../pages/Settings"
export const AppRouter = () => {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute>
                <Layout>
                    <Dashboard />
                </Layout>
            </ProtectedRoute>}></Route>

            <Route path="/applications" element={
                <ProtectedRoute>
                    <Layout>
                        <Applications></Applications>
                    </Layout>
                </ProtectedRoute>}>
            </Route>
            <Route path="/settings" element={<ProtectedRoute>
                <Layout>
                    <Settings></Settings>
                </Layout>
            </ProtectedRoute>}>
            </Route>
        </Routes>

    )
}

