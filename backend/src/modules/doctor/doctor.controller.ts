import asyncHandler from "../../utils/asyncHandler";
import { addDoctorSchema, updateDoctorAvailabilitySchema, updateDoctorProfileSchema } from "./doctor.validations";
import * as doctorService from "./doctor.service"




export const addDoctor = asyncHandler(async (req, res) => {
    const doctorInputData = addDoctorSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;

    const doctorData = await doctorService.addDoctor(doctorInputData, clinicId)
    return res.status(201).json({
        success: true,
        message: "Doctor data added successfully",
        doctorData
    });
})

export const updateDoctorProfile = asyncHandler(async (req, res) => {
    const doctorInputData = updateDoctorProfileSchema.parse(req.body);
    console.log(doctorInputData)
    const clinicId = req.customUser?.clinicId!;
    console.log(clinicId)
    const updatedDoctorData = await doctorService.updateDoctorProfile(doctorInputData, clinicId)
    console.log(updatedDoctorData)
    return res.json({
        success: true,
        message: "Doctor details updated successfully",
        updatedDoctorData
    })
})


export const updateDoctorAvailability = asyncHandler(async (req, res) => {
    const doctorInputData = updateDoctorAvailabilitySchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const updatedDoctorData = await doctorService.updateDoctorAvailability(doctorInputData, clinicId);
    return res.status(200).json({
        success: true,
        message: "Doctor data updated successfully",
        updatedDoctorData
    })
})



export const getAllClinicDoctors = asyncHandler(async (req, res) => {
    const clinicId = req.customUser?.clinicId!;
    const doctorData = await doctorService.getAllClinicDoctors(clinicId);
    return res.status(200).json({
        success: true,
        doctorData
    })
})

export const deleteDoctor = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const clinicId = req.customUser?.clinicId!;
    await doctorService.deleteDoctor(userId, clinicId)

    return res.status(200).json({
        success: true,
        message: "Doctor data deleted successfully"
    })

})