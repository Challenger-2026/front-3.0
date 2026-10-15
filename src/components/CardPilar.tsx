export interface CardPilarProps {
  icone: string;
  titulo: string;
  descricao: string;
}

export default function CardPilar({ icone, titulo, descricao }: CardPilarProps) {
  return (
    <article className="bg-white rounded-2xl shadow-md border-t-4 border-[#D35400] p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span className="text-4xl mb-5 select-none" aria-hidden="true">
        {icone}
      </span>
      <h3 className="text-xl font-bold text-stone-900 mb-4">{titulo}</h3>
      <p className="text-stone-600 text-sm leading-relaxed">{descricao}</p>
    </article>
  );
}