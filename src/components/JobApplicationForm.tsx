import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '../types/types'
import type { FormInputType, JobApplication } from '../types/types'
import { useCreatePosts } from '../hooks/useCreatePosts'
import { useEditPost } from '../hooks/useEditPost'
import { useEffect } from 'react'

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interviewing' },
  { value: 'offer', label: 'Offer received' },
  { value: 'rejected', label: 'Rejected' },
] as const

interface JobApplicationFormProps {
  initialData?: JobApplication
  onSuccess?: () => void
}

const JobApplicationForm = ({ initialData, onSuccess }: JobApplicationFormProps) => {
  const { mutate: editPost, isPending: isEditing, error: editError } = useEditPost()
  const { mutate: createPost, isPending: isCreating, error: createError } = useCreatePosts()

  const isEditing_ = !!initialData
  const isPending = isEditing || isCreating
  const error = editError || createError

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (initialData) reset(initialData)
  }, [initialData, reset])

  const onSubmit = (data: FormInputType) => {
    if (initialData) {
      editPost(
        { id: initialData.id, data },
        { onSuccess }
      )
    } else {
      createPost(data, { onSuccess })
    }
    reset()
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing_ ? 'Edit application' : 'Add application'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditing_
            ? 'Update the details for this application'
            : 'Manually track a job you want to apply to or have applied for'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error.message ?? 'Something went wrong. Please try again.'}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          {...register('company')}
          label="Company"
          fullWidth
          error={!!errors.company}
          helperText={errors.company?.message}
          placeholder="e.g. Stripe, Vercel, Airbnb"
        />

        <TextField
          {...register('role')}
          label="Role"
          fullWidth
          error={!!errors.role}
          helperText={errors.role?.message}
          placeholder="e.g. Frontend Engineer"
        />

        <FormControl fullWidth error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Status">
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.status && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.status.message}
            </Typography>
          )}
        </FormControl>

        <Button
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          disabled={isPending}
          sx={{ mt: 1, py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : isEditing_ ? (
            'Save changes'
          ) : (
            'Add application'
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default JobApplicationForm