import type { StaffMemberData } from "../types/user";
import axiosClient from "./axiosClient"

export const getAllStaffMembers = async()=>{
    const response = await axiosClient.get("/user/staff")
    return response.data;
}


export const updateStaffMemberData = async(data:StaffMemberData)=>{
    const response = await axiosClient.patch("/user/staff",data);
    return response.data
}