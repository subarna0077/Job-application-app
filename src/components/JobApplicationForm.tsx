import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '../types/types'
import type { FormInputType } from '../types/types'
import { useCreatePosts } from '../hooks/useCreatePosts'


const JobApplicationForm = () => {

    const { handleSubmit, register, reset, control, formState: {
        errors
    } } = useForm({ resolver: zodResolver(schema) })

    const {mutate: createPost, isPending, error} = useCreatePosts()

    const onSubmit = (data: FormInputType) => { 
        createPost(data) 
        reset();
        
    }

    console.log(isPending, error)


    return (

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, width: 400 }}>
            {/* Company */}
            <TextField
                {...register("company")}
                label="Company"
                fullWidth
                margin="normal"
                error={!!errors.company}
                helperText={errors.company?.message}
            />

            {/* Role */}
            <TextField
                {...register("role")}
                label="Role"
                fullWidth
                margin="normal"
                error={!!errors.role}
                helperText={errors.role?.message}
            />

            {/* Status */}
            <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel>Status</InputLabel>

                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select {...field} label="Status">
                            <MenuItem value="applied">Applied</MenuItem>
                            <MenuItem value="interview">Interviewing</MenuItem>
                            <MenuItem value="offer">Offer</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    )}
                />

                {errors.status && (
                    <Typography variant="caption" color="error">
                        {errors.status.message}
                    </Typography>
                )}
            </FormControl>

            {/* Submit */}
            <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
            >
                Submit
            </Button>

        </Box>

    )
}

export default JobApplicationForm
