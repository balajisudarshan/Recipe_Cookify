import axios from "axios"

const BASE_URL = "http://192.168.1.7:5000/api/auth"

export const api = axios.create({
  baseURL: BASE_URL,
})

export const registerUser = (data) => api.post("/register", data)
export const loginUser = (data) => api.post("/login", data)
