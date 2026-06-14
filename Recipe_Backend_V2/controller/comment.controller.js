const prisma = require("../config/prisma");

const addComment = async (req, res, next) => {
    try {
        const userId = req.user.id
        const recipeId = req.params.id
        const { comment } = req.body

        if (!comment) {
            return res.status(400).json({ message: "Comment is required" })
        }

        const recipe = await prisma.recipe.findFirst({
            where: {
                id: recipeId
            }
        })

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }

        await prisma.comment.create({
            data: {
                comment: comment,
                userId: userId,
                recipeId: recipeId
            }
        })

        return res.status(200).json({ success: true, message: "Comment added successfully" })
    } catch (error) {
        next(error)
    }
}

const getComments = async (req, res, next) => {
    try {
        const recipeId = req.params.id
        const recipe = await prisma.recipe.findFirst({
            where: {
                id: recipeId
            }
        })
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        const comments = await prisma.comment.findMany({
            where: {
                recipeId: recipeId
            },
            include: {
                user: {
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

        return res.status(200).json({ success: true, message: "Comments fetched successfully", comments })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id
        const userId = req.user.id
        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId
            },
            select: {
                recipeId: true,
                userId: true
            }
        })

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        const recipe = await prisma.recipe.findFirst({
            where: {
                id: comment.recipeId
            },
            select: {
                authorId: true
            }
        })

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        if (comment.userId !== userId || recipe.authorId !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" })
        }
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        })

        return res.status(200).json({ success: true, message: "Comment deleted successfully" })
    } catch (error) {
        next(error)
    }
}
module.exports = { addComment, getComments, deleteComment }