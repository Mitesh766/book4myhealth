import * as z from "zod"
const doctorIdField = z.uuid({ error: "Invalid Doctor Id" })
const appointmentIdField = z.uuid({ error: "Invalid Appointment Id" })

const customPatientIdField = z.string({ error: "Invalid Id" })
    .trim()
    .min(2, { error: "Patient ID prefix must be 2-8 characters" })
    .max(8, { error: "Patient ID prefix must be 2-8 characters" })
    .regex(/^[A-Za-z0-9]+$/, { error: "Patient ID prefix must contain only letters and digits (no spaces or symbols)" })
    .transform(s => s.toUpperCase());



const startTimeField = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { error: "Invalid date time format" }).transform((val) => val ? new Date(val + ":00+05:30") : undefined)

const endTimeField = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { error: "Invalid date time format" }).transform((val) => val ? new Date(val + ":00+05:30") : undefined)

const visitTypeField = z.enum(["Appointment", "Emergency", "WalkIn"], { error: "Appointment type can be Appointment or Emergency or WalkIn" })

const appointmentStatusField = z.enum(["SCHEDULED", "CHECKED_IN"], { error: "Status can be either SCHEDULED or CHECKED_IN" })

export const createAppointmentSchema = z.object({
    doctorId: doctorIdField,
    patientCustomId: customPatientIdField,
    visitType: visitTypeField,
    status: appointmentStatusField,
    start: startTimeField.optional(),
    end: endTimeField.optional(),
}).superRefine((data, ctx) => {
    if (data.visitType === "Appointment") {
        if (!data.start) {
            ctx.addIssue({
                path: ["start"],
                message: "Start time is required for Appointment",
                code: "custom"
            })
        }
        if (!data.end) {
            ctx.addIssue({
                path: ["end"],
                message: "End time is required for Appointment",
                code: "custom"
            })
        }

        if(data.start && data.start < new Date()){
            ctx.addIssue({
                path:["start"],
                message:"Start time must be greater then todays",
                code:"custom"
            })
        }
        if (data.start && data.end) {
            if (data.start >= data.end) {
                ctx.addIssue({
                    path: ["end"],
                    message: "End time must be after start time",
                    code: "custom"
                })
            }
        }
    }
    else {
        data.start = undefined
        data.end = undefined
    }
})

export const getAllAppointmentsDoctorWiseSchema = z.object({
    doctorId: doctorIdField,
})

export const appointmentIdSchema = z.object({
    appointmentId: appointmentIdField,
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>