import { useState } from 'react';
import type { IconType } from 'react-icons';

export interface CardMiniProps {
  titulo: string;
  descricao: string;
  frase: string;
  icone: IconType;
}

export default function CardMini({ titulo, descricao, frase, icone: Icone }: CardMiniProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <article 
      className="relative w-full h-[340px] bg-transparent cursor-pointer [perspective:1000px]"
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
          <span className="w-14 h-14 rounded-full bg-orange-100 text-[#D35400] flex items-center justify-center mb-4">
            <Icone className="text-2xl" aria-hidden />
          </span>

          <h3 className="text-2xl font-extrabold text-stone-900 mb-2">
            {titulo}
          </h3>

          <p className="text-sm text-stone-600 leading-relaxed max-w-[240px] mb-5">
            {frase}
          </p>
          
          <div className="text-sm font-bold text-orange-700 flex items-center gap-2">
            Ver detalhes <span className="text-xl">↻</span>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full bg-[#fffaf5] border border-orange-200/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-stone-700 text-sm leading-relaxed">
            {descricao}
          </p>
        </div>

      </div>
      
    </article>
  );
}