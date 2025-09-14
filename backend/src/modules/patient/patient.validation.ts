import * as z from "zod"

const phoneNumberField = z
    .string({ error: "Invalid phone number" })
    .min(8, { error: "Phone number must contain 8-15 digits" })
    .max(15, { error: "Phone number must contain 8-15 digits" })
    .regex(/^\+?\d+$/, { error: "Phone number must contain only digits" })

const nameField = z.string({ error: "Invalid name" }).trim().min(2, { error: "Name must be 2-50 charcters long" }).max(50, { error: "Name must be 2-50 charcters long" })

const addressField = z.string({ error: "Invalid address" }).trim().min(5, { error: "Address must be 5-200 charcters long" }).max(200, { error: "Name must be 5-200 charcters long" }).regex(/^[A-Za-z0-9-, ]+$/, "Clinic address must contain only letters,digits,comma and underscore ")

const genderField = z.enum(["Male", "Female", "Other"], { error: "Gender can be Male , Female or Other" })

const patientIdField = z.uuid({ error: "Invalid Patient Id" })

export const addPatientSchema = z.object({
    name: nameField,
    phoneNo: phoneNumberField,
    address: addressField,
    gender: genderField,
})

export const updatePatientSchema = z.object({
    id: patientIdField,
    name: nameField,
    phoneNo: phoneNumberField,
    address: addressField,
    gender: genderField,
})


export type AddPatientInput = z.infer<typeof addPatientSchema>

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>