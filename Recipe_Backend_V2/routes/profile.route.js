const checkAuth = require('../middleware/checkAuth')
const { updateProfile, getProfile, getAllUsers, followUser, unfollowUser } = require('../controller/profile.controller')
const router = require('express').Router()
const upload = require('../middleware/upload')

/**
 * @swagger
 * /api/profile/all-users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Profile
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 */
router.get('/all-users', checkAuth, getAllUsers)

/**
 * @swagger
 * /api/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 */
router.get('/:id', getProfile)

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - Profile
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/update', checkAuth, upload.single("avatar"), updateProfile)

/**
 * @swagger
 * /api/profile/follow/{id}:
 *   put:
 *     summary: Follow a user
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow
 *     responses:
 *       200:
 *         description: Successfully followed user
 */
router.put('/follow/:id', checkAuth, followUser)

/**
 * @swagger
 * /api/profile/unfollow/{id}:
 *   put:
 *     summary: Unfollow a user
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 */
router.put('/unfollow/:id', checkAuth, unfollowUser)

module.exports = router