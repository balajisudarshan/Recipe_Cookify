const router = require('express').Router()
const { createRecipe, getAllRecipes, getSingleRecipe, getMyRecipes, getUserRecipes, updateRecipe, deleteRecipe, likeRecipe, saveRecipe, getLikedRecipes, getSavedRecipes } = require('../controller/recipe.controller')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/upload')

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
 *                 example: "[\"Tomato\", \"Cheese\"]"
 *               steps:
 *                 type: string
 *                 example: "[\"Bake\", \"Eat\"]"
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
 *         name: query
 *         schema:
 *           type: string
 *         description: Search by title or description
 *     responses:
 *       200:
 *         description: Successfully retrieved all recipes
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
 *                 example: "[\"Chicken\", \"Spices\"]"
 *               steps:
 *                 type: string
 *                 example: "[\"Marinate\", \"Grill\"]"
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

module.exports = router