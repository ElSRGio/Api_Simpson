import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t-8 border-[#FFD90F] text-white">
      <div className="flex flex-col items-center justify-center p-3 gap-1">
        <div className="text-center">
          <h2 className="text-sm font-black italic uppercase tracking-tighter text-[#FFD90F] leading-none">
            Simpson API
          </h2>
          <p className="text-xs font-bold text-gray-300 leading-none">
            Explora el universo de Los Simpson
          </p>
        </div>

        {/* ENLACES DE PIE DE PÁGINA */}
        <nav className="flex gap-2 text-xs font-bold flex-wrap justify-center">
          <a href="#privacy" className="hover:text-[#FFD90F] transition-colors">
            Privacidad
          </a>
          <span className="text-gray-500">|</span>
          <a href="#terms" className="hover:text-[#FFD90F] transition-colors">
            Términos
          </a>
          <span className="text-gray-500">|</span>
          <a href="#sitemap" className="hover:text-[#FFD90F] transition-colors">
            Sitemap
          </a>
        </nav>

        <div className="border-t-2 border-[#FFD90F] pt-1 text-center w-full">
          <p className="text-xs font-bold leading-none">
            © {currentYear} Simpson API. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
