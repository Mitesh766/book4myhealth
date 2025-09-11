import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import authRouter from "./modules/auth/auth.routes"
const app = express()

app.use(cors({
    origin: ["http://localhost:5173", "https://api.book4myhealth.info"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Hello")
})


export default app