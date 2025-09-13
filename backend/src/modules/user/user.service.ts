import { prisma } from "../../config/db"
import { UserRole } from "@prisma/client"
import { AddAdminInput, AddStaffMemberInput, DeleteStaffMemberInput, UpdateStaffMemberInput } from "./user.validation"
import { hashPassword } from "./user.utils"
export const findUserByIdAndRole = async (id: string, role: UserRole) => {

    const userData = await prisma?.user.findFirst({
        where: {
            id, role
        }
    })
    return userData
}


export const addAdmin = async ({ name, email, phoneNo, password, clinicId }: AddAdminInput) => {
    const hashedPassword = await hashPassword(password)
    const adminData = await prisma.user.create({
        data: {
            name, email, phoneNo, password: hashedPassword, role: "admin", clinicId
        }, select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
        }
    })
    return adminData
}


export const addStaffMember = async (staffMemberInputData: AddStaffMemberInput, clinicId: string) => {
    const { name, email, phoneNo, password } = staffMemberInputData;
    const hashedPassword = await hashPassword(password)
    const staffMemberData = await prisma.user.create({
        data: {
            name, email, phoneNo, password: hashedPassword, role: "staff", clinicId
        },
        select: {
            id: true,
            name: true,
            phoneNo: true,
            email: true
        }
    })
    return staffMemberData;
}


export const getAllStaffMembers = async (clinicId: string) => {
    const staffData = await prisma.user.findMany({
        where: {
            clinicId,
            role: "staff"
        },
        select: {
            id: true, name: true, email: true, phoneNo: true
        }
    })
    return staffData;
}

export const updateStaffMember = async (staffMemberInputData: UpdateStaffMemberInput, clinicId: string) => {
    const { id, name, email, phoneNo, password } = staffMemberInputData;
    const hashedPassword = await hashPassword(password)
    const staffMemberData = await prisma.user.update({
        data: {
            name, email, phoneNo, password: hashedPassword, clinicId
        },
        where: {
            id,
            clinicId
        },
        select: {
            id: true,
            name: true,
            phoneNo: true,
            email: true
        }
    })
    return staffMemberData;
}


export const deleteStaffMember = async (staffMemberInputData: DeleteStaffMemberInput, clinicId: string) => {
    const { id } = staffMemberInputData;
    await prisma.user.delete({
        where: {
            id,
            clinicId
        }
    })
    return;
}