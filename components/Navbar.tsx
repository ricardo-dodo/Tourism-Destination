import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-colors">
          Tourism Recommendation
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors">
            Dashboard
          </Link>
          <Link href="/recommend" className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Get Recommendations
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;