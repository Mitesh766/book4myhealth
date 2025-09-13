import express from "express"
import { addAdmin, addStaffMember, deleteStaffMember, getAllStaffMembers, updateStaffMember } from "./user.controller"
import { authenticateUser, authoriseRole } from "../auth/auth.middleware"

const router = express.Router()

router.route("/admin")
    .post(authenticateUser, authoriseRole(["superAdmin"]), addAdmin)

router.route("/staff")
    .post(authenticateUser, authoriseRole(["admin"]), addStaffMember)
    .get(authenticateUser, authoriseRole(["admin"]), getAllStaffMembers)
    .patch(authenticateUser, authoriseRole(["admin", "staff"]), updateStaffMember)

router.route("/staff/:id").delete(authenticateUser, authoriseRole(["admin"]), deleteStaffMember)

export default router