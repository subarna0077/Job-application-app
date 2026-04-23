import type { LoginFormType } from "../pages/Login"
import { API_BASE_URL } from "../config/api"
import type { RegisterDataType } from "../types/types";

export const login = async (FormData: LoginFormType) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(FormData)
    })
    const data = await response.json()
    return data
    console.log(data)

};

export const register = async (formData: RegisterDataType) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    return response;
};