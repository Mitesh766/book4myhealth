import { AddDoctorInput, UpdateDoctorAvailabilityInput, UpdateDoctorProfileInput } from "./doctor.validations";
import { prisma } from "../../config/db"
import { hashPassword } from "../user/user.utils";
import { isDoctorAvailable } from "./doctor.utils";


export const addDoctor = async (doctorInputData: AddDoctorInput, clinicId: string) => {
    const { name, email, phoneNo, specialisation, avgTimePerPatient, gender } = doctorInputData;

    const hashedPassword = await hashPassword("Trial@123");
    const doctorData = await prisma.doctor.create({
        data: {
            gender,
            specialisation,
            availability: {},
            avgTimePerPatient,
            user: {
                create: {
                    name,
                    phoneNo,
                    email,
                    password: hashedPassword,
                    role: "doctor",
                    clinicId
                },
            },
        },
        select: {
            userId: true,
            gender: true,
            specialisation: true,
            isActive: true,
            avgTimePerPatient: true,
            availability: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNo: true,
                }
            }
        },


    });

    return { ...doctorData, ...doctorData.user, user: undefined }
}

export const updateDoctorProfile = async (doctorInputData: UpdateDoctorProfileInput, clinicId: string) => {
    const { userId, name, email, phoneNo, specialisation, avgTimePerPatient, gender, isActive } = doctorInputData;
    const updatedDoctorData = await prisma.doctor.update({
        where: {
            userId,
            user: {
                clinicId
            }
        },
        data: {
            specialisation,
            avgTimePerPatient,
            gender,
            isActive,
            user: {
                update: {
                    name, email, phoneNo
                }
            },

        }, select: {
            userId: true,
            gender: true,
            specialisation: true,
            isActive: true,
            avgTimePerPatient: true,
            availability: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNo: true,
                }
            }
        }
    })

    return { ...updatedDoctorData, user: undefined, ...updatedDoctorData.user };
}


export const updateDoctorAvailability = async (doctorInputData: UpdateDoctorAvailabilityInput, clinicId: string) => {
    const { userId, availability } = doctorInputData
    const updatedDoctorData = await prisma.doctor.update({
        where: {
            userId,
            user: {
                clinicId
            }
        },
        data: {
            availability
        },
        select: {
            userId: true,
            gender: true,
            specialisation: true,
            isActive: true,
            avgTimePerPatient: true,
            availability: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNo: true,
                }
            }
        }
    })

    return { ...updatedDoctorData, user: undefined, ...updatedDoctorData.user };
}



export const getAllClinicDoctors = async (clinicId: string) => {
    const data = await prisma.doctor.findMany({
        where: {
            user: {
                clinicId
            }
        },
        select: {
            userId: true,
            gender: true,
            specialisation: true,
            isActive: true,
            avgTimePerPatient: true,
            availability: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNo: true,
                }
            }
        }
    })
    const doctorData = data.map((doctor) => ({
        ...doctor,
        ...doctor.user,
        user: undefined
    }))

    return doctorData
}

export const deleteDoctor = async (userId: string, clinicId: string) => {
    await prisma.user.delete({
        where: { id: userId, clinicId }
    })

    return
}

export const getAllDoctorsCurrentStatus = async (clinicId: string) => {
    const data = await prisma.doctor.findMany({
        where: {
            user: {
                clinicId,
            },
            isActive: true
        },
        select: {
            userId: true,
            specialisation: true,
            availability: true,
            user: {
                select: {
                    name: true,
                }
            }
        }
    })
    

    const doctorData = data.map((doctor) => {
        const doctorStatus = isDoctorAvailable(doctor.availability as Record<"string", { start: string, end: string }>)
        return ({ ...doctor, name: doctor.user.name, user: undefined, availability: undefined, available: doctorStatus, doctorId: doctor.userId, userId: undefined })
    })

    return doctorData;
}

export const getGivenDoctorDetails = async (doctorId: string, clinicId: string) => {
    const doctorDetails = await prisma.doctor.findFirst({
        where: {
            user: {
                clinicId,
            },
            userId: doctorId,
        },
        select: {
            userId: true,
            specialisation: true,
            availability: true,
            user: {
                select: {
                    name: true,
                }
            }
        }
    })

    if(!doctorDetails) return {}
    const doctorStatus = isDoctorAvailable(doctorDetails.availability as Record<"string", { start: string, end: string }>)
    return ({ ...doctorDetails, name: doctorDetails.user.name, user: undefined, availability: undefined, available: doctorStatus, doctorId: doctorDetails.userId, userId: undefined })

}