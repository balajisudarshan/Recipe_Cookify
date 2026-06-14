const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const sanitizeUser = (user) => {
  if (!user) return null
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    followerCount: user.followers ? user.followers.length : 0,
    followingCount: user.following ? user.following.length : 0
  }
}

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: sanitizeUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email/username and password are required' })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ]
      },
      include: {
        followers: true,
        following: true
      }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        followers: true,
        following: true
      }
    })
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, me }