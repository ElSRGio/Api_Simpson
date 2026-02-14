import React from 'react';

export const Header = ({ searchTerm, onSearchChange, onSearchFocus, characters }) => {
  return (
    <header className="relative z-40 bg-[#FFD90F] border-b-8 border-black shadow-lg">
      <div className="flex flex-col p-4 gap-2">
        {/* FILA SUPERIOR: TÍTULO Y NAVEGACIÓN - MISMA ALTURA */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-black m-0 p-0">
              Simpson API
            </h1>
            <p className="text-xs font-bold text-gray-800 italic m-0 p-0 leading-none">
              Explora el mundo de Springfield
            </p>
          </div>

          {/* ENLACES DE NAVEGACIÓN - DERECHA */}
          <nav className="flex gap-2 text-xs font-bold flex-shrink-0">
            <a href="#personajes" className="px-3 py-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform whitespace-nowrap">
              Personajes
            </a>
            <a href="#about" className="px-3 py-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform whitespace-nowrap">
              Sobre
            </a>
            <a href="#contact" className="px-3 py-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform whitespace-nowrap">
              Contacto
            </a>
          </nav>
        </div>

        {/* FILA INFERIOR: BUSCADOR EN CENTRO */}
        <div className="flex justify-center w-full pt-1">
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="¿A quién buscas en Springfield?..." 
              className="search-input w-full p-3 rounded-2xl border-4 border-black font-black outline-none placeholder:text-gray-500 text-sm"
              value={searchTerm}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
