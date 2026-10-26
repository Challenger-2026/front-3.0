export interface CardPilarProps {
  imagem: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  onClick: () => void;
}

export default function CardPilar({ imagem, titulo, descricao, ativo, onClick }: CardPilarProps) {
  return (
    <article
      onClick={onClick}
      className={`group relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col md:flex-row bg-white ${
        ativo ? 'border border-[#ead9b6]/60 min-h-[350px]' : 'border-0 h-[380px]'
      }`}
    >
      <div className={`relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shrink-0 ${
        ativo ? 'w-full md:w-[45%] h-[250px] md:h-auto' : 'w-full h-full md:w-full'
      }`}>
        <img
          src={imagem}
          alt={titulo}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
            ativo ? 'scale-100' : 'group-hover:scale-105'
          }`}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
          ativo ? 'opacity-40' : 'opacity-90 group-hover:opacity-100'
        }`}></div>

        <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20 transition-opacity duration-300 ${
          ativo ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-wide transition-transform duration-500 group-hover:-translate-y-2">
            {titulo}
          </h3>
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
            <div className="overflow-hidden flex items-end justify-between gap-4">
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed line-clamp-2 pb-2">
                {descricao}
              </p>
              
              <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 shrink-0 shadow-lg">
                &rarr;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        ativo ? 'w-full md:w-[55%] opacity-100 p-6 md:p-10 max-h-[800px]' : 'w-0 opacity-0 p-0 max-h-0 md:max-h-full'
      }`}>
        <div className="w-full min-w-[250px] flex flex-col gap-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] mb-2">
            {titulo}
          </h3>
          <p className="text-stone-700 text-sm md:text-base leading-relaxed">
            {descricao}
          </p>
          <button
            className="self-start px-6 py-2 mt-4 rounded-full border border-[#D35400] text-[#D35400] text-sm font-bold hover:bg-[#D35400] hover:text-white transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Fechar detalhes
          </button>
        </div>
      </div>
      
    </article>
  );
}