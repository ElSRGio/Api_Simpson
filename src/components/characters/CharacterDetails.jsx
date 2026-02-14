import React from 'react';

export const CharacterDetails = ({ character }) => {
  if (!character) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border-4 border-black rounded-full p-3 mb-4 shadow-xl">
        <img 
            src={character.image} 
            alt={character.name} 
            className="w-32 h-32 object-contain"
        />
      </div>
      
      <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter">
        {character.name}
      </h1>
      
      <div className={`px-5 py-1 rounded-full border-4 border-black font-black mb-4 text-sm ${character.status === 'Alive' ? 'bg-green-500' : 'bg-red-500'}`}>
        {character.status.toUpperCase()}
      </div>

      <div className="w-full space-y-3 bg-white/50 p-5 rounded-2xl border-4 border-black">
        <div className="flex justify-between border-b-2 border-black/20 pb-1 font-bold text-sm">
            <span>OCUPACIÓN:</span>
            <span className="italic">{character.occupation}</span>
        </div>
        
        <div className="flex justify-between border-b-2 border-black/20 pb-1 font-bold text-sm">
            <span>EDAD:</span>
            <span>{character.age || "???"}</span>
        </div>

        <div className="flex justify-between border-b-2 border-black/20 pb-1 font-bold text-sm">
            <span>CUMPLEAÑOS:</span>
            <span>{character.birthday || "Desconocido"}</span>
        </div>

        <div className="mt-3 text-xs italic font-medium">
            <h3 className="text-sm font-black mb-2 italic">FRASES:</h3>
            {character.phrases?.length > 0 ? (
                <ul className="space-y-1">
                    {character.phrases.slice(0, 3).map((p, i) => (
                        <li key={i} className="bg-white p-2 rounded-lg border-2 border-black text-xs">"{p}"</li>
                    ))}
                </ul>
            ) : <p className="text-xs">No hay frases registradas.</p>}
        </div>
      </div>
    </div>
  );
};