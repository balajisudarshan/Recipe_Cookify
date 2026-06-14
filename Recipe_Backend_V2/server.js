require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")
const authRoutes = require("./routes/auth.route")
const uploadRoute = require("./routes/upload.route")
const profileRoute = require("./routes/profile.route")
const recipeRoute = require("./routes/recipe.route")
const commentRoute = require("./routes/comment.route")
const { errorHandler } = require("./middleware/error.middleware")

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoute)
app.use("/api/profile", profileRoute)
app.use("/api/recipe", recipeRoute)
app.use("/api/comment", commentRoute)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})