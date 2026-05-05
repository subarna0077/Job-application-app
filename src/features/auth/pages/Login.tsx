import { Box, TextField, Button, Link } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { useAuthStore } from '../../user/stores'

const loginFormSchema = z.object({
  email: z.string().min(5, 'Email is required'),
  password: z.string().min(8, 'Password should be atleast 8 characters.')
})

export type LoginFormType = z.infer<typeof loginFormSchema>

export const Login = () => {
  const navigate = useNavigate()
  const {mutate:login, error} = useLogin()

  

  const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)
  

  const { register, reset, handleSubmit, formState: {
    errors
  } } = useForm({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmit =  (data: LoginFormType) => {
    login(data)
    reset()
  }

  useEffect(()=>{
    if(isAuthenticated) navigate('/dashboard')
  },[isAuthenticated])

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Email" error={!!errors.email} helperText={errors.email?.message} type="email" fullWidth margin="normal" {...register('email')} />
      <TextField label="Password" error={!!errors.password} helperText={errors.password?.message} type="password" fullWidth margin="normal"  {...register('password')} />
      <Button variant="contained" type="submit" sx={{ mr: 2 }}>
        Login
      </Button>
      {error ? <p>{error?.message}</p>: ''}
      <Link href="/register" sx={{ color: 'text.primary', textDecoration: 'none' }}>Don't have an account? Register </Link>
    </Box>
  )
}


