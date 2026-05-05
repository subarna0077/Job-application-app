import { Box, TextField, Button, Link, Typography, Alert, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../../types/types'
import type { RegisterDataType } from '../../../types/types'
import { useRegister } from '../../../hooks/useRegister'

export const Register = () => {
  const { mutate: register, error, isPending } = useRegister()

  const {
    handleSubmit,
    register: formRegister,
    reset,
    formState: { errors },
  } = useForm<RegisterDataType>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterDataType) => {
    register(data)
    reset()
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 400, mx: 'auto', mt: 8, px: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{fontWeight: 600}} gutterBottom>
          Create an account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start tracking your job applications today
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error.message ?? 'Something went wrong. Please try again.'}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Full name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
          {...formRegister('name')}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
          {...formRegister('email')}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
          {...formRegister('password')}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          disabled={isPending}
          sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          {isPending ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          Already have an account?{' '}
          <Link
            href="/login"
            underline="hover"
            sx={{ color: 'primary.main', fontWeight: 500 }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}