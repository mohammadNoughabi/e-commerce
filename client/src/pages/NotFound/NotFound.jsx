import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark-blue mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-black mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-light-gray mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-accent-orange rounded-lg hover:bg-dark-blue hover:text-accent-orange transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
