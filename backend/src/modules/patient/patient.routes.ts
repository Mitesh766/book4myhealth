import express from "express"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware";
import { addPatient, deletePatient, getAllPatients, updatePatient } from "./patient.controller";

const router = express.Router();

router.use(authenticateUser, authoriseRole(["admin"]))

router.route("/")
    .post(addPatient)
    .get(getAllPatients)
    .patch(updatePatient)

router.route("/:id").delete(deletePatient)


export default router