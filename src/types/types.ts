import {z} from 'zod'

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export const schema = z.object({
    company: z.string().min(5, 'Company is required'),
    role: z.string().min(5, 'Please enter the specific role'),
    status: z.enum(['saved','applied', 'interview', 'offer', 'rejected'], {
        error: 'Please select atleast one status'
    })

})

export type FormInputType = z.infer<typeof schema>


export interface JobApplication {
    id: string;
    userId: string;
    company: string;
    role: string;
    appliedDate: string;
    status: 'applied' |'interview' | 'offer' | 'rejected' | 'saved'
    updatedAt: string | null;
}

export interface ApplicationCountByStatus {
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
}


export interface ApplicationContextType {
  applications: JobApplication[]
  // UI state
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>

  activeFilter: string
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>

  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>

}
export const registerSchema = z.object({
  name: z.string().min(5, 'Name is required'),
  email: z.string().min(5, 'Email is required'),
  password: z.string().min(8, 'Password is required')

})

export type RegisterDataType = z.infer<typeof registerSchema>



