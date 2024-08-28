import React from 'react';
import telectity from '../asset/Telecity_Transparent.png'

const Card = ({ title, onClick }) => {
  return (
    <div
      className="max-w-sm rounded overflow-hidden shadow-lg bg-green-200 cursor-pointer hover:bg-gray-300 transition duration-300"
      onClick={onClick}
    >
      <div className="px-6 py-4 m-5">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          {/* Placeholder for chart data */}
          <img srcset={telectity} alt="Chart" className='h-20 w-auto rounded-lg mx-auto' /> 
        </p>
      </div>
    </div>
  );
};

export default Card;
