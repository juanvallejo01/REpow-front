import axios from 'axios'

// instancia de axios con la url base de nuestro back (Express + Neon)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
})

export default api
