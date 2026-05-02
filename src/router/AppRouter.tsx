import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import { Register } from '../pages/Register'
import { Dashboard } from "../pages/Dashboard"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Applications } from "../pages/Applications"
import { Settings } from "../pages/Settings"
import { JobsPage } from "../features/jobs/Pages/JobsPage"
import { Layout } from "../components/Layout"
import { JobDetailPage } from "../features/jobs/Pages/JobDetail"
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
            <Route path="/jobs" element={<ProtectedRoute>
                <Layout>
                    <JobsPage></JobsPage>
                </Layout>
            </ProtectedRoute>}>
            </Route>
             <Route path="/jobs/:id" element={<ProtectedRoute>
                <Layout>
                    <JobDetailPage></JobDetailPage>
                </Layout>
            </ProtectedRoute>}>
            </Route>
        </Routes>

    )
}

