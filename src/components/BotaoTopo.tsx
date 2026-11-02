import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function BotaoTopo() {
  const [visivel, setVisivel] = useState(false);
  const location = useLocation();
  const noSimulador = location.pathname.startsWith('/simulador');

  useEffect(() => {
    const verificarScroll = () => {
      if (window.scrollY > 300) {
        setVisivel(true);
      } else {
        setVisivel(false);
      }
    };

    window.addEventListener('scroll', verificarScroll);
    return () => window.removeEventListener('scroll', verificarScroll);
  }, []);

  const rolarParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  if (!visivel || noSimulador) return null;

  return (
    <button
      onClick={rolarParaTopo}
      aria-label="Voltar ao topo da página"
      className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#D35400] hover:bg-[#b84500] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center animate-fade-in"
    >
      <FaArrowUp className="text-base" />
    </button>
  );
}