"use client"
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchForm } from "@/components/SearchForm";
import { CaseDetails } from "@/components/CaseDetails";
import { CaseDetailsResponse } from "@/brain/data-contracts";
import { AlertTriangle } from "lucide-react";

export default function Search() {
  const [caseDetails, setCaseDetails] = useState<CaseDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearchSuccess = (results: CaseDetailsResponse) => {
    setCaseDetails(results);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSearchError = (errorMessage: string) => {
    setCaseDetails(null);
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12 mt-16">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Search</h1>
          <p className="text-gray-600 mb-8">
            Enter the details below to search for case information from the Northeast court portal.
          </p>
          
          <SearchForm 
            onSuccess={handleSearchSuccess} 
            onError={handleSearchError} 
            onSubmit={() => {
              setIsLoading(true);
              setCaseDetails(null);
              setError(null);
            }} 
          />
          
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error retrieving case information</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <CaseDetails 
              caseDetails={{
                caseInfo: {
                  caseNumber: '',
                  caseYear: '',
                  courtName: '',
                  caseType: '',
                  filingDate: '',
                  status: '',
                  plaintiff: '',
                  defendant: '',
                  judge: ''
                },
                hearings: [],
                orders: [],
                judgments: []
              }} 
              isLoading={true} 
            />
          )}
          {caseDetails && <CaseDetails caseDetails={caseDetails} isLoading={false} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
