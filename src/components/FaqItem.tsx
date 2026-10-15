interface FaqItemProps {
  indice: number;
  pergunta: string;
  resposta: string;
  estaAberto: boolean;
  aoAlternar: () => void;
}

export default function FaqItem({
  indice,
  pergunta,
  resposta,
  estaAberto,
  aoAlternar,
}: FaqItemProps) {
 
  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  return (
    <article
      className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${
        estaAberto
          ? 'border-orange-400 ring-1 ring-orange-200'
          : 'border-stone-200 hover:border-orange-300'
      }`}
    >
      <button
        type="button"
        id={`faq-btn-${indice}`}
        aria-expanded={estaAberto}
        aria-controls={`faq-resp-${indice}`}
        onClick={aoAlternar}
        className={`${efeitoOnda} w-full flex items-center justify-between p-5 text-left font-semibold text-stone-800 hover:text-orange-600 transition-colors cursor-pointer select-none`}
      >
        <span className="text-base pr-4">{pergunta}</span>
        <span
          aria-hidden="true"
          className={`text-2xl font-bold text-orange-600 transition-transform duration-300 inline-block leading-none ${
            estaAberto ? 'rotate-45 text-orange-700' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>

      <div
        id={`faq-resp-${indice}`}
        role="region"
        aria-labelledby={`faq-btn-${indice}`}
        hidden={!estaAberto}
      >
        <div className="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
          <p>{resposta}</p>
        </div>
      </div>
    </article>
  );
}