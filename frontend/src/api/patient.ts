import axiosClient from "./axiosClient"

export const getAllPateints = async () => {
    const response = await axiosClient.get("/patient")
    return response.data.patientData;
}

export const addPatient = async (patientData: any) => {
    const response = await axiosClient.post("/patient", patientData);
    return response.data.patientData
}   

export const updatePatient = async (patientData: any) => {
    const response = await axiosClient.patch("/patient", patientData);
    return response.data.patientData
}

export const deletePatient = async (id: string) => {
    const response = await axiosClient.delete(`/patient/${id}`);
    return response.data;
}