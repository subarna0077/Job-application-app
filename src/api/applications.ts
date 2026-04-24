import type { FormInputType } from "../types/types"

export const createApplication = async (userData: FormInputType) => {
    const userId = localStorage.getItem('userId')
    const response = await fetch(`http://localhost:3001/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...userData,
            userID: userId,
            appliedDate: new Date().toISOString(),
            updatedAt: null
        })
    })

}

export const removeApplication = async (id: string) => {
    await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
    })
}

export const fetchApplication = async (userID: string) => {
    const response = await fetch(`http://localhost:3001/posts?userID=${userID}`)
    const data = await response.json()
    return data;
}