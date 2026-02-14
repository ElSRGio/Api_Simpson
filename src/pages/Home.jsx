import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { getCharacters } from '../services/api';
import { CharacterCard } from '../components/characters/CharacterCard';
import { CharacterDetails } from '../components/characters/CharacterDetails';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import fondoImage from '../assets/backgrounds/Fondo.jpeg';

const sounds = {
  open: new Howl({ src: ['https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=6616428c-d67d-4523-be93-349f7e912423'] }),
  close: new Howl({ src: ['https://www.myinstants.com/media/sounds/homer-woohoo.mp3'] }),
};

export const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerOpacity, setHeaderOpacity] = useState(1);

  useEffect(() => {
    getCharacters().then(data => {
      setCharacters(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      const maxScroll = 200; // Distancia en pixels para el fade completo
      const opacity = Math.max(0.05, 1 - (scrollTop / maxScroll));
      setHeaderOpacity(opacity);
    };

    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSelect = (char) => {
    setSelected(char);
    setIsModalOpen(true);
    sounds.open.play();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    sounds.close.play();
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-no-repeat bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${fondoImage})` }}>
      {/* FONDO DE SPRINGFIELD FIJO */}
      <div 
        className="fixed inset-0 z-0"
        style={{ backgroundImage: `url(${fondoImage})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 to-black/70"></div>
      </div>

      {/* HEADER FIXED */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 transition-opacity duration-500"
        style={{ 
          opacity: headerOpacity,
          pointerEvents: headerOpacity < 0.3 ? 'none' : 'auto'
        }}
      >
        <Header 
          searchTerm={searchTerm}
          onSearchChange={(e) => {
            setSearchTerm(e.target.value);
            setFiltered(characters.filter(c => c.name.toLowerCase().includes(e.target.value.toLowerCase())));
          }}
          onSearchFocus={() => setSearchActive(true)}
          characters={characters}
        />
      </div>

      {/* CONTENIDO PRINCIPAL SCROLLEABLE - CON PADDING PARA HEADER Y FOOTER */}
      <div className="relative z-10 overflow-y-auto p-6 pt-44 pb-32">
        {/* GRILLA DE PERSONAJES */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 pr-4 custom-scrollbar">
          {filtered?.map((char) => (
            <CharacterCard key={char.id} character={char} onClick={() => handleSelect(char)} />
          ))}
        </div>

        {/* MODAL DE DETALLES DEL PERSONAJE */}
        {isModalOpen && !searchActive && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={handleClose}
          >
            <div 
              className="relative w-full max-w-md bg-[#FFD90F] border-8 border-black rounded-[3rem] p-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] animate-spring overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
                <CharacterDetails character={selected} />
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE RESULTADOS DE BÚSQUEDA */}
        {searchActive && searchTerm && (
          <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={() => {
              setSearchActive(false);
              setSearchTerm('');
              setFiltered(characters);
            }}
          >
            <div 
              className="relative w-full max-w-2xl bg-[#FFD90F] border-8 border-black rounded-[3rem] p-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] animate-spring overflow-y-auto custom-scrollbar max-h-[60vh] overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-black uppercase mb-3 text-center italic text-black">
                Resultados: {filtered.length} personaje{filtered.length !== 1 ? 's' : ''}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered?.map((char) => (
                  <div key={char.id} onClick={() => {
                    handleSelect(char);
                    setSearchActive(false);
                    setSearchTerm('');
                  }}>
                    <CharacterCard character={char} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER FIXED */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
    </div>
  );
};