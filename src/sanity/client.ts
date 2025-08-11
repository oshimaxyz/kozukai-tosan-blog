import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'ck8ysor6', // Your project ID
  dataset: 'production', // Your dataset name
  apiVersion: '2025-08-10', // Use a recent date
  useCdn: false, // Set to false for authenticated writes
  token: process.env.SANITY_API_TOKEN, // Your API token
});
