import * as z from "zod"

const clinicIdField = z.uuid({ error: "Invalid Id" })

const phoneNumberField = z
    .string({ error: "Invalid phone number" })
    .min(8, { error: "Phone number must contain 8-15 digits" })
    .max(15, { error: "Phone number must contain 8-15 digits" })
    .regex(/^\+?\d+$/, { error: "Phone number must contain only digits" })

const emailField = z.email({ error: "Please enter a valid email address" });

const nameField = z.string({ error: "Invalid name" }).trim().min(2, { error: "Name must be 2-50 charcters long" }).max(50, { error: "Name must be 2-50 charcters long" })

const isActiveField = z.boolean({ error: "Invalid Active Status!! Can be True or False" })
const averageTimePerPatientField = z.number({ error: "Please enter a number (1-60) in mins" }).min(1, { error: "Avg time can be between 1-60 (in minutes)" }).max(60, { error: "Avg time can be between 1-60 (in minutes)" })

const genderField = z.enum(["Male", "Female", "Other"])

const dailyAvailabilitySchema = z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM"),
    end: z.string().regex(/^\d{2}:\d{2}$/, "End time must be HH:MM")
}).refine(({start,end})=>start>=end,{error:"Start time must be earlier then end time"});

const userIdField = z.uuid({ error: "Invalid doctor Id" })

const availabilitySchema = z.object({
    monday: dailyAvailabilitySchema.optional(),
    tuesday: dailyAvailabilitySchema.optional(),
    wednesday: dailyAvailabilitySchema.optional(),
    thursday: dailyAvailabilitySchema.optional(),
    friday: dailyAvailabilitySchema.optional(),
    saturday: dailyAvailabilitySchema.optional(),
    sunday: dailyAvailabilitySchema.optional()
});


const specialisationField = z.string({ error: "Invalid name" }).trim().min(2, { error: "Specialisation must be 2-50 charcters long" }).max(50, { error: "Specialisation must be 2-50 charcters long" }).regex(/^[A-Za-z0-9 ]+$/, "Specialisation name must contain only letters and digits (no spaces or symbols)")

const passwordField = z
    .string({ error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8-15 characters long" })
    .min(8, { error: "Password must be 8-15 characters long" })
    .max(15, { error: "Password must be 8-15 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z0-9@$%*?&]{8,}$/, { error: "Password must contain atleast 1 uppercase character, 1 lowercase character , 1 digit , 1 special character (@,$,*,%,&,?) and must be in total 8 characters long" })




export const addDoctorSchema = z.object({
    name: nameField,
    email: emailField,
    phoneNo: phoneNumberField,
    specialisation: specialisationField,
    avgTimePerPatient: averageTimePerPatientField,
    gender: genderField
})

export const updateDoctorProfileSchema = z.object({
    userId: userIdField,
    name: nameField,
    email: emailField,
    phoneNo: phoneNumberField,
    specialisation: specialisationField,
    avgTimePerPatient: averageTimePerPatientField,
    gender: genderField,
    isActive: isActiveField
})

export const updateDoctorAvailabilitySchema = z.object({
    userId: userIdField,
    availability: availabilitySchema,
})

export type AddDoctorInput = z.infer<typeof addDoctorSchema>;
export type UpdateDoctorProfileInput = z.infer<typeof updateDoctorProfileSchema>
export type UpdateDoctorAvailabilityInput = z.infer<typeof updateDoctorAvailabilitySchema>