import React from 'react';
import { DatabaseSetup } from '@/components/DataBaseSetup';
import { TestDatabaseOperations } from '@/components/TestDataOperations';

export default function DatabaseConfig() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">PostgreSQL Database Configuration</h1>
      
      <div className="space-y-10">
        <section>
          <DatabaseSetup />
        </section>
        
        <section>
          <TestDatabaseOperations />
        </section>
      </div>
    </div>
  );
}
