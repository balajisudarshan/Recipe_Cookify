const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");


const createRecipe = async (req, res, next) => {
  try {
    const authorId = req.user.id;

    const { title, description, cuisine, dietaryType, mealType, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Recipe image is required" });
    }

    let ingredients, steps;
    try {
      ingredients = JSON.parse(req.body.ingredients);
      steps = JSON.parse(req.body.steps);
    } catch (parseError) {
      return res
        .status(400)
        .json({ message: "Invalid format for ingredients or steps arrays" });
    }
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: "recipe-app/recipes",
    });

    const imageUrl = result.secure_url;

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        image: imageUrl,
        ingredients,
        steps,
        cuisine,
        dietaryType,
        mealType,
        course,
        authorId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Recipe uploaded successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

const getAllRecipes = async (req, res, next) => {
  const page = Number(req.query.page) || 1
  const limit = 10
  try {
    const { dietaryType, mealType, course, query } = req.query

    const whereClause = {
      ...(dietaryType && { dietaryType: dietaryType.toUpperCase() }),
      ...(mealType && { mealType: mealType.toUpperCase() }),
      ...(course && { course: course.toUpperCase() }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      })
    };

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { username: true, avatar: true } },
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } }
      }
    });

    const formattedRecipes = recipes.map(recipe => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      page,
      limit,
      recipes: formattedRecipes
    });
  } catch (error) {
    next(error)
  }
};

const getSingleRecipe = async (req, res, next) => {
  const recipeId = req.params.id;
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } }
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { likes, saves, ...rest } = recipe;
    const formattedRecipe = {
      ...rest,
      isLiked: likes.length > 0,
      isSaved: saves.length > 0
    };

    return res.status(200).json({ success: true, message: "Recipe fetched successfully", recipe: formattedRecipe });
  } catch (error) {
    next(error)
  }
};

const getMyRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { query } = req.query

    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId,
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        })
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } }
      }
    })

    const formattedRecipes = recipes.map(recipe => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes,
    })
  } catch (error) {
    next(error)
  }
}

const getUserRecipes = async (req, res, next) => {
  try {
    const userId = req.params.id
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } }
      }
    })

    if (recipes.length === 0) {
      return res.status(200).json({ success: true, message: "Recipes fetched successfully", recipes: [], count: 0 })
    }

    const formattedRecipes = recipes.map(recipe => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes
    })
  } catch (error) {
    next(error)
  }
}

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId
      }
    })
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.authorId !== userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { title, description, ingredients, steps, cuisine, dietaryType, mealType, course } = req.body;

    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(file, {
        folder: 'recipe-app/recipes',
      });

      await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          title,
          description,
          ingredients,
          steps,
          cuisine,
          dietaryType,
          mealType,
          course,
          image: result.secure_url,
        },
      });

      return res.status(200).json({ success: true, message: "Recipe updated successfully" });
    } else {
      await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          title,
          description,
          ingredients,
          steps,
          cuisine,
          dietaryType,
          mealType,
          course,
        },
      });

      return res.status(200).json({ success: true, message: "Recipe updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId
      }
    })

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.authorId !== userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    await prisma.recipe.delete({
      where: {
        id: recipeId
      }
    })
    return res.status(200).json({ success: true, message: "Recipe deleted successfully" })
  } catch (error) {
    next(error);
  }
}

const likeRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const like = await prisma.recipeLike.findFirst({
      where: {
        recipeId: recipeId,
        userId: req.user.id
      }
    })
    if (like) {
      await prisma.recipeLike.delete({
        where: {
          id: like.id
        }
      })
      return res.status(200).json({ success: true, message: "Recipe unliked successfully" })
    }
    else {
      await prisma.recipeLike.create({
        data: {
          recipeId: recipeId,
          userId: req.user.id
        }
      })
      return res.status(200).json({ success: true, message: "Recipe liked successfully" })
    }
  } catch (error) {
    next(error);
  }
}
const saveRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const savedRecipe = await prisma.savedRecipe.findFirst({
      where: {
        recipeId: recipeId,
        userId: req.user.id
      }
    })

    if (savedRecipe) {
      await prisma.savedRecipe.delete({
        where: {
          id: savedRecipe.id
        }
      })
      return res.status(200).json({ success: true, message: "Recipe unsaved successfully" })
    } else {
      await prisma.savedRecipe.create({
        data: {
          recipeId: recipeId,
          userId: req.user.id
        }
      })
      return res.status(200).json({ success: true, message: "Recipe saved successfully" })
    }
  } catch (error) {
    next(error)
  }

}
const getLikedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await prisma.recipe.findMany({
      where: {
        likes: {
          some: {
            userId: userId
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: { select: { username: true, avatar: true } },
        likes: { where: { userId: userId } },
        saves: { where: { userId: userId } },
        _count: { select: { likes: true, saves: true, comments: true } }
      }
    });

    const formattedRecipes = recipes.map(recipe => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes
    });
  } catch (error) {
    next(error);
  }
};

const getSavedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await prisma.recipe.findMany({
      where: {
        saves: {
          some: {
            userId: userId
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: { select: { username: true, avatar: true } },
        likes: { where: { userId: userId } },
        saves: { where: { userId: userId } },
        _count: { select: { likes: true, saves: true, comments: true } }
      }
    });

    const formattedRecipes = recipes.map(recipe => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecipe, getAllRecipes, getSingleRecipe, getMyRecipes, getUserRecipes, updateRecipe, deleteRecipe, likeRecipe, saveRecipe, getLikedRecipes, getSavedRecipes };
