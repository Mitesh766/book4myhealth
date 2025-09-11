import express from "express"
import { addAdmin } from "./user.controller"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"

const router = express.Router()

router.route("/").post(authenticateUser, authoriseRole("superAdmin"), addAdmin)

export default router