const express = require('express')
const upload = require('../middleware/upload')
const checkAuth = require('../middleware/checkAuth')
const { avatarUpload, recipeUpload } = require('../controller/upload.controller')
const router = express.Router()

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload an avatar image
 *     tags:
 *       - Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.post("/avatar", upload.single("image"), checkAuth, avatarUpload)

/**
 * @swagger
 * /api/upload/recipe:
 *   post:
 *     summary: Upload a recipe image
 *     tags:
 *       - Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Recipe image uploaded successfully
 */
router.post("/recipe", upload.single("image"), checkAuth, recipeUpload)

module.exports = router;