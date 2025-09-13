import * as z from "zod"

const nameField = z.string({ error: "Invalid name" }).trim().min(2, { error: "Name must be 2-50 charcters long" }).max(50, { error: "Name must be 2-50 charcters long" }).regex(/^[A-Za-z0-9 ]+$/, "Clinic name must contain only letters and digits (no spaces or symbols)")

const emailField = z.email({ error: "Invalid email address" })

const passwordField = z
    .string({ error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8-15 characters long" })
    .min(8, { error: "Password must be 8-15 characters long" })
    .max(15, { error: "Password must be 8-15 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z0-9@$%*?&]{8,}$/, { error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8 characters long" })

const phoneNumberField = z
    .string({ error: "Invalid phone number" })
    .min(8, { error: "Phone number must contain 8-15 digits" })
    .max(15, { error: "Phone number must contain 8-15 digits" })
    .regex(/^\+?\d+$/, { error: "Phone number must contain only digits" })

const roleField = z.enum(["admin", "superAdmin", "staff", "doctor"], { error: "Role can be any one of admin, superAdmin, staff, doctor" })

const clinicIdField = z.uuid({
    error: "Invalid clinic id"
})

const IdField = z.uuid({error:"Please enter a valid ID"})
export const addAdminSchema = z.object({
    name: nameField,
    email: emailField,
    password: passwordField,
    phoneNo: phoneNumberField,
    clinicId: clinicIdField
}, { error: "Please fill all the details" })

export const addStaffMemberSchema = z.object({
    name: nameField,
    email: emailField,
    password: passwordField,
    phoneNo: phoneNumberField,
})


export const updateStaffMemberSchema = z.object({
    id : IdField,
    name: nameField,
    email: emailField,
    password: passwordField,
    phoneNo: phoneNumberField,
})

export const deleteStaffMemberSchema = z.object({
    id:IdField
})

export type AddAdminInput = z.infer<typeof addAdminSchema>;
export type AddStaffMemberInput = z.infer<typeof addStaffMemberSchema>;
export type UpdateStaffMemberInput = z.infer<typeof updateStaffMemberSchema>;
export type DeleteStaffMemberInput = z.infer<typeof deleteStaffMemberSchema>;