require("dotenv").config()
const express = require("express")
const { sequelize } = require("./models")
const userRoutes = require("./routes/user.routes")
const authRoutes = require("./routes/auth.routes")
const parkingRoutes = require("./routes/parking.routes")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", authRoutes)
app.use("/", userRoutes)
app.use("/", parkingRoutes)

app.get("/", (req, res) => {
  res.send("Hi")
})

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log(`Server running on port ${port}`)
  await sequelize.sync()
  console.log("Database synced")
})
