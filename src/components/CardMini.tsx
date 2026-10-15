export interface CardMiniProps {
  icone: string;
  titulo: string;
  descricao: string;
}

export default function CardMini({ icone, titulo, descricao }: CardMiniProps) {
  return (
    <article className="bg-white rounded-xl shadow-md border-t-4 border-[#D35400] p-8 flex flex-col text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span className="text-3xl mb-6 select-none" aria-hidden="true">
        {icone}
      </span>
      <h3 className="text-xl font-bold text-stone-900 mb-4">{titulo}</h3>
      <p className="text-stone-700 text-sm leading-relaxed flex-1">{descricao}</p>
    </article>
  );
}