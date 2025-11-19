import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1',
})

// TEMPORAL: token quemado solo para avanzar Fase 2
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer 123`
  return config
})
