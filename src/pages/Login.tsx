import { Box, TextField, Button, Link } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserContext } from '../context/UserContext'

const loginFormSchema = z.object({
  email: z.string().min(5, 'Email is required'),
  password: z.string().min(8, 'Password should be atleast 8 characters.')
})

export type LoginFormType = z.infer<typeof loginFormSchema>

export const Login = () => {
  const {loginUser} = useUserContext()

  const { register, reset, handleSubmit, formState: {
    errors
  } } = useForm({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmit =  (data: LoginFormType) => {
    loginUser(data)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Email" error={!!errors.email} helperText={errors.email?.message} type="email" fullWidth margin="normal" {...register('email')} />
      <TextField label="Password" error={!!errors.password} helperText={errors.password?.message} type="password" fullWidth margin="normal"  {...register('password')} />
      <Button variant="contained" type="submit" sx={{ mr: 2 }}>
        Login
      </Button>
      <Link href="/register" sx={{ color: 'text.primary', textDecoration: 'none' }}>Don't have an account? Register </Link>
    </Box>
  )
}


