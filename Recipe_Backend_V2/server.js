require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")
const authRoutes = require("./routes/auth.route")
const uploadRoute = require("./routes/upload.route")
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/upload",uploadRoute)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})