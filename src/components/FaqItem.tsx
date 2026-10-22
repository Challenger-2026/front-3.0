export interface FaqItemProps {
  indice: number;
  pergunta: string;
  resposta: string;
  estaAberto: boolean;
  aoAlternar: () => void;
}

export default function FaqItem({ pergunta, resposta, estaAberto, aoAlternar }: FaqItemProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 w-full transition-all duration-300 ${
        estaAberto ? 'border-l-4 border-l-[#D35400] shadow-md' : 'hover:shadow-md'
      }`}
    >
      <button
        onClick={aoAlternar}
        className="w-full text-left focus:outline-none flex justify-between items-center group"
        aria-expanded={estaAberto}
      >
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D35400] transition-colors pr-4">
          {pergunta}
        </h3>
        
        <span 
          className={`text-[#D35400] flex-shrink-0 transition-transform duration-300 ${
            estaAberto ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          estaAberto ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-stone-600 text-sm leading-relaxed">{resposta}</p>
      </div>
    </div>
  );
}