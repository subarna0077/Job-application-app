import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Paper, Card, Toolbar, Stack, Chip, IconButton, Dialog } from '@mui/material'
import { useState } from 'react'
import { useApplicationContext } from '../context/ApplicationContext';
import type { ApplicationCountByStatus } from '../context/ApplicationContext';
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'


const statsRow = [
  { label: 'Total applied', key: 'applied', color: '#5280c9' },
  { label: 'Interview', key: 'interview', color: '#e69f26' },
  { label: 'Offers', key: 'offers', color: '#34ba64' },
  { label: 'Rejected', key: 'rejected', color: '#da4c4a' }
]


export const Dashboard = () => {

  const [appliedData, setAppliedData] = useState({
    company: '',
    role: '',
    status: ''
  });

  const [activeFilter, setActiveFilter] = useState('All')
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { applications, refreshApplications, applicationCountComputed, filterByStatus } = useApplicationContext()
  const filteredApplications = activeFilter === 'All' ? applications : applications.filter(app => app.status === activeFilter.toLowerCase())
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userId');

    const response = await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...appliedData,
        appliedDate: new Date().toISOString(),
        userID: userID,
        updatedAt: null,
      })


    })

    const data = await response.json();
    console.log(data)
    await refreshApplications()
  }

  const handleDialog = () => {
    setIsDialogOpen(true);
  }





  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', p: { xs: 2, md: 4 } }}>
      <Toolbar></Toolbar>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {statsRow.map(({ label, key, color }) => (
          <Card key={key} sx={{
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
              {applicationCountComputed[key as keyof ApplicationCountByStatus]}

            </Typography>
          </Card>
        ))}
      </Box>


      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, my: 3 }}>
        <Stack direction="column" sx={{ gap: 1 }}>
          <Button sx={{ color: 'black', width: 'full', background: 'white' }} onClick={() => handleDialog()}>Add application</Button>
          {filteredApplications.map(app =>
            <Paper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2, textAlign: 'left' }}>
              <Stack>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', mb: '2px' }}>{app.company}</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.secondary' }}>{app.role}</Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{app.appliedDate}</Typography>
              </Stack>

              <Box>
                <Chip label={app.status} sx={{ fontSize: '12px' }} />
                <IconButton size='small' ><DeleteIcon></DeleteIcon></IconButton>
                <IconButton size='small' ><LinkIcon /></IconButton>


                <IconButton></IconButton>

              </Box>
            </Paper>)}
        </Stack>

        <Stack direction="column" sx={{ gap: 1, textAlign: 'left' }}>
          <Typography>Filter by status</Typography>
          {filterByStatus.map(({ label, action }) =>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography component='button' onClick={() => setActiveFilter(label)} sx={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'text.primary' }}>{label}</Typography>
              <Chip label={label === 'All' ? applications.length : applicationCountComputed[label.toLocaleLowerCase() as keyof ApplicationCountByStatus]}></Chip>
            </Stack>
          )}
        </Stack>

      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
          <TextField label="company" value={appliedData.company} type="text" fullWidth margin="normal" onChange={(e) => setAppliedData((prev) => ({ ...prev, company: e.target.value }))} />
          <TextField label="Role" value={appliedData.role} type="text" fullWidth margin="normal" onChange={(e) => setAppliedData((prev) => ({ ...prev, role: e.target.value }))} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Status"
              value={appliedData.status}
              onChange={(e) => setAppliedData((prev) => ({ ...prev, status: e.target.value as string }))}
            >
              <MenuItem value={'applied'} >Applied</MenuItem>
              <MenuItem value={'interview'} >Interviewing</MenuItem>
              <MenuItem value={'offer'} >Offer</MenuItem>
              <MenuItem value={'rejected'} >Rejected</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type='submit' onClick={()=> setIsDialogOpen(false)}>
            Submit
          </Button>

        </Box>
      </Dialog>










    </Box>
  )
}


