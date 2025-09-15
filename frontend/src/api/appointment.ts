import axiosClient from "./axiosClient"

export const getAllAppointments = async () => {
    const response = await axiosClient.get("/appointments");
    // console.log(re)
    return response.data.appointmentData
}

export const getAllDoctorsCurrentStatus = async () => {
    const response = await axiosClient.get("/doctor/current-status");
    return response.data;
}

export const getAllAppointmentsDoctorWise = async (doctorId: string) => {
    const response = await axiosClient.get(`/appointments/${doctorId}`)
    console.log(response)
    return response.data.appointmentData
}

export const setAppointmentCancelled = async (appointmentId: string) => {
    const response = await axiosClient.patch(`/appointments/cancelled`, { appointmentId });
    return response.data.updatedAppointment;
}
export const setAppointmentCompleted = async (appointmentId: string) => {
    const response = await axiosClient.patch(`/appointments/completed`, { appointmentId });
    return response.data.updatedAppointment;
}
export const setAppointmentCheckedIn = async (appointmentId: string) => {
    const response = await axiosClient.patch(`/appointments/checked-in`, { appointmentId });
    return response.data.updatedAppointment;
}

export const createAppointment = async (data: any) => {
    if (data.visitType === "Emergency" || data.visitType === "WalkIn") {
        data = { ...data, start: undefined, end: undefined }
    }
    const response = await axiosClient.post("/appointments", data)
    return response.data;
}
