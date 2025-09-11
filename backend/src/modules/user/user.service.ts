import { prisma } from "../../config/db"
import { UserRole } from "@prisma/client"
import { AddAdminInput } from "./user.validation"
import bcrypt from "bcryptjs"
export const findUserByIdAndRole = async (id: string, role: UserRole) => {

    const userData = await prisma?.user.findFirst({
        where: {
            id, role
        }
    })
    return userData
}


export const addAdmin = async ({ name, email, phoneNo, password, role, clinicId }: AddAdminInput) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminData = await prisma.user.create({
        data: {
            name, email, phoneNo, password: hashedPassword, role, clinicId
        }, select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
            clinicId: true
        }
    })
    return adminData

}

