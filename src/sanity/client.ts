import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ck8ysor6',
  dataset: 'production',
  apiVersion: '2025-08-10', // use a UTC date in YYYY-MM-DD format
  useCdn: true, // `false` if you want to ensure fresh data
})
