import React from 'react';


export const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="bg-[#FFD90F] border-b-4 border-black shadow-lg">
      <div className="container mx-auto px-4 py-4">
        
        <div className="mb-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black m-0">
            Simpson API
          </h1>
          <p className="text-sm font-bold text-gray-800 italic m-0 mt-1">
            Explora el mundo de Springfield
          </p>
        </div>

        
        <div className="flex justify-center">
          <input 
            type="text" 
            placeholder="¿A quién buscas en Springfield?..." 
            className="w-full max-w-md px-4 py-2 rounded-full border-2 border-black font-bold outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </header>
  );
};
