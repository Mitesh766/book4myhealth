import express from "express"
import { addDoctor, deleteDoctor, getAllClinicDoctors, getAllDoctorsCurrentStatus, updateDoctorAvailability, updateDoctorProfile } from "./doctor.controller"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"

const router = express.Router()

router.route("/")
    .post(authenticateUser, authoriseRole(['admin']), addDoctor)
    .patch(authenticateUser, authoriseRole(["admin"]), updateDoctorProfile)
    .get(authenticateUser, authoriseRole(["admin"]), getAllClinicDoctors)

router.route(`/:userId`).delete(authenticateUser,authoriseRole(["admin"]),deleteDoctor)
router.route("/availability").patch(authenticateUser, authoriseRole(["admin"]), updateDoctorAvailability)


router.route("/current-status").get(getAllDoctorsCurrentStatus);
export default router