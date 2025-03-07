import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Use environment variables for sensitive credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kkkrzkoswgqofhfplkjl.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtra3J6a29zd2dxb2ZoZnBsa2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjI4NDksImV4cCI6MjA1NjgzODg0OX0.EA8pDxozwLAUHYdOUTb7CM6-XyIR_MZVLopl7NWUXfI"

// Create typed client
export const supabase = createClient<Database>( supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  }
})

// Enhanced setup function with validation
export async function setupSupabaseCredentials(url: string, key: string) {
  if (!url || !key) {
    throw new Error('Supabase URL and key are required');
  }
  return createClient<Database>(url, key);
}

// Improved connection test with detailed error handling
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return {
      success: true,
      message: 'Database connection successful',
      data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: `Connection failed: ${errorMessage}`,
      error
    };
  }
}