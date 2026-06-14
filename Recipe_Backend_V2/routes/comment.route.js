const router = require('express').Router()
const checkAuth = require('../middleware/checkAuth')
const { addComment, getComments, deleteComment } = require('../controller/comment.controller')

/**
 * @swagger
 * /api/comment/{id}:
 *   post:
 *     summary: Add a comment to a recipe
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: This is a great recipe!
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
router.post('/:id', checkAuth, addComment)

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Get comments for a recipe
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 */
router.get('/:id', getComments)

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/:id', checkAuth, deleteComment)

module.exports = router