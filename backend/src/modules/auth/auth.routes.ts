import express from "express"
import { checkAuth, login, logout } from "./auth.controller"
import { authenticateUser, authoriseRole } from "./auth.middleware"

const router = express.Router()


router.route("/checkAuth").get(authenticateUser, authoriseRole(["admin"]), checkAuth)
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router