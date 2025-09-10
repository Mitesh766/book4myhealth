import express from "express"
import "dotenv/config"
const app = express()

app.get("/", (req, res) => {
    res.status(200).send("Hi there from the desk of book4myhealth")
})

app.listen(process.env.PORT || 3000)