import { Box, Button, Typography, Paper, Stack, Chip, IconButton } from '@mui/material'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import { useGetPosts } from '../../hooks/useGetPosts'
import { useDeletePost } from '../../hooks/useDeletePost'
import { useNavigate } from 'react-router-dom'
import TinyBarChart from '../../components/Charts'
import { TrendingUp } from '@mui/icons-material'
import type { DataType } from '../../components/Charts'

const STATUS_CONFIG = {
  saved:     { label: 'Saved',      color: '#6366f1' },
  applied:   { label: 'Applied',    color: '#3b82f6' },
  interview: { label: 'Interview',  color: '#f59e0b' },
  offer:     { label: 'Offer',      color: '#10b981' },
  rejected:  { label: 'Rejected',   color: '#ef4444' },
}

const statsRow = [
  { label: 'Total Applied',   key: 'all',       color: '#6366f1' },
  { label: 'Interviews',      key: 'interview', color: '#f59e0b' },
  { label: 'Offers',          key: 'offer',     color: '#10b981' },
  { label: 'Response Rate',   key: 'response',  color: '#3b82f6' },
]

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const { data: applications = [] } = useGetPosts()
  const { mutate: deletePost } = useDeletePost()
  const navigate = useNavigate()

  const filteredApplications = activeFilter === 'all'
    ? applications
    : applications.filter(app => app.status === activeFilter)

  const statValues = {
    all:       applications.length,
    saved:     applications.filter(a => a.status === 'saved').length,
    applied:   applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer:     applications.filter(a => a.status === 'offer').length,
    rejected:  applications.filter(a => a.status === 'rejected').length,
    response:  applications.length
      ? `${(applications.filter(a => ['offer','interview','rejected'].includes(a.status)).length / applications.length * 100).toFixed(0)}%`
      : '0%',
  }


  const barData = Object.entries(STATUS_CONFIG).map(([key , {label: _, color} ])=> ({
    key: key,
    color: color,
    count: statValues[key as keyof typeof statValues]
  }));
  


  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>

      {/* Stat cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2, mb: 3,
      }}>
        {statsRow.map(({ label, key: statKey, color }) => (
          <Paper
            key={statKey}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${color}22`,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0, left: 0, right: 0, height: '3px',
                background: color,
                borderRadius: '0 0 14px 14px ',
              },
            }}
          >
            <Typography sx={{
              fontSize: 10.5, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'text.disabled',
              fontWeight: 600, mb: 1.5,
            }}>
              {label}
            </Typography>
            <Typography sx={{
              fontSize: 28, fontWeight: 800,
              color, lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {statValues[statKey as keyof typeof statValues]}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Chart + breakdown row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 220px' },
        gap: 2, mb: 3,
      }}>
        {/* Bar chart card */}
        <Paper elevation={0} sx={{
          p: 2.5, borderRadius: '14px',
          border: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
              Status breakdown
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
              <TrendingUp sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600 }}>
                {statValues.response} response
              </Typography>
            </Box>
          </Box>
          <TinyBarChart data={barData as DataType[]} />
        </Paper>

        {/* Status legend / filter */}
        <Paper elevation={0} sx={{
          p: 2.5, borderRadius: '14px',
          border: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper',
        }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Filter
          </Typography>
          <Stack spacing={0.75}>
            {[{ label: 'All', key: 'all', color: '#6366f1' }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ label: v.label, key: k, color: v.color }))].map(({ label, key, color }) => (
              <Box
                key={key}
                onClick={() => setActiveFilter(key)}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  px: 1.5, py: 1, borderRadius: '8px', cursor: 'pointer',
                  bgcolor: activeFilter === key ? color + '18' : 'transparent',
                  border: '1px solid',
                  borderColor: activeFilter === key ? color + '44' : 'transparent',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: color + '12' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'text.primary' }}>{label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>
                  {statValues[key as keyof typeof statValues]}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Recent applications */}
      <Paper elevation={0} sx={{
        borderRadius: '14px', border: '1px solid',
        borderColor: 'divider', bgcolor: 'background.paper',
        overflow: 'hidden',
      }}>
        <Box sx={{
          px: 2.5, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
            Recent applications
          </Typography>
          <Button
            variant="text" size="small"
            onClick={() => navigate('/applications')}
            sx={{ fontSize: 12, textTransform: 'none', fontWeight: 600 }}
          >
            View all →
          </Button>
        </Box>

        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
          {filteredApplications.slice(0, 5).map(app => (
            <Box
              key={app.id}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2.5, py: 1.75,
                transition: 'bgcolor 0.15s',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Stack spacing={0.3}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
                  {app.role}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                  {app.company}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                  {new Date(app.appliedDate).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </Typography>
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Chip
                  label={app.status}
                  size="small"
                  sx={{
                    fontSize: 11, fontWeight: 600,
                    bgcolor: (STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]?.color ?? '#888') + '20',
                    color: STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]?.color ?? 'text.secondary',
                    border: '1px solid',
                    borderColor: (STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]?.color ?? '#888') + '40',
                    height: 22,
                  }}
                />
                <IconButton size="small" onClick={() => deletePost(app.id)} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                  <LinkIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

    </Box>
  )
}