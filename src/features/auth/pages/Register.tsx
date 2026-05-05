import {Box, TextField, Button, Link} from '@mui/material'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { registerSchema } from '../../../types/types'
import type { RegisterDataType } from '../../../types/types'
import { useRegister } from '../../../hooks/useRegister'
export const Register = () => {

  const {mutate: register} = useRegister()

  const {handleSubmit, register: formRegister, reset, formState:{
    errors
  } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: RegisterDataType)=>{
    register(data)
    reset()
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{color: 'white'}}>
      <TextField error={!!errors.name} helperText={errors.name?.message} label="Name" sx={{color: 'white'}} fullWidth margin="normal" {...formRegister('name')} />
      <TextField error={!!errors.email} helperText={errors.email?.message} label="Email" type="email" fullWidth margin="normal" {...formRegister('email')} />
      <TextField error={!!errors.password} helperText={errors.password?.message} label="Password" type="password" fullWidth margin="normal" {...formRegister('password')} />
      <Button variant="contained" type="submit" sx={{mr:2}}>
        Register
      </Button>
      <Link href="/login" sx={{color: 'text.primary', textDecoration: 'none'}}>Already have an account? Login </Link>
    </Box>
    
  )
}


