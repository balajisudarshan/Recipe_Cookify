
const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bio, username } = req.body;

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
        ...(username !== undefined && { username }),
        ...(avatar && { avatar }),
      },
      include: {
        followers: true,
        following: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updateUser.id,
        username: updateUser.username,
        email: updateUser.email,
        avatar: updateUser.avatar,
        bio: updateUser.bio,
        followerCount: updateUser.followers.length,
        followingCount: updateUser.following.length
      }
    });
  } catch (error) {
    next(error)
  }
};

const getProfile = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        followers: true,
        following: true
      }
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followerCount: user.followers.length,
        followingCount: user.following.length
      }
    })
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  const userId = req.user.id
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(Number(req.query.limit) || 10, 50)
  const { query } = req.query

  try {
    const whereClause = {
      id: { not: userId },
      ...(query && {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ]
      })
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        followers: true,
        following: true
      }
    })

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followerCount: user.followers.length,
      followingCount: user.following.length
    }))

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: formattedUsers.length,
      page,
      limit,
      users: formattedUsers
    })
  } catch (error) {
    next(error)
  }
}
const followUser = async (req, res, next) => {
  try {
    const id = req.user.id
    const userId = req.params.id

    const isFollowed = await prisma.follow.findFirst({
      where: {
        followerId: id,
        followingId: userId
      }
    })
    if (isFollowed) {
      return res.status(400).json({ message: "You are already following this user" })
    }
    if (id === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }
    await prisma.follow.create({
      data: {
        followerId: id,
        followingId: userId
      }
    })
    return res.status(200).json({ success: true, message: "User followed successfully" })
  } catch (error) {
    next(error)
  }
}
const unfollowUser = async (req, res, next) => {
  try {
    const id = req.user.id
    const userId = req.params.id
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: id,
        followingId: userId
      }
    })
    if (!follow) {
      return res.status(404).json({ message: "Already unfollowed or user not found" })
    }
    await prisma.follow.delete({
      where: {
        id: follow.id
      }
    })
    return res.status(200).json({ success: true, message: "User unfollowed successfully" })
  } catch (error) {
    next(error)
  }
}
module.exports = { updateProfile, getProfile, getAllUsers, followUser, unfollowUser }