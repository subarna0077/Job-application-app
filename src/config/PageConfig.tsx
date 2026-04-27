import { useNavigate, useLocation } from 'react-router-dom'
import {Button} from '@mui/material'
import {Sort, Add} from '@mui/icons-material'
 
// Define title + actions per route
const PAGE_CONFIG = {
  '/dashboard': {
    title: 'Dashboard',
    actions: null, // no buttons on dashboard
  },
  '/applications': {
    title: 'Applications',
    actions: (navigate: ReturnType<typeof useNavigate>) => (
      <>
        <Button startIcon={<Sort fontSize="small" />} sx={{ bgcolor: t.border, color: t.text2, fontSize: 12.5, fontWeight: 500, px: "14px", py: "7px", borderRadius: "8px", textTransform: "none", "&:hover": { bgcolor: t.border2, color: t.text } }}>
          Sort
        </Button>
        <Button startIcon={<Add fontSize="small" />} sx={{ bgcolor: t.accent, color: "#fff", fontSize: 12.5, fontWeight: 500, px: "14px", py: "7px", borderRadius: "8px", textTransform: "none", "&:hover": { bgcolor: "#4f52d9" } }}>
          Add Application
        </Button>
      </>
    ),
  },
  '/settings': {
    title: 'Settings',
    actions: null,
  },
} as const