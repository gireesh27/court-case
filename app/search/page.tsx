
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaseSearch } from "@/components/CaseSearch";
export default function Search() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12 mt-16">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Search</h1>
          <p className="text-gray-600 mb-8">
            Enter the details below to search for case information from the Northeast court portal.
          </p>
         <CaseSearch/>
        </div>
      </main>
      <Footer />
    </div>
  );
}
