import { Button, Select } from "@mui/material"
import { Sort, Add } from "@mui/icons-material"

export type RouteConfig = {
    path: string
    title: string
    actions?: ReactNode
}

export const ROUTES: RouteConfig[] = [
    {
        path: "/dashboard",
        title: "Dashboard",
    },
    {
        path: "/applications",
        title: "Applications",
    },
    {
        path: "/settings",
        title: "Settings",
    },
]