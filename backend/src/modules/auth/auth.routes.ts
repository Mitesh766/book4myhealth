import express from "express"
import { checkAuth, login,logout } from "./auth.controller"
import { authenticateUser } from "./auth.middleware"

const router  = express.Router()


router.route("/checkAuth").get(authenticateUser,checkAuth)
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router