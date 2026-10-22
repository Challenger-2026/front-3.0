export interface CardMiniProps {
  icone: React.ReactNode;
  titulo: string;
  descricao: string;
}

export default function CardMini({ icone, titulo, descricao }: CardMiniProps) {
  return (
    <div className="group w-full h-full [perspective:1000px] cursor-pointer">
      
      <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] grid">
        
        <article className="[grid-area:1/1] [backface-visibility:hidden] bg-white rounded-2xl p-8 shadow-sm border-b-4 border-[#D35400] border-t border-l border-r border-stone-100 flex flex-col items-center justify-center text-center">
          <span className="text-6xl mb-6 drop-shadow-sm" aria-hidden="true">{icone}</span>
          <h3 className="text-2xl font-bold text-stone-900 mb-2">{titulo}</h3>
          
          <span className="mt-4 text-[10px] font-bold text-[#D35400] uppercase tracking-widest animate-pulse flex items-center gap-2">
            Passe o mouse
          </span>
        </article>

        <article className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#D35400] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-orange-400/50 pb-2 w-full">{titulo}</h3>
          <p className="text-orange-50 text-sm leading-relaxed">
            {descricao}
          </p>
        </article>

      </div>
      
    </div>
  );
}