import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'ck8ysor6', // Your project ID
  dataset: 'production', // Your dataset name
  apiVersion: '2025-08-10', // Use a recent date
  useCdn: false, // Set to false for authenticated writes
  token: 'skRhr6SFe1frTgUDlKdNRMaSMJ3A5LtuiQtfldxR3q6GGVv0nFPpB2mCsmsjMljpWtfL5wWr0sdUFlX0EAaXJOBDYnsg5qOzEGxq6r2RnTxlWTHWTCSs0LqFBj2U17A0emgcGTe9PqSX2Y4n4AgrDYD4qdI3H3aGloMoV7UYJiiWypfVkBmo', // Your API token
});
