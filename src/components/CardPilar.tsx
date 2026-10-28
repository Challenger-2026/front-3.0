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
      className="group relative w-full h-[380px] rounded-3xl overflow-hidden cursor-pointer bg-stone-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      <img
        src={imagem}
        alt={titulo}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
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

      <div
        aria-hidden={!ativo}
        className={`absolute inset-0 bg-white p-6 md:p-8 flex flex-col justify-center gap-4 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          ativo ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <h3 className="text-2xl font-extrabold text-[#D35400]">
          {titulo}
        </h3>
        <p className="text-stone-700 text-sm md:text-base leading-relaxed">
          {descricao}
        </p>
        <button
          tabIndex={ativo ? 0 : -1}
          className="self-start px-6 py-2 mt-2 rounded-full border border-[#D35400] text-[#D35400] text-sm font-bold hover:bg-[#D35400] hover:text-white transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Fechar detalhes
        </button>
      </div>
    </article>
  );
}