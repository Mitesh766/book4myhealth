import { CreateAppointmentInput } from "./appointment.validation";
import { prisma } from "../../config/db"
import { AppError } from "../../utils/AppError";
import moment from "moment-timezone";
import * as doctorService from "../doctor/doctor.service"
export const createAppointment = async (appointmentInputData: CreateAppointmentInput, clinicId: string) => {
    const { patientCustomId, doctorId, status, start, end, visitType } = appointmentInputData;
    if (visitType === "Appointment") {
        const isAppointmentClash = await prisma.appointment.findFirst({
            where: {
                AND: [{ start: { lte: end } }, { end: { gte: start } }, { doctorId }]
            }
        })
        if (isAppointmentClash) {
            throw new AppError("There is a clash in appointment timings", 409)
        }
    }
    else {
        start: undefined;
        end: undefined
    }

    const appointmentStatus = visitType === "Appointment" ? "SCHEDULED" : "CHECKED_IN"
    let checkInTime = null;

    if (appointmentStatus === "CHECKED_IN") {
        checkInTime = new Date();
    }

    const pdata = await prisma.patient.findFirst({ where: { customId: patientCustomId }, select: { id: true } })
    if (!pdata) {
        throw new AppError("Invalid Patient Id", 403)
    }
    const appointmentData = await prisma.appointment.create({
        data: {
            patientId: pdata.id,
            clinicId,
            start, end,
            visitType,
            status, doctorId,
            checkInTime
        }
    })

    return appointmentData
}

export const getAllAppointments = async (clinicId: string) => {
    const appointmentData = await prisma.appointment.findMany({
        where: { clinicId, OR: [{ status: "CHECKED_IN" }, { status: "WITH_DOCTOR" }] },
        orderBy: {
            checkInTime: "asc"
        },
        select: {
            id: true,
            visitType: true,
            status: true,
            checkInTime: true,
            doctor: {
                select: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    specialisation: true,
                }
            }, patient: {
                select: {
                    name: true
                }
            }
        }
    })

    const visitTypeOrder = { Emergency: 1, Appointment: 2, WalkIn: 3 };


    const finalAppointments = appointmentData
        .map(appt => ({
            id: appt.id,
            visitType: appt.visitType,
            status: appt.status,
            checkInTime: moment.utc(appt.checkInTime).tz("Asia/Kolkata").format("DD-MM,HH:mm"),
            doctorName: appt.doctor?.user?.name || null,
            specialisation: appt.doctor?.specialisation || null,
            patientName: appt.patient?.name || null,
        }))
        .sort((a, b) => visitTypeOrder[a.visitType] - visitTypeOrder[b.visitType]);


    return finalAppointments;
}


export const getAllAppointmentsDoctorWise = async (doctorId: string, clinicId: string) => {
    const appointmentData = await prisma.appointment.findMany({
        where: { doctorId, clinicId },
        orderBy: {
            checkInTime: "asc"
        },
        select: {
            id: true,
            visitType: true,
            status: true,
            checkInTime: true,
            start: true,
            completeTime: true,
            cancelTime: true,
            patient: {
                select: {
                    name: true,
                    id: true,
                    phoneNo: true,
                }
            }
        }
    })

    const visitTypeOrder = { Emergency: 1, Appointment: 2, WalkIn: 3 };
    const formatIST = (date: Date | null) => {
        if (!date) return null;
        return moment.utc(date).tz("Asia/Kolkata").format("DD-MM,HH:mm");
    };

    const finalAppointments = appointmentData
        ?.map(appt => ({
            id: appt.id,
            visitType: appt.visitType,
            status: appt.status,
            checkInTime: formatIST(appt.checkInTime),
            patientId: appt.patient?.id,
            patientName: appt.patient?.name || null,
            patientPhoneNo: appt.patient?.phoneNo || null,
            start: formatIST(appt.start),
            completeTime: formatIST(appt.completeTime),
            cancelTime: formatIST(appt.cancelTime),
        }))
        .sort((a, b) => visitTypeOrder[a.visitType] - visitTypeOrder[b.visitType]);

    const doctorDetails = await doctorService.getGivenDoctorDetails(doctorId, clinicId)
    return { doctorDetails, finalAppointments };
}


export const setAppointmentCancelled = async (appointmentId: string, clinicId: string) => {
    const appointmentData = await prisma.appointment.update({
        where: { id: appointmentId, clinicId },
        data: { cancelTime: new Date(), status: "CANCELLED" },
        select: {
            id: true,
            visitType: true,
            status: true,
            checkInTime: true,
            start: true,
            completeTime: true,
            cancelTime: true,
            patient: {
                select: {
                    name: true,
                    id: true,
                    phoneNo: true,
                }
            }
        }
    })

    const formatIST = (date: Date | null) => {
        if (!date) return null;
        return moment.utc(date).tz("Asia/Kolkata").format("DD-MM,HH:mm");
    };

    const modifiedAppointment = {
        id: appointmentData.id,
        visitType: appointmentData.visitType,
        status: appointmentData.status,
        checkInTime: formatIST(appointmentData.checkInTime),
        patientId: appointmentData.patient?.id,
        patientName: appointmentData.patient?.name || null,
        patientPhoneNo: appointmentData.patient?.phoneNo || null,
        start: formatIST(appointmentData.start),
        completeTime: formatIST(appointmentData.completeTime),
        cancelTime: formatIST(appointmentData.cancelTime),
    }

    return modifiedAppointment

}

export const setAppointmentCompleted = async (appointmentId: string, clinicId: string) => {
    const appointmentData = await prisma.appointment.update({
        where: { id: appointmentId, clinicId },
        data: { completeTime: new Date(), status: "COMPLETED" },
        select: {
            id: true,
            visitType: true,
            status: true,
            checkInTime: true,
            start: true,
            completeTime: true,
            cancelTime: true,
            patient: {
                select: {
                    name: true,
                    id: true,
                    phoneNo: true,
                }
            }
        }
    })

    const formatIST = (date: Date | null) => {
        if (!date) return null;
        return moment.utc(date).tz("Asia/Kolkata").format("DD-MM,HH:mm");
    };

    const modifiedAppointment = {
        id: appointmentData.id,
        visitType: appointmentData.visitType,
        status: appointmentData.status,
        checkInTime: formatIST(appointmentData.checkInTime),
        patientId: appointmentData.patient?.id,
        patientName: appointmentData.patient?.name || null,
        patientPhoneNo: appointmentData.patient?.phoneNo || null,
        start: formatIST(appointmentData.start),
        completeTime: formatIST(appointmentData.completeTime),
        cancelTime: formatIST(appointmentData.cancelTime),
    }

    return modifiedAppointment

}

export const setAppointmentCheckedIn = async (appointmentId: string, clinicId: string) => {
    const appointmentData = await prisma.appointment.update({
        where: { id: appointmentId, clinicId },
        data: { checkInTime: new Date(), status: "CHECKED_IN" },
        select: {
            id: true,
            visitType: true,
            status: true,
            checkInTime: true,
            start: true,
            completeTime: true,
            cancelTime: true,
            patient: {
                select: {
                    name: true,
                    id: true,
                    phoneNo: true,
                }
            }
        }
    })

    const formatIST = (date: Date | null) => {
        if (!date) return null;
        return moment.utc(date).tz("Asia/Kolkata").format("DD-MM,HH:mm");
    };

    const modifiedAppointment = {
        id: appointmentData.id,
        visitType: appointmentData.visitType,
        status: appointmentData.status,
        checkInTime: formatIST(appointmentData.checkInTime),
        patientId: appointmentData.patient?.id,
        patientName: appointmentData.patient?.name || null,
        patientPhoneNo: appointmentData.patient?.phoneNo || null,
        start: formatIST(appointmentData.start),
        completeTime: formatIST(appointmentData.completeTime),
        cancelTime: formatIST(appointmentData.cancelTime),
    }

    return modifiedAppointment

}