const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

const createRecipe = async (req, res, next) => {
  try {
    const authorId = req.user.id;

    const { title, description, cuisine, dietaryType, mealType, course } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Recipe image is required" });
    }

    let ingredients, steps;
    try {
      const parseField = (field) => {
        if (!field) return [];
        if (typeof field !== "string") return field;
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [field];
        } catch (e) {
          // Fallback: split by comma if JSON parse fails
          return field
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
      };

      ingredients = parseField(req.body.ingredients);
      steps = parseField(req.body.steps);

      if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
        throw new Error("Fields must resolve to arrays");
      }
    } catch (parseError) {
      return res.status(400).json({
        message:
          "Invalid format for ingredients or steps arrays. Provide a JSON array or comma-separated string.",
      });
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
        dietaryType: dietaryType?.toUpperCase(),
        mealType: mealType?.toUpperCase(),
        course: course?.toUpperCase(),
        authorId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Recipe uploaded successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllRecipes = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  try {
    const { dietaryType, mealType, course, query, cuisine } = req.query;

    const whereClause = {
      ...(dietaryType && { dietaryType: dietaryType.toUpperCase() }),
      ...(mealType && { mealType: mealType.toUpperCase() }),
      ...(course && { course: course.toUpperCase() }),
      ...(cuisine && { cuisine: cuisine.toUpperCase() }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
    };
    const [recipes, totalRecipes] = await Promise.all([
      prisma.recipe.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {

          author: { select: { username: true, avatar: true } },
          likes: { where: { userId: req.user.id } },
          saves: { where: { userId: req.user.id } },
          _count: { select: { likes: true, saves: true, comments: true } },
        },
      }),
      prisma.recipe.count({
        where: whereClause,
      })

    ])


    const formattedRecipes = recipes.map((recipe) => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0,
      };
    });


    const totalPages = Math.ceil(totalRecipes / limit)
    const hasNextPage = page < totalPages

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      page,
      limit,
      totalRecipes,
      totalPages,
      hasNextPage,
      recipes: formattedRecipes,
    });
  } catch (error) {
    next(error);
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
        ratings: { where: { userId: req.user.id } },
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } },
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { likes, saves, ...rest } = recipe;
    const formattedRecipe = {
      ...rest,
      isLiked: likes.length > 0,
      isSaved: saves.length > 0,
    };

    return res.status(200).json({
      success: true,
      message: "Recipe fetched successfully",
      recipe: formattedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId,
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } },
      },
    });

    const formattedRecipes = recipes.map((recipe) => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes,
    });
  } catch (error) {
    next(error);
  }
};

const getUserRecipes = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: { where: { userId: req.user.id } },
        saves: { where: { userId: req.user.id } },
        _count: { select: { likes: true, saves: true, comments: true } },
      },
    });

    if (recipes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Recipes fetched successfully",
        recipes: [],
        count: 0,
      });
    }

    const formattedRecipes = recipes.map((recipe) => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentRecipes = async (req, res, next) => {
  const { dietaryType, limit } = req.query;
  try {
    const recipes = await prisma.recipe.findMany({
      where: dietaryType ? { dietaryType } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit) || 4,
    });

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
      },
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.authorId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      ingredients,
      steps,
      cuisine,
      dietaryType,
      mealType,
      course,
    } = req.body;

    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(file, {
        folder: "recipe-app/recipes",
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

      return res
        .status(200)
        .json({ success: true, message: "Recipe updated successfully" });
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

      return res
        .status(200)
        .json({ success: true, message: "Recipe updated successfully" });
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
        id: recipeId,
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.authorId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.$transaction([
      prisma.notification.deleteMany({
        where: {
          OR: [{ recipeId: recipeId }, { senderId: userId }],
        },
      }),
      prisma.comment.deleteMany({
        where: {
          recipeId: recipeId,
        },
      }),
      prisma.recipeLike.deleteMany({
        where: {
          recipeId: recipeId,
        },
      }),
      prisma.savedRecipe.deleteMany({
        where: {
          recipeId: recipeId,
        },
      }),
      prisma.recipe.delete({
        where: {
          id: recipeId,
        },
      }),
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const likeRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const like = await prisma.recipeLike.findFirst({
      where: {
        recipeId: recipeId,
        userId: req.user.id,
      },
    });
    if (like) {
      await prisma.recipeLike.delete({
        where: {
          id: like.id,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Recipe unliked successfully" });
    } else {
      await prisma.recipeLike.create({
        data: {
          recipeId: recipeId,
          userId: req.user.id,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Recipe liked successfully" });
    }
  } catch (error) {
    next(error);
  }
};
const saveRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const savedRecipe = await prisma.savedRecipe.findFirst({
      where: {
        recipeId: recipeId,
        userId: req.user.id,
      },
    });

    if (savedRecipe) {
      await prisma.savedRecipe.delete({
        where: {
          id: savedRecipe.id,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Recipe unsaved successfully" });
    } else {
      await prisma.savedRecipe.create({
        data: {
          recipeId: recipeId,
          userId: req.user.id,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Recipe saved successfully" });
    }
  } catch (error) {
    next(error);
  }
};
const getLikedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await prisma.recipe.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: { select: { username: true, avatar: true } },
        likes: { where: { userId: userId } },
        saves: { where: { userId: userId } },
        _count: { select: { likes: true, saves: true, comments: true } },
      },
    });

    const formattedRecipes = recipes.map((recipe) => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes,
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
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: { select: { username: true, avatar: true } },
        likes: { where: { userId: userId } },
        saves: { where: { userId: userId } },
        _count: { select: { likes: true, saves: true, comments: true } },
      },
    });

    const formattedRecipes = recipes.map((recipe) => {
      const { likes, saves, ...rest } = recipe;
      return {
        ...rest,
        isLiked: likes.length > 0,
        isSaved: saves.length > 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      count: formattedRecipes.length,
      recipes: formattedRecipes,
    });
  } catch (error) {
    next(error);
  }
};

const rateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const existingRating = await prisma.recipeRating.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existingRating) {
      await prisma.recipeRating.update({
        where: {
          userId_recipeId: {
            userId,
            recipeId,
          },
        },
        data: {
          rating,
        },
      });
    } else {
      await prisma.recipeRating.create({
        data: {
          userId,
          recipeId,
          rating,
        },
      });
    }

    const stats = await prisma.recipeRating.aggregate({
      where: {
        recipeId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        averageRating: Number(stats._avg.rating?.toFixed(1) || 0),
        ratingsCount: stats._count.rating,
      },
    });
    return res.status(200).json({
      success: true,
      message: existingRating
        ? "Rating updated successfully"
        : "Recipe Rated Successfully",
      data: {
        averageRating: Number(stats._avg.rating?.toFixed(1) || 0),
        ratingsCount: stats._count.rating,
        userRating: rating,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getRecipeRating = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      select: {
        averageRating: true,
        ratingsCount: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    return res.stats(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const reportRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params
    const { reason, description } = req.body
    const userId = req.user.id

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId
      }
    })

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    const existingReport = await prisma.recipeReport.findUnique({
      where: {
        recipeId_reporterId: {
          recipeId,
          reporterId: userId
        }
      }
    })

    if (existingReport) {
      return res.status(400).json({ message: "Recipe already reported" })
    }

    const report = await prisma.recipeReport.create({
      data: {
        recipeId,
        reporterId: userId,
        reason,
        description
      }
    })


    return res.status(201).json({
      message: "Report submitted successfully",
      report
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: "Failed to report recipe"
    })
  }
}

const getReportedRecipes = async (req, res) => {
  try {
    const reportedRecipes = await prisma.recipeReport.findMany({
      select: {
        id: true,
        reason: true,
        description: true,
        status: true,
        createdAt: true,
        recipe: {
          select: {
            id: true,
            title: true,
            image: true,
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return res.status(200).json({
      message: "Reported recipes fetched successfully",
      data: reportedRecipes
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: "Failed to fetch reported recipes"
    })
  }
}
module.exports = {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  getMyRecipes,
  getUserRecipes,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  saveRecipe,
  getLikedRecipes,
  getSavedRecipes,
  getRecentRecipes,
  rateRecipe,
  getRecentRecipes,
  reportRecipe,
  getReportedRecipes
};
