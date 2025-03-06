"use client"
import React from "react";
import  Link  from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { FeatureCard } from "@/components/FeatureCard";
import { Search, FileText, Scale, Clock, Eye, Shield } from "lucide-react";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Simplified Access to <span className="text-indigo-700">Court Records</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                JusticeLens provides automatic court case information retrieval from the Northeast court portal without manual CAPTCHA entry.
              </p>
              <Link href="/Search">
              <Button 
                variant="ghost"
                size="lg"
                onClick={()=>{}}
                className="font-medium"
              >
                Start Searching Cases
              </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <Scale className="h-6 w-6" />
                </div>
                <div className="space-y-6">
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold mb-1">Court Name</h3>
                    <p className="font-medium">Northeast District Court</p>
                  </div>
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold mb-1">Case Type</h3>
                    <p className="font-medium">Civil</p>
                  </div>
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold mb-1">Case Number</h3>
                    <p className="font-medium">12345</p>
                  </div>
                  <div className="">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold mb-1">Case Year</h3>
                    <p className="font-medium">2023</p>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center">
                    <div className="bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1">
                      Next Hearing: 15 Apr 2025
                    </div>
                    <div className="text-indigo-700 text-sm font-medium">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Case Search Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              JusticeLens simplifies the process of accessing court information through innovative technology and user-centered design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Search}
              title="Automated CAPTCHA Solving"
              description="Our system automatically handles CAPTCHA verification, eliminating manual entry and streamlining the search process."
            />
            
            <FeatureCard 
              icon={FileText}
              title="Complete Case Details"
              description="Access comprehensive information including case history, hearing details, orders, judgments, and upcoming dates."
            />
            
            <FeatureCard 
              icon={Clock}
              title="Real-time Updates"
              description="Get the most current information with our system that regularly refreshes data from the court portal."
            />
            
            <FeatureCard 
              icon={Eye}
              title="Easy Monitoring"
              description="Track cases of interest with a simple interface that highlights important events and deadlines."
            />
            
            <FeatureCard 
              icon={Shield}
              title="Secure & Private"
              description="All searches and data retrievals are conducted with the highest standards of security and privacy protection."
            />
            
            <FeatureCard 
              icon={Scale}
              title="Legal Accuracy"
              description="Our system ensures the accuracy of information by directly sourcing from official court records."
            />
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-indigo-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits for Legal Professionals & Citizens</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              JusticeLens serves both legal professionals and citizens, providing value through efficient access to court information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Legal Professionals</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Time Efficiency:</span> Reduce hours spent on manual case lookups and CAPTCHA entry.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Case Management:</span> Easily track multiple cases and stay updated on proceedings.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Client Service:</span> Provide faster updates and more detailed information to clients.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Resource Allocation:</span> Focus more on case strategy rather than administrative tasks.</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Citizens</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Accessibility:</span> Easy access to case information without technical barriers.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Transparency:</span> Greater visibility into the judicial process and case progress.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Self-representation:</span> Better tools for those navigating the legal system without an attorney.</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-700 text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Information Equity:</span> Democratizes access to court information for all citizens.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="search" className="py-16 md:py-24 bg-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-indigo-700 text-white rounded-xl px-8 py-12 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Access Court Information?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Start searching for case details with our automated system that handles CAPTCHA verification for you.
            </p>
            <Link href={"/Search"}>
            <Button 
              variant="outline" 
              size="lg"
              onClick={()=>{}}
              className="bg-white text-indigo-700 hover:bg-gray-100 font-medium"
            >
              Start Case Search Now
            </Button>
            </Link>
            <p className="mt-6 text-sm opacity-80">
              No account required. Simple and efficient access to court information.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
