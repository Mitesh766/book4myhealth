import asyncHandler from "../../utils/asyncHandler";
import { addClinicValidation } from "./clinic.validations";
import * as clinicService from "./clinic.service"

export const addClinic = asyncHandler(async (req, res) => {
    const { name, address, phoneNo, patientIdPrefix } = addClinicValidation.parse(req.body);
    const clinicData = await clinicService.addClinic(name, address, phoneNo, patientIdPrefix);

    return res.status(201).json({
        success: true,
        message: "Clinic data added successfully",
        clinicData
    })
})