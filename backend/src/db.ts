import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
dotenv.config()

export const db = createClient({
  url: process.env.TURSO_URL || 'file:local.db',
  authToken: process.env.TURSO_TOKEN,
})
