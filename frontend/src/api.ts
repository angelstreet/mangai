// Prepends Vite's base URL so API calls work both locally and under /mangai/ via nginx
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // e.g. '/mangai'
export const API = `${BASE}/api`
