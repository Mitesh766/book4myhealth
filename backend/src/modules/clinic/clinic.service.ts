import { prisma } from "../../config/db"
export const addClinic = async (name: string, address: string, phoneNo: string, patientIdPrefix: string) => {
    const clinicData = await prisma.clinic.create({
        data: {
            name, address, phoneNo, patientIdPrefix
        },
        select: {
            id:true,
            name: true,
            address: true,
            phoneNo: true,
            patientIdPrefix: true
        }
    })
    return clinicData
}