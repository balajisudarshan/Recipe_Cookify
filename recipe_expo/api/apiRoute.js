import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.239.37.110:5000/api/"

export const api = axios.create({
  baseURL: BASE_URL,
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
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || "";
  const normalizedMessage = typeof message === "string" ? message.toLowerCase() : "";

  return (
    status === 401 ||
    status === 403 ||
    normalizedMessage.includes("jwt") ||
    normalizedMessage.includes("expired") ||
    normalizedMessage.includes("token") ||
    normalizedMessage.includes("unauthorized")
  );
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


export const getAllRecipes = (dietaryType = null)=> {
  if (dietaryType) {
    return api.get('/recipe', { params: { dietaryType } });
  }
  return api.get('/recipe');
}
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
export const getMe = () => api.get("/profile/me")
export const getUsers = () => api.get('/profile/all-users')

export const updateProfile = (formData) => api.put("/profile/update", formData)
