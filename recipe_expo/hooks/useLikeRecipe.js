import { likeOrUnlikeRecipe } from "../api/apiRoute";

export const useLikeRecipe = () => {
  const handleLike = async (id, setRecipes) => {
    const applyLikeUpdate = (prev) => {
      if (Array.isArray(prev)) {
        return prev.map((recipe) => {
          if (recipe.id !== id) return recipe;

          const nextIsLiked = !Boolean(recipe.isLiked);

          return {
            ...recipe,
            isLiked: nextIsLiked,
            _count: {
              ...(recipe._count || {}),
              likes: nextIsLiked
                ? (recipe._count?.likes ?? 0) + 1
                : Math.max((recipe._count?.likes ?? 0) - 1, 0),
            },
          };
        });
      }

      if (prev && typeof prev === "object") {
        const currentLikes = prev._count?.likes ?? 0;
        const nextIsLiked = !Boolean(prev.isLiked);

        return {
          ...prev,
          isLiked: nextIsLiked,
          _count: {
            ...(prev._count || {}),
            likes: nextIsLiked
              ? currentLikes + 1
              : Math.max(currentLikes - 1, 0),
          },
        };
      }

      return prev;
    };

    setRecipes((prev) => applyLikeUpdate(prev));

    try {
      await likeOrUnlikeRecipe(id);
    } catch (error) {
      setRecipes((prev) => applyLikeUpdate(prev));
      console.log("Like request failed, reverted UI:", error);
    }
  };

  return { handleLike };
};