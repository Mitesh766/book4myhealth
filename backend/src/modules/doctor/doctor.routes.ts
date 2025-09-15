import express from "express"
import { addDoctor, deleteDoctor, getAllClinicDoctors, getAllDoctorsCurrentStatus, updateDoctorAvailability, updateDoctorProfile } from "./doctor.controller"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"

const router = express.Router()

router.use(authenticateUser, authoriseRole(['admin']))

router.route("/")
    .post(addDoctor)
    .patch( updateDoctorProfile)
    .get(getAllClinicDoctors)

router.route(`/:userId`).delete(deleteDoctor)
router.route("/availability").patch(updateDoctorAvailability)


router.route("/current-status").get(getAllDoctorsCurrentStatus);
export default router