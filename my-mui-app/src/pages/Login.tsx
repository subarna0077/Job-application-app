import { Box, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useUserContext } from '../context/UserContext'

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {login} = useUserContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    login(formData)

 
  }

  return (

    <Box component="form" onSubmit={(e) => handleSubmit(e)}>
      <TextField label="Email" type="email" fullWidth margin="normal" onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
      <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} />
      <Button variant="contained" type="submit">
        Login
      </Button>
    </Box>

  )
}


