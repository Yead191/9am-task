import React from "react";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="mt-3 text-lg font-bold text-blue-500 animate-pulse">
        Please Wait...
      </div>
    </div>
  );
};

export default Spinner;
