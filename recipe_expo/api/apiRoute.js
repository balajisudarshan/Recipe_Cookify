import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = "https://recipe-cookify-backend.onrender.com/api/"
const BASE_URL = "http://10.196.226.110:5000/api/"

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const isAuthExpiredError = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAuthExpiredError(error)) {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } catch (storageError) {
        console.log("Auth cleanup error:", storageError?.message);
      }

      if (typeof globalThis !== "undefined" && globalThis.__authLogoutHandler) {
        try {
          await globalThis.__authLogoutHandler();
        } catch (handlerError) {
          console.log("Auth logout handler error:", handlerError?.message);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = (data) => api.post("/auth/register", data)
export const loginUser = (data) => api.post("/auth/login", data)


export const getAllRecipes = (dietaryType = null, cuisine = null, mealType = null, page = 1, limit = 10, query = null) => {
  let params = { page, limit };

  if (typeof dietaryType === "object" && dietaryType !== null) {
    params = { page, limit, ...dietaryType };
  } else {
    if (dietaryType) params.dietaryType = dietaryType;
    if (cuisine) params.cuisine = cuisine;
    if (mealType) params.mealType = mealType;
    if (query) params.query = query;
  }
  return api.get("/recipe", { params });
};
export const getMyRecipes = () => api.get('/recipe/my')
export const getRecipe = (id)=>api.get(`/recipe/${id}`)
export const getRecentRecipes = (dietaryType = null)=> {
  if (dietaryType) {
    return api.get('/recipe/recent', { params: { dietaryType } });
  }
  return api.get('/recipe/recent');
}
export const getFavourites = ()=>api.get('/recipe/liked')
export const createRecipe = (formData) => api.post("/recipe/create", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export const likeOrUnlikeRecipe = (id)=>api.put(`/recipe/like/${id}`)
export const deleteRecipe = (id) => api.delete(`/recipe/${id}`)
export const rateRecipe = (id,rating)=>api.post(`/recipe/${id}/rate`,{
  rating
})

export const getMe = () => api.get("/auth/me")
export const getUserProfile = (id)=>api.get(`/profile/${id}`)
export const getUserRecipes = (id)=>api.get(`/recipe/user/${id}`)
export const getUsers = (paramsOrQuery = null, page = 1, limit = 10) => {
  let params = {};
  if (typeof paramsOrQuery === "object" && paramsOrQuery !== null) {
    params = { page, limit, ...paramsOrQuery };
  } else {
    params = { page, limit };
    if (paramsOrQuery) params.query = paramsOrQuery;
  }
  return api.get('/profile/all-users', { params });
};

export const updateProfile = (formData) => api.put("/profile/update", formData)
