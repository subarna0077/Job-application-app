import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import {useState} from 'react'

export const Dashboard = () => {

  const [appliedData, setAppliedData] = useState({
    company: '',
    role: '',
    status: '' 
  });


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
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
      })


    })

    const data = await response.json();
    console.log(data)
  }




  return (
    <Box sx={{bgcolor: 'white', padding: 2, marginTop: 2}}>
      This is dashboard

      <Box component="form" onSubmit={(e)=>handleSubmit(e)}>
        <TextField label="company" value={appliedData.company} type="text" fullWidth margin="normal" onChange={(e)=> setAppliedData((prev)=> ({...prev, company: e.target.value}))}/>
        <TextField label="Role" value={appliedData.role} type="text" fullWidth margin="normal" onChange={(e)=> setAppliedData((prev)=> ({...prev, role: e.target.value}))}/>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            value={appliedData.status}
            onChange={(e)=> setAppliedData((prev)=> ({...prev, status: e.target.value as string}))}
          >
            <MenuItem value={'applied'} >Applied</MenuItem>
            <MenuItem value={'interview'} >Interviewing</MenuItem>
            <MenuItem value={'offer'} >Offer</MenuItem>
            <MenuItem value={'rejected'} >Rejected</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" type='submit'>
          Submit
        </Button>

      </Box>

    </Box>
  )
}


