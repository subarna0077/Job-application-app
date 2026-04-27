import React from 'react'
import { Typography, Box, Avatar, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Icon, Dialog, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { GridView, Assignment, Settings } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ROUTES } from '../router/RouteConfig'
import JobApplicationForm from './JobApplicationForm'
import { useAuthStore } from '../features/user/stores'
import { useAppStore } from '../features/applications/stores'
import type { SortBy } from '../features/applications/stores'


// layout is: sidebar + topbar and render content inside



const Layout = ({ children }: { children: React.ReactNode }) => {

    const name = localStorage.getItem('name')
    const logout  = useAuthStore(set=> set.logout)
    const navigate = useNavigate()
    const location = useLocation()
    const currentRoute = ROUTES.find((route) => location.pathname.startsWith(route.path))
    const [openModal, setOpenModal] = useState(false)
    const {setSortBy, sortBy} = useAppStore()
    // returns {path: '/dashboard', title: 'Dashboard'}

    const NAV_ITEMS = [
        { icon: <GridView fontSize="small" />, label: "Dashboard", badge: 0, path: '/dashboard' },
        { icon: <Assignment fontSize="small" />, label: "Applications", badge: 12, path: '/applications' },
        { icon: <Settings fontSize="small" />, label: "Settings", badge: 0, path: '/settings' }
    ];




    function Sidebar() {
        return (
            <Drawer
                variant="permanent"
                sx={{
                    width: 220,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 220,
                        boxSizing: "border-box",

                        height: "100%",
                        overflow: "hidden",
                    },
                }}
            >
                {/* Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: "18px", pt: "20px", pb: "24px" }}>
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "7px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        J
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>
                        JobTracker
                    </Typography>
                </Box>

                {/* Nav label */}
                <Typography
                    sx={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", px: "18px", mb: "6px" }}
                >
                    Menu
                </Typography>

                {/* Nav items */}
                <List disablePadding sx={{ px: "12px" }}>
                    {NAV_ITEMS.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: "2px" }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path)
                                }}
                                sx={{
                                    borderRadius: "8px",
                                    py: "7px",
                                    px: "10px",
                                    gap: "10px",

                                    fontWeight: 500

                            }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                />
                                {item.badge > 0 && (
                                    <Box
                                        sx={{
                                            ml: "auto",

                                            color: "#fff",
                                            fontSize: 10,
                                            fontWeight: 600,
                                            px: "6px",
                                            py: "1px",
                                            borderRadius: "99px",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {item.badge}
                                    </Box>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Footer */}
                <Box sx={{ mt: "auto", pt: "14px", px: "12px", pb: "16px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", px: "10px", py: "8px", borderRadius: "8px", cursor: "pointer" }}>
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                                background: `linear-gradient(135deg,  #a855f7)`,
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                        >
                            {name?.slice(0, 1)}

                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{name}</Typography>
                            <Typography component="button" sx={{ fontSize: '11px', cursor: 'pointer', border: 'none', bgcolor: 'transparent' }} onClick={logout}>Log out</Typography>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        );
    }

    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: 'hidden', ml: '220px' }}>
                <Box
                    sx={{
                        px: 3,
                        py: "14px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",

                        flexShrink: 0,   // prevents topbar from shrinking
                    }}
                >
                    <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
                        {currentRoute?.title}

                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {currentRoute?.path == '/applications' &&

                            <FormControl size="small">
                                <InputLabel>Sort</InputLabel>

                                <Select
                                value={sortBy}
                                onChange={(e)=> setSortBy(e.target.value as SortBy )}
                                   
                                    label="Sort by"
                                >
                                    <MenuItem value="A-Z">A-Z</MenuItem>
                                    <MenuItem value="Date">Date</MenuItem>
                                </Select>
                            </FormControl>
                        }
                        {(currentRoute?.path == '/dashboard' || currentRoute?.path == '/applications') &&
                            <Button fullWidth onClick={() => setOpenModal(true)}>Add applications</Button>}




                    </Box>
                </Box>

                {/* Page content — scrollable */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                    {children}
                </Box>

                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <JobApplicationForm />
                </Dialog>

            </Box>
        </Box>
    )
}

export default Layout
