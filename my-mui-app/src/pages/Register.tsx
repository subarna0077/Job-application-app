import {Box, TextField, Button} from '@mui/material'
import {useState} from 'react'
import { useUserContext } from '../context/UserContext'
export const Register = () => {
  const {register} = useUserContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    register(formData)

  }





  return (

    <Box component="form" onSubmit={(e)=>handleSubmit(e)} sx={{color: 'white'}}>
      <TextField label="Name" sx={{color: 'white'}} fullWidth margin="normal" onChange={(e)=> setFormData(prev=> ({...prev, name: e.target.value}))} />
      <TextField label="Email" type="email" fullWidth margin="normal" onChange={(e)=> setFormData(prev=> ({...prev, email: e.target.value}))} />
      <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e)=> setFormData(prev=> ({...prev, password: e.target.value}))} />
      <Button variant="contained" type="submit">
        Register
      </Button>
    </Box>
    
  )
}


