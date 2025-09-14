import { AddPatientInput, UpdatePatientInput } from "./patient.validation";
import { prisma } from "../../config/db"

export const getNewPatientCode = async (clinicId: string) => {
    const clinicData = await prisma.clinic.update({
        where: { id: clinicId },
        data: { lastSeq: { increment: 1 } },
        select: { lastSeq: true, patientIdPrefix: true }
    })
    return clinicData.patientIdPrefix + clinicData.lastSeq;
}

export const addPatient = async (patientInputData: AddPatientInput, clinicId: string) => {
    const { name, gender, phoneNo, address } = patientInputData;
    const customId = await getNewPatientCode(clinicId);
    const patientData = await prisma.patient.create({
        data: {
            name, gender, phoneNo, address, customId, clinicId
        }
    })

    return patientData
}

export const getAllPateints = async (clinicId: string) => {
    const patientData = await prisma.patient.findMany({
        where: {
            clinicId
        }
    })
    return patientData
}

export const updatePatient = async (patientInputData: UpdatePatientInput, clinicId: string) => {
    const { id, name, gender, address, phoneNo } = patientInputData;
    const patientData = await prisma.patient.update({
        where: {
            id, clinicId
        }, data: {
            name, gender, address, phoneNo
        }
    })
    return patientData
}

export const deletePatient = async (id:string,clinicId:string)=>{
    await prisma.patient.delete({
        where:{
            id,
            clinicId
        }
    })
    return;
}