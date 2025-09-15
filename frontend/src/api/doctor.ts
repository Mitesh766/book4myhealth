import axiosClient from "./axiosClient";

export const getAllDoctors = async () => {
    const response = await axiosClient.get("/doctor");
    return response.data.doctorData;
}

export const addDoctor = async (doctorData: any) => {
    const response = await axiosClient.post("/doctor", doctorData);
    return response.data.doctorData;
}

export const updateDoctorDetails = async (doctorData: any) => {
    const response = await axiosClient.patch("/doctor", doctorData);
    return response.data.updatedDoctorData;
}

export const updateDoctorAvailability = async (doctorData: any) => {
    const response = await axiosClient.patch("/doctor/availability", doctorData);
    return response.data.updatedDoctorData;
}


export const deleteDoctor = async (doctorId: string) => {
    const response = await axiosClient.delete(`/doctor/${doctorId}`)
    return response.data
}

export const getAllDoctorsCurrentStatus = async () => {
    const response = await axiosClient.get("/doctor/current-status")
    console.log(response)
    return response.data.doctorStatusData
}