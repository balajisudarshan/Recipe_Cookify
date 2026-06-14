const cloudinary = require("../config/cloudinary");

const avatarUpload = async (req, res, next) => {
  try {
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: "recipe-app/avatars",
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error)
  }
};

const recipeUpload = async (req, res, next) => {
  try {
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(file, {
      folder: "recipe-app/recipes",
    });
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error)
  }
};


module.exports = { avatarUpload, recipeUpload }