const router = require('express').Router()
const { createRecipe, getAllRecipes, getSingleRecipe, getMyRecipes, getUserRecipes, updateRecipe, deleteRecipe, likeRecipe, saveRecipe, getLikedRecipes, getSavedRecipes, getRecentRecipes, rateRecipe, reportRecipe, getReportedRecipes } = require('../controller/recipe.controller')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/upload')
const checkAdmin = require('../middleware/checkAdmin')
/**
 * @swagger
 * /api/recipe/create:
 *   post:
 *     summary: Create a new recipe
 *     tags:
 *       - Recipe
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 example: "Tomato, Cheese"
 *               steps:
 *                 type: string
 *                 example: "Bake, Eat"
 *               cuisine:
 *                 type: string
 *                 example: "Italian"
 *               dietaryType:
 *                 type: string
 *                 example: "VEGETARIAN"
 *               mealType:
 *                 type: string
 *                 example: "DINNER"
 *               course:
 *                 type: string
 *                 example: "MAIN_COURSE"
 *     responses:
 *       200:
 *         description: Recipe created successfully
 */
router.post('/create', checkAuth, upload.single("image"), createRecipe);


/**
* @swagger
* /api/recipe:
*   get:
*     summary: Get all recipes
*     tags:
*       - Recipe
*     parameters:
*       - in: query
*         name: page
*         schema:
*           type: integer
*           default: 1
*         description: Page number for pagination
*       - in: query
*         name: dietaryType
*         schema:
*           type: string
*         description: Filter by dietary type (e.g. VEGETARIAN, NON_VEG)
*       - in: query
*         name: mealType
*         schema:
*           type: string
*         description: Filter by meal type (e.g. BREAKFAST, DINNER)
*       - in: query
*         name: course
*         schema:
*           type: string
*         description: Filter by course type (e.g. APPETIZER, MAIN_COURSE)
*       - in: query
*         name: cuisine
*         schema:
*           type: string
*         description: Filter by cuisine type (e.g. INDIAN, ITALIAN)
*       - in: query
*         name: query
*         schema:
*           type: string
*         description: Search by title or description
*     responses:
*       200:
*         description: Successfully retrieved all recipes
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 message:
*                   type: string
*                   example: Recipes fetched successfully
*                 page:
*                   type: integer
*                   example: 2
*                 limit:
*                   type: integer
*                   example: 10
*                 totalRecipes:
*                   type: integer
*                   example: 97
*                 totalPages:
*                   type: integer
*                   example: 10
*                 hasNextPage:
*                   type: boolean
*                   example: true
*                 hasPreviousPage:
*                   type: boolean
*                   example: true
*                 recipes:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Recipe'
*/
router.get('/', checkAuth, getAllRecipes);

/**
 * @swagger
 * /api/recipe/my:
 *   get:
 *     summary: Get my recipes
 *     tags:
 *       - Recipe
 *     responses:
 *       200:
 *         description: Successfully retrieved my recipes
 */
router.get('/my', checkAuth, getMyRecipes)

/**
 * @swagger
 * /api/recipe/liked:
 *   get:
 *     summary: Get recipes liked by the current user
 *     tags:
 *       - Recipe
 *     responses:
 *       200:
 *         description: Successfully retrieved liked recipes
 */
router.get('/liked', checkAuth, getLikedRecipes)

/**
 * @swagger
 * /api/recipe/saved:
 *   get:
 *     summary: Get recipes saved by the current user
 *     tags:
 *       - Recipe
 *     responses:
 *       200:
 *         description: Successfully retrieved saved recipes
 */
router.get('/saved', checkAuth, getSavedRecipes)

/**
 * @swagger
 * /api/recipe/recent:
 *   get:
 *     summary: Get recent recipes
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: query
 *         name: dietaryType
 *         schema:
 *           type: string
 *         description: Filter by dietary type (e.g. VEGETARIAN, NON_VEG)
 *     responses:
 *       200:
 *         description: Successfully retrieved recent recipes
 */
router.get('/recent', checkAuth, getRecentRecipes);

/**
 * @swagger
 * /api/recipe/user/{id}:
 *   get:
 *     summary: Get recipes by a specific user
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user's recipes
 */
router.get('/user/:id', checkAuth, getUserRecipes)

/**
 * @swagger
 * /api/recipe/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Successfully retrieved recipe
 */
router.get('/:id', checkAuth, getSingleRecipe)


/**
 * @swagger
 * /api/recipe/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Chicken Tikka"
 *               description:
 *                 type: string
 *                 example: "Spicy and delicious"
 *               ingredients:
 *                 type: string
 *                 example: "Chicken, Spices"
 *               steps:
 *                 type: string
 *                 example: "Marinate, Grill"
 *               cuisine:
 *                 type: string
 *                 example: "Indian"
 *               dietaryType:
 *                 type: string
 *                 example: "NON_VEG"
 *               mealType:
 *                 type: string
 *                 example: "DINNER"
 *               course:
 *                 type: string
 *                 example: "MAIN_COURSE"
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 */
router.put("/:id", checkAuth, updateRecipe);

/**
 * @swagger
 * /api/recipe/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 */
router.delete("/:id", checkAuth, deleteRecipe);

/**
 * @swagger
 * /api/recipe/{recipeId}/report:
 *   post:
 *     summary: Report a recipe
 *     tags:
 *       - Recipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 enum:
 *                   - INAPPROPRIATE
 *                   - SPAM
 *                   - COPYRIGHT
 *                   - MISLEADING
 *                   - DANGEROUS
 *                   - OTHER
 *                 example: MISLEADING
 *                 description: Reason for reporting the recipe
 *               description:
 *                 type: string
 *                 example: The recipe contains incorrect cooking instructions.
 *                 description: Additional details about the report
 *     responses:
 *       201:
 *         description: Recipe reported successfully
 *       400:
 *         description: Invalid report data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe already reported by this user
 *       500:
 *         description: Internal server error
 */
router.post("/:recipeId/report", checkAuth, reportRecipe)

/**
 * @swagger
 * /api/recipe/reports/all:
 *   get:
 *     summary: Get all reported recipes
 *     tags:
 *       - Recipe
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reported recipes retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/reports/all", checkAuth, checkAdmin, getReportedRecipes)
/**
 * @swagger
 * /api/recipe/like/{id}:
 *   put:
 *     summary: Like or unlike a recipe
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe liked/unliked successfully
 */
router.put("/like/:id", checkAuth, likeRecipe);

/**
 * @swagger
 * /api/recipe/save/{id}:
 *   put:
 *     summary: Save or unsave a recipe
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe saved/unsaved successfully
 */
router.put("/save/:id", checkAuth, saveRecipe);

/**
 * @swagger
 * /api/recipe/{recipeId}/rate:
 *   post:
 *     summary: Rate or update rating for a recipe
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating value between 1 and 5
 *     responses:
 *       200:
 *         description: Recipe rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recipe rated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       example: 4.7
 *                     ratingsCount:
 *                       type: integer
 *                       example: 126
 *                     userRating:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid rating
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
router.post("/:recipeId/rate", checkAuth, rateRecipe);

// router.post("/:recipeId/rate",checkAuth,rateRecipe)

// router.get("/:recipeId/rating",)
module.exports = router