const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");
const express = require("express");

const createRecipe = async (req, res) => {
  try {
    const authorId = req.user.id;

    const { title, description, cuisine, foodType } = req.body;

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
        .json({ error: "Invalid format for ingredients or steps arrays" });
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
        foodType,
        authorId,
      },
    });

    return res.status(201).json({
      message: "Recipe uploaded successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const {foodType} = req.query

    
      const recipes = await prisma.recipe.findMany({
      where: foodType ? { foodType: { equals: foodType, mode: "insensitive" } } : {},
      orderBy: { createdAt: "desc" },
      include: { author: { select: { username: true, avatar: true } } }
    });

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getSingleRecipe = async (req, res) => {
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
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMyRecipes = async(req,res)=>{
  try {
    const userId = req.user.id

    const recipes = await prisma.recipe.findMany({
      where:{
        authorId:userId
      },
      orderBy:{
        createdAt:"desc"
      }
    })

    return res.status(200).json({
      count:recipes.length,
      recipes,
    })
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error fetching your recipes" 
    });
  }
}

module.exports = { createRecipe, getAllRecipes,getSingleRecipe,getMyRecipes};
