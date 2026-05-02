import { Box, Button, Typography, Paper, Card, Toolbar, Stack, Chip, IconButton, Dialog } from '@mui/material'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import JobApplicationForm from '../components/JobApplicationForm';
import { useGetPosts } from '../hooks/useGetPosts';
import { useDeletePost } from '../hooks/useDeletePost';

const statsRow = [
  {label: 'All', key: 'all', color: '' },
  {label: 'Saved', key: 'saved', color: '#3af1c0'},
  { label: 'Total applied', key: 'applied', color: '#5280c9' },
  { label: 'Interview', key: 'interview', color: '#e69f26' },
  { label: 'Offers', key: 'offer', color: '#34ba64' },
  { label: 'Rejected', key: 'rejected', color: '#da4c4a' },
]

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialog = () => {
    setIsDialogOpen(true);
  }

  const { data: applications = [] } = useGetPosts()
  
  const filteredApplications = activeFilter === 'all' ? applications: applications.filter(app=> app.status === activeFilter)

  const statFilter = {
    all: applications,
    saved: applications.filter(app=> app.status === 'saved'),
    applied: applications.filter(app=> app.status === 'applied'),
    interview: applications.filter(app=> app.status === 'interview'),
    offer: applications.filter(app=> app.status === 'offer'),
    rejected: applications.filter(app=> app.status === 'rejected')
  }
  
  const statValues = {
    all: applications.length,
    saved: applications.filter(app=> app.status === 'saved').length,
    applied: applications.filter(app=> app.status === 'applied').length,
    interview: applications.filter(app=> app.status === 'interview').length,
    offer: applications.filter(app=> app.status === 'offer').length,
    rejected: applications.filter(app=> app.status === 'rejected').length

  }



  const { mutate: deletePost, data } = useDeletePost()
  


  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', p: { xs: 2, md: 4 } }}>
      <Toolbar></Toolbar>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4,1fr)' }, gap: 2, mb: 3 }}>
        {statsRow.map(({ label, key: statKey, color }) => (
          <Card key={statKey} sx={{
            bgcolor: 'background.paper',   // ← surface
            border: '1px solid',
            borderColor: 'divider',        // ← border token used correctly
            borderRadius: 3, p: 3,
            position: 'relative', overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute',
              top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, ${color}, transparent)`,
            },
          }}>
            <Typography sx={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
              {label}
            </Typography>
            <Typography sx={{ fontFamily: '"Syne", sans-serif', fontSize: { sm: 16, md: 22, lg: 28 }, fontWeight: { sm: 400, md: 800 }, color }}>
              {statValues[statKey as keyof typeof statValues ]}


            </Typography>
          </Card>
        ))}
      </Box>


      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1,1fr)', sm: 'repeat(2,1fr)' }, gap: 2, my: 3 }}>
        <Stack direction="column" sx={{ gap: 1 }}>
          <Button sx={{ color: 'black', width: 'full', background: 'white' }} onClick={() => handleDialog()}>Add application</Button>
          {
            filteredApplications.map(app => <Paper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2, textAlign: 'left' }}>
              <Stack>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', mb: '2px' }}>{app.role}</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.secondary' }}>{app.company}</Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{new Date(app.appliedDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</Typography>
              </Stack>

              <Box>
                <Chip label={app.status} sx={{ fontSize: '12px' }} />
                <IconButton size='small' onClick={() => deletePost(app.id)} ><DeleteIcon></DeleteIcon></IconButton>
                <IconButton size='small' ><LinkIcon /></IconButton>


                <IconButton></IconButton>

              </Box>
            </Paper>)
          }

        </Stack>

        <Stack direction="column" sx={{ gap: 1, textAlign: 'left' }}>
          <Typography>Filter by status</Typography>
          {statsRow.map(({ label, key }) =>
            <Stack id={label} direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography component='button' onClick={()=> setActiveFilter(key)} sx={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'text.primary' }}>{key.toUpperCase()}</Typography>
              <Typography>{statValues[key as keyof typeof statValues]}</Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <JobApplicationForm />
      </Dialog>
    </Box>
  )
}


