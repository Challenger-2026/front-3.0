import { useState } from 'react';

export interface CardMiniProps {
  titulo: string;
  descricao: string;
}

export default function CardMini({ titulo, descricao }: CardMiniProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <article 
      className="relative w-full h-[320px] bg-transparent cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      
      <div 
        className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] rounded-3xl shadow-sm hover:shadow-lg ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        
        <div className="absolute inset-0 w-full h-full bg-white border border-[#ead9b6]/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
          <h3 className="text-2xl font-extrabold text-stone-900 mb-6">
            {titulo}
          </h3>
          
          <div className="text-sm font-bold text-[#D35400] flex items-center gap-2 opacity-60">
            Ver detalhes <span className="text-xl">↻</span>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full bg-[#fffaf5] border border-orange-200/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed overflow-y-auto">
            {descricao}
          </p>
        </div>

      </div>
      
    </article>
  );
}