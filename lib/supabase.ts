
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types';

const supabaseUrl = "https://kkkrzkoswgqofhfplkjl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtra3J6a29zd2dxb2ZoZnBsa2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjI4NDksImV4cCI6MjA1NjgzODg0OX0.EA8pDxozwLAUHYdOUTb7CM6-XyIR_MZVLopl7NWUXfI"
export const supabase = createClient(supabaseUrl, supabaseKey)


// Request the user to set up the Supabase credentials
export async function setupSupabaseCredentials(url: string, key: string) {
  // In a production app, we would store these in a secure location
  console.log('Setting up Supabase credentials:', { url, key });
  return createClient<Database>(url, key);
}

// Test the database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('cases').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Successfully connected to the database' };
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return { success: false, message: `Failed to connect to the database: ${error instanceof Error ? error.message : String(error)}` };
  }
}
