import express from "express"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"
import { createAppointment, getAllAppointments, getAllAppointmentsDoctorWise, setAppointmentCancelled, setAppointmentCheckedIn, setAppointmentCompleted } from "./appointment.controller"
const router = express.Router()

router.use(authenticateUser, authoriseRole(["admin"]))
router.route("/").post(createAppointment).get(getAllAppointments)
router.route("/:doctorId").get(getAllAppointmentsDoctorWise)
router.route("/completed").patch(setAppointmentCompleted)
router.route("/cancelled").patch(setAppointmentCancelled)
router.route("/checked-in").patch(setAppointmentCheckedIn)
export default router

