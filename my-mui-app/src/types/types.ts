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
    status: z.enum(['applied', 'interview', 'offer', 'rejected'], {
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
    status: 'applied' |'interview' | 'offer' | 'rejected'
    updatedAt: string;
}


export interface filterStatusType {
    label: string;
    action: ()=> void;
}

export interface ApplicationCountByStatus {
    applied: number;
    interview: number;
    offers: number;
    rejected: number;
}

export interface ApplicationContextType {
    applications: JobApplication[];
    refreshApplications: () => Promise<void>;
    applicationCountComputed: ApplicationCountByStatus;
    filterByStatus: filterStatusType[]
}

