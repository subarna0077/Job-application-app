import React, { useState } from 'react'
import {
  Typography, Box, Avatar, Button, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Dialog,
  FormControl, InputLabel, Select, MenuItem, Divider,
  IconButton, useMediaQuery, useTheme
} from '@mui/material'
import { GridView, Assignment, Settings, SearchOff, Add, Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../router/RouteConfig'
import JobApplicationForm from './JobApplicationForm'
import { useAuthStore } from '../features/user/stores'
import { useAppStore } from '../features/applications/stores'
import type { SortBy } from '../features/applications/stores'

const SIDEBAR_WIDTH = 230

const NAV_ITEMS = [
  { icon: <GridView fontSize="small" />, label: 'Dashboard', path: '/dashboard' },
  { icon: <SearchOff fontSize="small" />, label: 'Explore jobs', path: '/jobs' },
  { icon: <Assignment fontSize="small" />, label: 'Applications', path: '/applications' },
  { icon: <Settings fontSize="small" />, label: 'Settings', path: '/settings' },
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const name = localStorage.getItem('name') ?? ''
  const logout = useAuthStore(set => set.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const currentRoute = ROUTES.find(route => location.pathname.startsWith(route.path))
  const [openModal, setOpenModal] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)  // ← mobile drawer state
  const { setSortBy, sortBy } = useAppStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))  // ← true on small screens

  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleNavClick = (path: string) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)  // ← close drawer on nav on mobile
  }

  // Extracted into its own component so both drawers share the same content
  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '9px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)', flexShrink: 0,
        }}>
          J
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em', color: 'text.primary' }}>
          JobTracker
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <Typography sx={{
        fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'text.disabled', px: 2.5, pt: 2.5, pb: 1, fontWeight: 600,
      }}>
        Navigation
      </Typography>

      <List disablePadding sx={{ px: 1.5, flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path)
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: '3px' }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: '10px', py: '8px', px: '10px', gap: '10px',
                  color: active ? 'primary.main' : 'text.secondary',
                  bgcolor: active ? 'primary.main' + '18' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: active ? 'primary.main' + '22' : 'action.hover',
                    color: active ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: 'inherit' }}
                />
                {active && (
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', ml: 'auto' }} />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Footer */}
      <Box sx={{ px: 1.5, py: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 1.5, py: 1.2, borderRadius: '10px', cursor: 'pointer',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: 'action.hover' },
        }}>
          <Avatar sx={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            fontSize: 12, fontWeight: 700,
          }}>
            {name.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
              {name}
            </Typography>
            <Typography
              component="button" onClick={logout}
              sx={{
                fontSize: 11, color: 'text.disabled', cursor: 'pointer',
                border: 'none', bgcolor: 'transparent', p: 0, lineHeight: 1.3,
                '&:hover': { color: 'error.main' }, transition: 'color 0.15s',
              }}
            >
              Log out
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  const showAddButton = ['/dashboard', '/applications'].includes(currentRoute?.path ?? '')
  const showSort = currentRoute?.path === '/applications'

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.default', overflow: 'hidden' }}>

      {/* ── Mobile drawer (temporary, opens on hamburger click) ── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}   // better mobile performance
        sx={{
          display: { xs: 'block', md: 'none' },   // only visible on mobile
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* ── Desktop drawer (permanent, always visible) ── */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },   // hidden on mobile
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            top: 0,
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'relative'
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Topbar */}
        <Box sx={{
          px: { xs: 2, md: 3 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0, minHeight: 56,
          gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Hamburger — only on mobile */}
            {isMobile && (
              <IconButton
                size="small"
                onClick={() => setMobileOpen(true)}
                sx={{ color: 'text.secondary' }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            )}
            <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'text.primary' }}>
              {currentRoute?.title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {showSort && (
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel sx={{ fontSize: 13 }}>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortBy)}
                  label="Sort by"
                  sx={{ fontSize: 13, borderRadius: '8px' }}
                >
                  <MenuItem value="A-Z">A–Z</MenuItem>
                  <MenuItem value="Date">Date</MenuItem>
                </Select>
              </FormControl>
            )}
            {showAddButton && (
              <Button
                onClick={() => setOpenModal(true)}
                variant="contained"
                startIcon={!isMobile && <Add />}  // hide icon text on mobile to save space
                size="small"
                sx={{
                  borderRadius: '8px', textTransform: 'none',
                  fontWeight: 600, fontSize: 13, px: 2,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isMobile ? <Add sx={{ fontSize: 18 }} /> : 'Add application'}
              </Button>
            )}
          </Box>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
          <JobApplicationForm />
        </Dialog>
      </Box>
    </Box>
  )
}