import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.224.232.110:5000/api/"

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


export const registerUser = (data) => api.post("/auth/register", data)
export const loginUser = (data) => api.post("/auth/login", data)


export const getAllRecipes = ()=>api.get('/recipe')
export const getMyRecipes = () => api.get('/recipe/my')
export const getRecipe = (id)=>api.get(`/recipe/${id}`)
export const getRecentRecipes = ()=>api.get('/recipe/recent')
export const createRecipe = (formData) => api.post("/recipe/create", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export const getMe = () => api.get("/profile/me")
export const getUsers = () => api.get('/profile/all-users')

export const updateProfile = (formData) => api.put("/profile/update", formData)
