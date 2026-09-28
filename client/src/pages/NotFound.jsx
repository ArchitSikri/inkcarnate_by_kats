import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 text-center">
      <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mt-2 mb-6">
        The route you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg"
      >
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFound;
