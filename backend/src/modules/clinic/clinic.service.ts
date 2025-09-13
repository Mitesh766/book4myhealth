import { prisma } from "../../config/db"
import { AddClinicInput } from "./clinic.validations"
export const addClinic = async ({ name, address, email, phoneNo, patientIdPrefix }: AddClinicInput) => {
    const clinicData = await prisma.clinic.create({
        data: {
            name, address, phoneNo, patientIdPrefix, email
        },
        select: {
            id: true,
            name: true,
            address: true,
            phoneNo: true,
            patientIdPrefix: true,
            email:true,
        }
    })
    return clinicData
}