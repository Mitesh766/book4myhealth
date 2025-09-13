import asyncHandler from "../../utils/asyncHandler";
import { addClinicSchema } from "./clinic.validations";
import * as clinicService from "./clinic.service"

export const addClinic = asyncHandler(async (req, res) => {
    const clinicInputData = addClinicSchema.parse(req.body);
    const clinicData = await clinicService.addClinic(clinicInputData);

    return res.status(201).json({
        success: true,
        message: "Clinic data added successfully",
        clinicData
    })
})


