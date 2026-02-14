import React from 'react';


export const CharacterCard = ({ character, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border-2 border-black rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center p-4">
        <img 
          src={character.image} 
          alt={character.name}
          className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x600?text=No+Image';
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col bg-white border-t-2 border-black">
        <h3 className="font-black text-lg uppercase italic line-clamp-1 mb-1">
          {character.name}
        </h3>
        <p className="text-xs font-bold text-gray-600 line-clamp-1 mb-3">
          {character.occupation}
        </p>
        
        <div className="mt-auto">
          <span className={`text-[10px] font-black px-2 py-1 rounded-full border border-black ${
            character.status === 'Alive' ? 'bg-green-400' : 'bg-red-400'
          }`}>
            {character.status === 'Alive' ? '• VIVO' : '• DIFUNTO'}
          </span>
        </div>
      </div>
    </div>
  );
};