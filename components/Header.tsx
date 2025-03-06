import React from "react";
import { Gavel } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
       <Link href={"/Search"}>
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => {}}
        >
          <Gavel className="h-6 w-6 text-indigo-700 mr-2" />
          <span className="text-xl font-semibold text-gray-900">JusticeLens</span>
        </div>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-indigo-700 transition-colors">Features</a>
          <a href="#benefits" className="text-gray-600 hover:text-indigo-700 transition-colors">Benefits</a>
          <a href="#search" className="text-gray-600 hover:text-indigo-700 transition-colors">Search Cases</a>
        </nav>
      </div>
    </header>
  );
}
