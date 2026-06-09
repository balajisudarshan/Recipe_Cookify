import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.5:5000/api/"

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

export const getMe = ()=>{
  api.get("/profile/me")
}

export const updateProfile = (formData)=>api.put("/profile/update",formData)
