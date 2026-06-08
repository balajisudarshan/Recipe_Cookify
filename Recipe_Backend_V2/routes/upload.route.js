const express = require('express')
const upload = require('../middleware/upload')
const cloudinary = require('../config/cloudinary')
const {avatarUpload,recipeUpload} = require('../controller/upload.controller')
const router = express.Router()

router.post("/avatar",upload.single("image"),avatarUpload)
router.post("/recipe",upload.single("image"),recipeUpload)

module.exports = router;