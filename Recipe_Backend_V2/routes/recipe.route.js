const router = require('express').Router()
const {createRecipe,getAllRecipes,getSingleRecipe, getMyRecipes} = require('../controller/recipe.controller')
const checkAuth= require('../middleware/checkAuth')
const upload = require('../middleware/upload')

router.post('/create',checkAuth,upload.single("image"),createRecipe);
router.get('/',checkAuth,getAllRecipes);
router.get('/my',checkAuth,getMyRecipes)
router.get('/:id',checkAuth,getSingleRecipe)

module.exports = router