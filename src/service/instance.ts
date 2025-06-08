import axios from "axios"

const BASE_URL = "http://localhost:8080/api"

export const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
})
