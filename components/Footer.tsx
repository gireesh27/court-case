import React from "react";
import { Gavel } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Gavel className="h-6 w-6 text-indigo-700 mr-2" />
              <span className="text-xl font-semibold text-gray-900">JusticeLens</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
              Simplifying access to Northeast court case information through automated solutions.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Platform</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-700">Search Cases</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-700">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-700">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-700">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} JusticeLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
