import React from 'react';

export const CharacterCard = ({ character, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border-4 border-black rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-orange-500 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full min-h-[320px]"
    >
      <div className="flex flex-col items-center flex-1">
        <div className="w-full h-40 flex items-center justify-center mb-3 overflow-hidden">
          <img 
            src={character.image} 
            alt={character.name} 
            className="h-full object-contain transition-transform duration-500 group-hover:translate-x-8 group-hover:scale-110"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'Sin Imagen';
            }}
          />
        </div>
        
        <div className="text-center w-full flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-lg uppercase italic group-hover:text-white transition-colors line-clamp-2 mb-2">
              {character.name}
            </h3>
            
            {/* Status badge */}
            <div className={`inline-block px-3 py-1 rounded-full border-2 border-black font-black text-xs mb-2 ${character.status === 'Alive' ? 'bg-green-400 text-black' : 'bg-red-400 text-white'}`}>
              {character.status === 'Alive' ? '🟢 VIVO' : '⚫ MUERTO'}
            </div>
          </div>
          
          <div className="text-xs space-y-1 mt-2">
            <p className="font-bold text-gray-700 group-hover:text-orange-100 line-clamp-2">
              {character.occupation}
            </p>
            {character.age && (
              <p className="font-bold text-gray-600 group-hover:text-orange-100">
                Edad: {character.age}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};