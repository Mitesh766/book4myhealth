import axiosClient from "./axiosClient"

export const login = async (data: { email: string, password: string }) => {
    const response = await axiosClient.post("/auth/login", data)
    return response.data
}

export const verifyAuth = async()=>{
    const response = await axiosClient.get("/auth/checkAuth");
    return response.data 
}