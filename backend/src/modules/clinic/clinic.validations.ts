import * as z from "zod"


const nameField = z.string({error:"Invalid name"}).trim().min(2, { error: "Name must be 2-50 charcters long" }).max(50, { error: "Name must be 2-50 charcters long" }).regex(/^[A-Za-z0-9 ]+$/, "Clinic name must contain only letters and digits (no spaces or symbols)")

const patientIdPrefixField = z.string({error:"Invalid Id"})
    .trim()
    .min(2, { error: "Patient ID prefix must be at least 2 characters" })
    .max(8, { error: "Patient ID prefix must be at most 8 characters" })
    .regex(/^[A-Za-z0-9]+$/, { error: "Patient ID prefix must contain only letters and digits (no spaces or symbols)" })
    .transform(s => s.toUpperCase());

const addressField = z.string({error:"Invalid address"}).trim().min(5, { error: "Name must be 5-200 charcters long" }).max(200, { error: "Name must be 5-200 charcters long" }).regex(/^[A-Za-z0-9 ]+$/, "Clinic name must contain only letters and digits (no spaces or symbols)")

const phoneNumberField = z
    .string({ error: "Invalid phone number" })
    .min(8, { error: "Phone number must contain 8-15 digits" })
    .max(15, { error: "Phone number must contain 8-15 digits" })
    .regex(/^\+?\d+$/, { error: "Phone number must contain only digits" })



export const addClinicValidation = z.object({
    name: nameField,
    address: addressField,
    patientIdPrefix: patientIdPrefixField,
    phoneNo: phoneNumberField,
})