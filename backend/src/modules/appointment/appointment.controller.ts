import asyncHandler from "../../utils/asyncHandler";
import { appointmentIdSchema, createAppointmentSchema, getAllAppointmentsDoctorWiseSchema } from "./appointment.validation";
import * as appointmentService from "./appointment.service"

export const createAppointment = asyncHandler(async (req, res) => {
    const appointmentInputData = createAppointmentSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const appointmentData = await appointmentService.createAppointment(appointmentInputData, clinicId);
    res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        appointmentData
    })
})

export const getAllAppointments = asyncHandler(async (req, res) => {
    const clinicId = req.customUser?.clinicId!;
    const appointmentData = await appointmentService.getAllAppointments(clinicId);
    return res.status(200).json({
        success: true,
        appointmentData
    })
})

export const getAllAppointmentsDoctorWise = asyncHandler(async (req, res) => {
    const { doctorId } = getAllAppointmentsDoctorWiseSchema.parse({ doctorId: req.params.doctorId });
    const clinicId = req.customUser?.clinicId!;
    const appointmentData = await appointmentService.getAllAppointmentsDoctorWise(doctorId, clinicId);
    return res.status(200).json({
        success: true,
        appointmentData
    })
})
export const setAppointmentCompleted = asyncHandler(async (req, res) => {
    const { appointmentId } = appointmentIdSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const updatedAppointment = await appointmentService.setAppointmentCompleted(appointmentId, clinicId);
    return res.status(200).json({
        success: true,
        message: "Appointment has been successfully marked as completed",
        updatedAppointment
    })
})

export const setAppointmentCancelled = asyncHandler(async (req, res) => {
    const { appointmentId } = appointmentIdSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const updatedAppointment = await appointmentService.setAppointmentCancelled(appointmentId, clinicId);
    return res.status(200).json({
        success: true,
        message: "Appointment has been successfully cancelled.",
        updatedAppointment
    })
})

export const setAppointmentCheckedIn = asyncHandler(async (req, res) => {
    const { appointmentId } = appointmentIdSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const updatedAppointment = await appointmentService.setAppointmentCheckedIn(appointmentId, clinicId);
    return res.status(200).json({
        success: true,
        message: "Appointment has been successfully checked in.",
        updatedAppointment
    })
})