"use client"
import React, { useState } from 'react';
import { Button } from './Button';
import { setupSupabaseCredentials, testConnection } from '@/lib/supabase';
import { initializeDatabase } from '@/lib/db.utils';
import Link from 'next/link';

export function DatabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'initializing'>('idle');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setMessage('Please enter both Supabase URL and API key');
      return;
    }

    setStatus('testing');
    setMessage('Testing connection...');
    setIsSuccess(false);

    try {
      // Set up credentials
      await setupSupabaseCredentials(supabaseUrl, supabaseKey);
      
      // Test connection
      const result = await testConnection();
      
      setIsSuccess(result.success);
      setMessage(result.message);
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setStatus('idle');
    }
  };

  const handleInitializeDatabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setMessage('Please enter both Supabase URL and API key');
      return;
    }

    setStatus('initializing');
    setMessage('Initializing database...');
    setIsSuccess(false);

    try {
      // Set up credentials
      await setupSupabaseCredentials(supabaseUrl, supabaseKey);
      
      // Initialize database
      const result = await initializeDatabase();
      
      setIsSuccess(result.success);
      setMessage(result.message);
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">PostgreSQL Database Setup</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Supabase URL
          </label>
          <input
            id="supabaseUrl"
            type="text"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="supabaseKey" className="block text-sm font-medium text-gray-700 mb-1">
            Supabase API Key
          </label>
          <input
            id="supabaseKey"
            type="password"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="your-anon-key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <Button 
          onClick={handleTestConnection}
          disabled={status !== 'idle'}
          className="flex-1"
          variant="judicial"
        >
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </Button>
        
        <Button 
          onClick={handleInitializeDatabase}
          disabled={status !== 'idle'}
          className="flex-1"
          variant="judicial"
        >
          {status === 'initializing' ? 'Initializing...' : 'Initialize Database'}
        </Button>
      </div>
      
      {message && (
        <div className={`p-3 rounded-md ${isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create a Supabase account at <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com</a>.</li>
          <li>Create a new project and get your URL and anon key from the project API settings.</li>
          <li>Enter these credentials above and test the connection.</li>
          <li>Once connected, initialize the database to create the required tables.</li>
          <li>Store these credentials securely in the app secrets for production use.</li>
        </ol>
      </div>
      
      <div className="mt-6 flex justify-center">
      <Link href="/">
        <Button 
          variant="outline"
          className="mr-2"
        >
          Go Home
        </Button>
        </Link>
        <Button 
          onClick={() => {
            // Request to save Supabase credentials as secrets
            if (supabaseUrl && supabaseKey) {
              window.alert('Please add these credentials as SUPABASE_URL and SUPABASE_KEY in your app secrets.');
            } else {
              window.alert('Please enter Supabase URL and API key first.');
            }
          }}
          variant="secondary"
        >
          Save Credentials as Secrets
        </Button>
      </div>
    </div>
  );
}
