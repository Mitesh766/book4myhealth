import * as z from "zod"
const emailField = z.email({ error: "Please enter a valid email address" });

const passwordField = z
    .string({ error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8-15 characters long" })
    .min(8, { error: "Password must be 8-15 characters long" })
    .max(15, { error: "Password must be 8-15 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z0-9@$%*?&]{8,}$/, { error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8 characters long" })

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
}) 

export type LoginDataInput = z.infer<typeof loginSchema>;