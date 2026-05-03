import React from 'react'


export type RouteConfig = {
    path: string
    title: string
    actions?: React.ReactNode
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
        path: "/jobs",
        title: "Jobs"
    },
    {
        path: "/settings",
        title: "Settings",
    },
]