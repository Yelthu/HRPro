// src/components/PaginatedTable.js
import React, { useState } from 'react';

const PaginatedTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key} className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="py-2 px-4 border-b border-gray-200">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map(num => (
          <button
            key={num}
            onClick={() => handleClick(num + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedTable;