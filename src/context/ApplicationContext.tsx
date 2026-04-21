import { createContext, useContext, useState, useEffect } from 'react'
import type { JobApplication, filterStatusType, ApplicationContextType,ApplicationCountByStatus } from '../types/types'

const applicationCount = {
    applied: 0,
    interview: 0,
    offers: 0,
    rejected: 0
}

const ApplicationContext = createContext<ApplicationContextType | null>(null)
export const ApplicationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [applications, setApplications] = useState<JobApplication[]>([])
    console.log(applications)

    const applicationCountComputed = applications.reduce((acc: ApplicationCountByStatus, app) => {
        return {
            ...acc,
            [app.status]: acc[app.status as keyof ApplicationCountByStatus] + 1
        }

    }, {...applicationCount})

    const filterByStatus: filterStatusType[] = [
        {
            label: 'All',
            action: ()=> applications.filter(app=> app), 
        },
        {
            label: 'Applied',
            action: ()=> applications.filter(app=> app.status=== 'applied'),
        },
        {
            label: 'Interview',
            action: ()=> applications.filter(app=> app.status === 'interview')
        },
        {
            label: 'Offers',
            action: ()=> applications.filter(app=> app.status === "offer")
        },
        {
            label: 'Rejected',
            action: ()=> applications.filter(app=> app.status === 'rejected')
        }
    ]


    const userID = localStorage.getItem('userId')
    const fetchUserApplication = async () => {
        const response = await fetch(`http://localhost:3001/posts?userID=${userID}`)
        const data = await response.json()
        setApplications(data)
        /*
        Here the api has the fresh set of the data on every submit. so we dont need to store the prev values
         */
        //setApplications(data)   
    }

    useEffect(() => {
        fetchUserApplication()

    }, [])


    return (
        <ApplicationContext.Provider value={{ applications, refreshApplications: fetchUserApplication, applicationCountComputed, filterByStatus }}>
            {children}
        </ApplicationContext.Provider>
    )
}

export const useApplicationContext = () => {
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error('Context must be within the provider')
    }
    return context;
}


