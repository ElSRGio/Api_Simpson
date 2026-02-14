import React, { useState, useEffect } from 'react';
import { getCharacters } from '../services/api';
import { CharacterCard } from '../components/characters/CharacterCard';
import { CharacterDetails } from '../components/characters/CharacterDetails';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';


export const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    getCharacters()
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  
  const filtered = characters.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#42AAFF] flex flex-col">
      
      <div className="sticky top-0 z-40 shadow-lg">
        <Header 
          searchTerm={searchTerm} 
          onSearchChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64 font-black text-white text-2xl animate-pulse">
            CARGANDO SPRINGFIELD...
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filtered.map(char => (
              <CharacterCard 
                key={char.id} 
                character={char} 
                onClick={() => setSelected(char)} 
              />
            ))}
          </div>
        )}
      </main>

      
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-6 rounded-3xl max-w-md w-full relative">
            <button 
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black w-10 h-10 rounded-full font-black hover:scale-110 transition-transform"
            >
              X
            </button>
            <CharacterDetails character={selected} />
          </div>
        </div>
      )}

      
      <Footer />
    </div>
  );
};