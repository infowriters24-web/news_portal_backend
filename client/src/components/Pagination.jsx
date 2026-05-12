// components/SimplePagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // যদি মোট পেজ ১ বা তার কম হয়, কিছু দেখাবো না
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 mb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all
          ${currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#F7941D] hover:text-white hover:border-[#F7941D]'
          }
        `}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`
            w-10 h-10 rounded-md text-sm font-medium transition-all
            ${currentPage === pageNum
              ? 'bg-[#F7941D] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all
          ${currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#F7941D] hover:text-white hover:border-[#F7941D]'
          }
        `}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;