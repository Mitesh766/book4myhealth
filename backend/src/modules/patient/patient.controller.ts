import asyncHandler from "../../utils/asyncHandler";
import { addPatientSchema, getPatientByCustomIdSchema, getPatientByNameSchema, getPatientByPhoneNumberSchema, updatePatientSchema } from "./patient.validation";
import * as patientService from "./patient.service"

export const addPatient = asyncHandler(async (req, res) => {
    const patientInputData = addPatientSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const patientData = await patientService.addPatient(patientInputData, clinicId);
    return res.status(201).json({
        success: true,
        message: "Patient data added successfully",
        patientData
    })
})

export const getAllPatients = asyncHandler(async (req, res) => {
    const clinicId = req.customUser?.clinicId!;
    const patientData = await patientService.getAllPateints(clinicId);
    return res.status(200).json({
        success: true,
        patientData
    })
})

export const updatePatient = asyncHandler(async (req, res) => {
    const patientInputData = updatePatientSchema.parse(req.body);
    const cliniId = req.customUser?.clinicId!;
    const patientData = await patientService.updatePatient(patientInputData, cliniId);

    return res.status(200).json({
        success: true,
        message: "Patient data updated successfully",
        patientData
    })
})

export const deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clinicId = req.customUser?.clinicId!;
    await patientService.deletePatient(id, clinicId);
    return res.status(200).json({
        success: true,
        message: "Patient data deleted successfully"
    })
})

export const getPatientByName = asyncHandler(async (req, res) => {
    const {  name } = getPatientByNameSchema.parse({id:req.params.id, name:req.query.name });
    const clinicId = req.customUser?.clinicId!;
    const patientData = await patientService.getPatientByName( name, clinicId);
    return res.status(200).json({
        success: true,
        patientData
    })
})

export const getPatientByCustomCode = asyncHandler(async (req,res)=>{
    const {customId} = getPatientByCustomIdSchema.parse({customId:req.query.customId});
    const clinicId = req.customUser?.clinicId!;
    const patientData = await patientService.getPatientByCustomId(customId,clinicId);
    return res.status(200).json({
        success:true,
        patientData
    })
})

export const getPatientByPhoneNumber = asyncHandler(async (req,res)=>{
    const {phoneNo}= getPatientByPhoneNumberSchema.parse({phoneNo:req.query.phoneNo});
    const clinicId = req.customUser?.clinicId!;
    const patientData = await patientService.getPatientByPhoneNumber(phoneNo,clinicId);
    return res.status(200).json({
        success:true,
        patientData
    })
})