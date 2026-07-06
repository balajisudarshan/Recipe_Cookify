import { likeOrUnlineRecipe } from "../api/apiRoute";

export const useLikeRecipe = () => {
  const handleLike = async (id, setRecipes) => {
    try {
      await likeOrUnlineRecipe(id);

      setRecipes((prev) => {
        if (Array.isArray(prev)) {
          return prev.map((recipe) =>
            recipe.id === id
              ? {
                  ...recipe,
                  isLiked: !recipe.isLiked,
                  _count: {
                    ...(recipe._count || {}),
                    likes: recipe.isLiked
                      ? Math.max((recipe._count?.likes ?? 0) - 1, 0)
                      : (recipe._count?.likes ?? 0) + 1,
                  },
                }
              : recipe
          );
        }

        if (prev && typeof prev === "object") {
          const currentLikes = prev._count?.likes ?? 0;

          return {
            ...prev,
            isLiked: !prev.isLiked,
            _count: {
              ...(prev._count || {}),
              likes: prev.isLiked
                ? Math.max(currentLikes - 1, 0)
                : currentLikes + 1,
            },
          };
        }

        return prev;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { handleLike };
};