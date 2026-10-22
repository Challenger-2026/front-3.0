import { useState } from 'react';

export interface EtapaRoadmap {
  numero: number;
  titulo: string;
  descricao: string;
}

export default function TimelineItem({ numero, titulo, descricao }: EtapaRoadmap) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative pl-10 sm:pl-12 w-full">
      
      <button
        onClick={() => setAberto(!aberto)}
        className="absolute left-0 top-6 w-8 h-8 rounded-full bg-[#D35400] text-white font-bold flex items-center justify-center -translate-x-1/2 z-10 hover:scale-110 transition-transform cursor-pointer shadow-md focus:outline-none"
        aria-expanded={aberto}
      >
        {numero}
      </button>

      <div 
        className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 w-full transition-all duration-300 ${aberto ? 'border-l-4 border-l-[#D35400] shadow-md' : 'hover:shadow-md'}`}
      >
        <button
          onClick={() => setAberto(!aberto)}
          className="w-full text-left focus:outline-none flex justify-between items-center group"
        >
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D35400] transition-colors">
            {titulo}
          </h3>
          <span className={`text-[#D35400] text-sm transition-transform duration-300 ${aberto ? 'rotate-180' : 'rotate-0'}`}>
            ▼
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            aberto ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-stone-600 text-sm leading-relaxed">{descricao}</p>
        </div>
      </div>
      
    </div>
  );
}