const prisma = require('../config/prisma')

const checkAdmin = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                role: true
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                message: "You are not authorized please contact admin"
            })
        }

        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = checkAdmin