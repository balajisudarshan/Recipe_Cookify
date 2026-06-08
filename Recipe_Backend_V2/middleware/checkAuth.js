const jwt = require("jsonwebtoken");
const primsa = require("../config/prisma.js");
require('dotenv').config()
const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)

    const user = await primsa.user.findUnique({
        where:{
            id:decoded.userId
        },
        select:{
            id:true,
            username:true,
            email:true,
            avatar:true,
            bio:true
        }
    })

    if(!user){
        return res.status(401).json({
            message:"User not found"
        })
    }

    req.user = user

    next()
  } catch (error) {
    console.log(error?.message)

    return res.status(401).json({
        message:"Invalid token"
    })
  }
};
module.exports=checkAuth