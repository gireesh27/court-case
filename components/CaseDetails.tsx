import React, { useState } from "react";
import { CaseDetailsResponse, Hearing, Order, Judgment } from "@/brain/data-contracts";
import { Building2, Gavel, User, Users, Calendar, Clock, BookOpen, FileText } from "lucide-react";
import { cn } from "../lib/cn"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

interface Props {
  caseDetails: CaseDetailsResponse;
}

interface Props {
  caseDetails: CaseDetailsResponse;
  isLoading?: boolean;
}

export function CaseDetails({ caseDetails, isLoading = false }: Props) {
  const { caseInfo, hearings, orders, judgments, nextHearingDate } = caseDetails;
  const [activeTab, setActiveTab] = useState("case-info");
  
  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pt-8 border-t border-gray-200 mt-8 animate-pulse" data-testid="case-details-loading">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-md h-8 w-8"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 flex space-x-4 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
          <div className="p-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 pt-8 border-t border-gray-200 mt-8" data-testid="case-details">
      {/* Print button */}
      <div className="flex justify-end">
        <button 
          onClick={handlePrint}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Case Details
        </button>
      </div>
      {/* Case Overview Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Overview</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case Number and Year */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Number</p>
                  <p className="text-base font-semibold text-gray-900 font-mono">
                    {caseInfo.caseNumber}/{caseInfo.caseYear}
                  </p>
                </div>
              </div>
              
              {/* Court Name */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Court</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.courtName}</p>
                </div>
              </div>
              
              {/* Case Type */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Type</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.caseType}</p>
                </div>
              </div>
              
              {/* Filing Date */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Filing Date</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.filingDate}</p>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {caseInfo.status}
                  </div>
                </div>
              </div>
              
              {/* Next Hearing */}
              {nextHearingDate && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Hearing</p>
                    <p className="text-base font-semibold text-gray-900">{nextHearingDate}</p>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-t border-gray-200" />
            
            {/* Parties Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plaintiff */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Plaintiff</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.plaintiff}</p>
                </div>
              </div>
              
              {/* Defendant */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Defendant</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.defendant}</p>
                </div>
              </div>
              
              {/* Judge */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <Gavel className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Judge</p>
                  <p className="text-base font-semibold text-gray-900">{caseInfo.judge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Interface for all case details */}
      <Tabs defaultValue="case-info" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TabsList className="border-b border-gray-200 w-full justify-start rounded-none bg-white overflow-x-auto flex-nowrap print:hidden">
          <TabsTrigger 
            value="case-info" 
            className={cn(
              "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:text-indigo-700 py-4 px-4 md:px-6 whitespace-nowrap flex-shrink-0",
              "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
            )}
          >
            Case Information
          </TabsTrigger>
          <TabsTrigger 
            value="hearings" 
            className={cn(
              "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:text-indigo-700 py-4 px-6",
              "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
            )}
          >
            Hearings ({hearings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className={cn(
              "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:text-indigo-700 py-4 px-6",
              "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
            )}
          >
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger 
            value="judgments" 
            className={cn(
              "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:text-indigo-700 py-4 px-6",
              "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
            )}
          >
            Judgments ({judgments.length})
          </TabsTrigger>
          {nextHearingDate && (
            <TabsTrigger 
              value="next-hearing" 
              className={cn(
                "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-700 data-[state=active]:text-indigo-700 py-4 px-6",
                "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300"
              )}
            >
              Next Hearing
            </TabsTrigger>
          )}
        </TabsList>

        {/* Case Information Content */}
        <TabsContent value="case-info" className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Case Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Number and Year */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Case Number</p>
                <p className="text-base font-semibold text-gray-900 font-mono">
                  {caseInfo.caseNumber}/{caseInfo.caseYear}
                </p>
              </div>
            </div>
            
            {/* Court Name */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Court</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.courtName}</p>
              </div>
            </div>
            
            {/* Case Type */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Case Type</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.caseType}</p>
              </div>
            </div>
            
            {/* Filing Date */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Filing Date</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.filingDate}</p>
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {caseInfo.status}
                </div>
              </div>
            </div>
            
            {/* Next Hearing */}
            {nextHearingDate && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Hearing</p>
                  <p className="text-base font-semibold text-gray-900">{nextHearingDate}</p>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 my-6" />
          
          {/* Parties Information */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">Parties Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plaintiff */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Plaintiff</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.plaintiff}</p>
              </div>
            </div>
            
            {/* Defendant */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Defendant</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.defendant}</p>
              </div>
            </div>
            
            {/* Judge */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-md">
                <Gavel className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Judge</p>
                <p className="text-base font-semibold text-gray-900">{caseInfo.judge}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Hearings Section */}
        <TabsContent value="hearings" className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hearing History</h3>
          {hearings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courtroom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hearings.map((hearing: Hearing, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hearing.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hearing.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hearing.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hearing.courtroom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${hearing.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {hearing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hearings available for this case.</p>
          )}
        </TabsContent>
        
        {/* Orders Section */}
        <TabsContent value="orders" className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders</h3>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: Order, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.issuedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No orders available for this case.</p>
          )}
        </TabsContent>
        
        {/* Judgments Section */}
        <TabsContent value="judgments" className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Judgments</h3>
          {judgments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {judgments.map((judgment: Judgment, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{judgment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judgment.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{judgment.summary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judgment.issuedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No judgments available for this case.</p>
          )}
        </TabsContent>
        
        {/* Next Hearing Date Section */}
        {nextHearingDate && (
          <TabsContent value="next-hearing" className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Next Hearing Details</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Calendar className="h-8 w-8 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{nextHearingDate}</h4>
                    <p className="text-sm text-gray-600">Next scheduled court appearance</p>
                  </div>
                </div>
                
                {/* Find the upcoming hearing from hearings array */}
                {hearings.length > 0 && hearings.find(h => h.status === 'Scheduled') && (
                  <div className="bg-white rounded-md p-4 shadow-sm w-full md:w-auto">
                    {(() => {
                      const upcomingHearing = hearings.find(h => h.status === 'Scheduled');
                      return upcomingHearing ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{upcomingHearing.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Courtroom: {upcomingHearing.courtroom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gavel className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Purpose: {upcomingHearing.purpose}</span>
                          </div>
                        </div>
                      ) : null;
                    })()} 
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
