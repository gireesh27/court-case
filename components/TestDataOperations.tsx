import React, { useState } from 'react';
import { Button } from './Button';
import { searchCase, insertCaseWithDetails, generateMockCaseData } from '../lib/db.utils';
import { CaseDetails } from '../lib/database.types';

export function TestDatabaseOperations() {
  const [status, setStatus] = useState<'idle' | 'inserting' | 'searching'>('idle');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams, setSearchParams] = useState({
    courtName: 'Northeast District Court',
    caseType: 'Civil',
    caseNumber: '',
    caseYear: new Date().getFullYear().toString()
  });
  const [searchResult, setSearchResult] = useState<CaseDetails | null>(null);
  const [insertedCaseId, setInsertedCaseId] = useState<number | null>(null);

  const handleInsertMockData = async () => {
    setStatus('inserting');
    setMessage('Inserting mock case data...');
    setIsSuccess(false);
    setSearchResult(null);
    setInsertedCaseId(null);

    try {
      const mockData = generateMockCaseData();
      const result = await insertCaseWithDetails(mockData);
      
      setIsSuccess(result.success);
      
      if (result.success && result.caseId) {
        setInsertedCaseId(result.caseId);
        setMessage(`Successfully inserted mock case with ID: ${result.caseId}`);
        
        // Update search params to match the inserted case
        setSearchParams({
          courtName: mockData.caseInfo.courtName,
          caseType: mockData.caseInfo.caseType,
          caseNumber: mockData.caseInfo.caseNumber,
          caseYear: mockData.caseInfo.caseYear
        });
      } else {
        setMessage(result.message || 'Failed to insert mock case data');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setStatus('idle');
    }
  };

  const handleSearch = async () => {
    if (!searchParams.caseNumber) {
      setMessage('Please enter a case number');
      setIsSuccess(false);
      return;
    }

    setStatus('searching');
    setMessage('Searching for case...');
    setIsSuccess(false);
    setSearchResult(null);

    try {
      const result = await searchCase(searchParams);
      
      setIsSuccess(result.success);
      
      if (result.success && result.data) {
        setSearchResult(result.data);
        setMessage('Case found successfully');
      } else {
        setMessage(result.message || 'No case found with the given criteria');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setStatus('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Test Database Operations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Insert Mock Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Insert Mock Data</h3>
          
          <p className="text-sm text-gray-600">
            Click the button below to generate and insert mock case data into the database.
            This is useful for testing the search functionality.
          </p>
          
          <Button 
            onClick={handleInsertMockData}
            disabled={status !== 'idle'}
            className="w-full"
            variant="judicial"
          >
            {status === 'inserting' ? 'Inserting...' : 'Insert Mock Case Data'}
          </Button>
          
          {insertedCaseId && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
              <p className="font-medium">Inserted Case ID: {insertedCaseId}</p>
              <p className="text-sm">Case Number: {searchParams.caseNumber}</p>
              <p className="text-sm">Case Year: {searchParams.caseYear}</p>
            </div>
          )}
        </div>
        
        {/* Right Column - Search Case */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Case</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-1">
                Court Name
              </label>
              <select
                id="courtName"
                name="courtName"
                value={searchParams.courtName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Northeast District Court">Northeast District Court</option>
                <option value="Northeast High Court">Northeast High Court</option>
                <option value="Northeast Family Court">Northeast Family Court</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
                Case Type
              </label>
              <select
                id="caseType"
                name="caseType"
                value={searchParams.caseType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Family">Family</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Case Number
              </label>
              <input
                id="caseNumber"
                name="caseNumber"
                type="text"
                value={searchParams.caseNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="caseYear" className="block text-sm font-medium text-gray-700 mb-1">
                Case Year
              </label>
              <input
                id="caseYear"
                name="caseYear"
                type="text"
                value={searchParams.caseYear}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            disabled={status !== 'idle'}
            className="w-full"
            variant="judicial"
          >
            {status === 'searching' ? 'Searching...' : 'Search Case'}
          </Button>
        </div>
      </div>
      
      {/* Status Messages */}
      {message && (
        <div className={`mt-6 p-3 rounded-md ${isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
      
      {/* Search Results */}
      {searchResult && (
        <div className="mt-6 border rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-lg font-medium">Search Results</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Case Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Case Number:</span> {searchResult.caseInfo.caseNumber}</div>
                <div><span className="font-medium">Case Year:</span> {searchResult.caseInfo.caseYear}</div>
                <div><span className="font-medium">Court:</span> {searchResult.caseInfo.courtName}</div>
                <div><span className="font-medium">Type:</span> {searchResult.caseInfo.caseType}</div>
                <div><span className="font-medium">Status:</span> {searchResult.caseInfo.status}</div>
                <div><span className="font-medium">Filed On:</span> {searchResult.caseInfo.filingDate}</div>
                <div><span className="font-medium">Plaintiff:</span> {searchResult.caseInfo.plaintiff}</div>
                <div><span className="font-medium">Defendant:</span> {searchResult.caseInfo.defendant}</div>
                <div><span className="font-medium">Judge:</span> {searchResult.caseInfo.judge}</div>
                <div><span className="font-medium">Next Hearing:</span> {searchResult.nextHearingDate || 'None scheduled'}</div>
              </div>
            </div>
            
            {searchResult.hearings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Hearings</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courtroom</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResult.hearings.map((hearing) => (
                      <tr key={hearing.id}>
                        <td className="px-3 py-2 text-sm">{hearing.date}</td>
                        <td className="px-3 py-2 text-sm">{hearing.time}</td>
                        <td className="px-3 py-2 text-sm">{hearing.purpose}</td>
                        <td className="px-3 py-2 text-sm">{hearing.courtroom}</td>
                        <td className="px-3 py-2 text-sm">{hearing.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {searchResult.orders.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Orders</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResult.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-3 py-2 text-sm">{order.date}</td>
                        <td className="px-3 py-2 text-sm">{order.type}</td>
                        <td className="px-3 py-2 text-sm">{order.description}</td>
                        <td className="px-3 py-2 text-sm">{order.issuedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {searchResult.judgments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Judgments</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResult.judgments.map((judgment) => (
                      <tr key={judgment.id}>
                        <td className="px-3 py-2 text-sm">{judgment.date}</td>
                        <td className="px-3 py-2 text-sm">{judgment.type}</td>
                        <td className="px-3 py-2 text-sm">{judgment.summary}</td>
                        <td className="px-3 py-2 text-sm">{judgment.issuedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
