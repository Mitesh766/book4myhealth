import express from "express"
import { addClinic } from "./clinic.controller"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"

const router = express.Router()


router.route("/").post(authenticateUser, authoriseRole("superAdmin"), addClinic)

export default router