import * as z from "zod"


const nameField = z.string({ error: "Invalid name" }).trim().min(2, { error: "Name must be 2-50 charcters long" }).max(50, { error: "Name must be 2-50 charcters long" }).regex(/^[A-Za-z0-9 ]+$/, "Clinic name must contain only letters and digits (no spaces or symbols)")

const patientIdPrefixField = z.string({ error: "Invalid Id" })
    .trim()
    .min(2, { error: "Patient ID prefix must be 2-8 characters" })
    .max(8, { error: "Patient ID prefix must be 2-8 characters" })
    .regex(/^[A-Za-z0-9]+$/, { error: "Patient ID prefix must contain only letters and digits (no spaces or symbols)" })
    .transform(s => s.toUpperCase());


const addressField = z.string({ error: "Invalid address" }).trim().min(5, { error: "Address must be 5-200 charcters long" }).max(200, { error: "Name must be 5-200 charcters long" }).regex(/^[A-Za-z0-9-, ]+$/, "Clinic address must contain only letters,digits,comma and underscore ")


const phoneNumberField = z
    .string({ error: "Invalid phone number" })
    .min(8, { error: "Phone number must contain 8-15 digits" })
    .max(15, { error: "Phone number must contain 8-15 digits" })
    .regex(/^\+?\d+$/, { error: "Phone number must contain only digits" })



const emailField = z.email({ error: "Please enter a valid email address" });


export const addClinicSchema = z.object({
    name: nameField,
    address: addressField,
    patientIdPrefix: patientIdPrefixField,
    phoneNo: phoneNumberField,
    email: emailField
})


export type AddClinicInput = z.infer<typeof addClinicSchema>;