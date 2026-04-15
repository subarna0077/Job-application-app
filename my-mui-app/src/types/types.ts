export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface JobApplication {
    id: string;
    userId: string;
    company: string;
    role: string;
    appliedDate: string;
    status: 'applied' |'interview' | 'offer' | 'rejected'
    updatedAt: string;
}