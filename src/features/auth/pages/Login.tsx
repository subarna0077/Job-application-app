import { Box, TextField, Button, Link, Typography, Alert, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { useAuthStore } from '../stores'

const loginFormSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormType = z.infer<typeof loginFormSchema>

export const Login = () => {
  const navigate = useNavigate()
  const { mutate: login, error, isPending } = useLogin()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = (data: LoginFormType) => {
    login(data)
    reset()
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 400, mx: 'auto', mt: 8, px: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to continue tracking your applications
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error.message ?? 'Invalid email or password. Please try again.'}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
          {...register('password')}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          disabled={isPending}
          sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          {isPending ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          Don't have an account?{' '}
          <Link
            href="/register"
            underline="hover"
            sx={{ color: 'primary.main', fontWeight: 500 }}
          >
            Create one
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}