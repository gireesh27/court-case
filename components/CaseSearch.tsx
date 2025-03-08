"use client"
import React, { useState } from "react";
import { SearchForm } from "./SearchForm";
import { CaseDetails } from "./CaseDetails";
import { CaseDetailsResponse } from "@/types/types";

export function CaseSearch() {
  const [caseDetails, setCaseDetails] = useState<CaseDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchSuccess = (data: CaseDetailsResponse) => {
    setCaseDetails(data);
    setError(null);
    setIsLoading(false); // Add this line to stop loading
  };

  const handleSearchError = (errorMessage: string) => {
    setError(errorMessage);
    setCaseDetails(null);
    setIsLoading(false); // Add this line to stop loading
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchForm 
        onSuccess={handleSearchSuccess}
        onError={handleSearchError}
        onSubmit={handleSubmit}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Modify this section */}
      
      {isLoading && (
  <CaseDetails 
    caseDetails={caseDetails as CaseDetailsResponse} 
    isLoading={true}
  />
)}

{caseDetails && !isLoading && (
  <CaseDetails 
    caseDetails={caseDetails}
    isLoading={false} 
  />
)}
    </div>
  );
}