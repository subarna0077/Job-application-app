import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApplicationContext } from '../context/ApplicationContext'
import { schema } from '../types/types'
import type { FormInputType } from '../types/types'


const JobApplicationForm = () => {

    const { handleSubmit, register, reset, control, formState: {
        errors
    } } = useForm({ resolver: zodResolver(schema) })

    const { refreshApplications } = useApplicationContext()


    const onSubmit = async (data: FormInputType) => {
        const token = localStorage.getItem('token');
        const userID = localStorage.getItem('userId');

        await fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                appliedDate: new Date().toISOString(),
                userID: userID,
                updatedAt: null,
            })
        })

        await refreshApplications()
        reset();
    }


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
