const express = require("express");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const avatarUpload = async (req, res) => {
  try {
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: "recipe-app/avatars",
    });

    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

const recipeUpload = async (req, res) => {
  try {
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(file, {
      folder: "recipe-app/recipes",
    });
    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};


module.exports = {avatarUpload,recipeUpload}