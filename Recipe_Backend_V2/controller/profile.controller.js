const express = require("express");
const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");
const me = async(req,res)=>{
  try {
    const id = req.user.id
    console.log(id)
    const user = await prisma.user.findUnique({
      where:{
        id,
      },
      select:{
        id:true,
        username:true,
        email:true,
        avatar:true,
        bio:true
      }
    })

    return res.status(200).json({user})
    
  } catch (error) {
    console.log(error)
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;

    let avatar;

    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(file, {
        folder: "recipe-app/avatars",
      });

      avatar = result.secure_url;
    }

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar }),
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProfile = async(req,res)=>{
  try {
    const id = req.params.id
    const user = await prisma.user.findUnique({
      where:{
        id:id
      },
      include:{
        followers:true,
        following:true
      }
    })

    if(!user){
      return res.status(404).json({
        message:"User not found"
      })
    }

    return res.status(200).json({
      user:{
        id:user.id,
        username:user.username,
        email:user.email,
        avatar:user.avatar,
        bio:user.bio,
        followerCount:user.followers.length,
        followingCount:user.following.length
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Server Error"
    })
  }
}

const getAllUsers = async(req,res)=>{
  const userId = req.user.id
  try {
    const users = await prisma.user.findMany({
      where:{
        id:{
          not:userId
        }
      },
      select:{
        id:true,
        username:true,
        avatar:true,
        bio:true
      }
    })
    return res.status(200).json({users})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal server error`"})
  }
}
module.exports = {updateProfile,me,getProfile,getAllUsers}