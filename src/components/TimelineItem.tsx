import type { TimelineItemProps } from '../types/types';

export default function TimelineItem({ numero, titulo, descricao }: TimelineItemProps) {
  return (
    <div className="relative flex items-start gap-4 sm:gap-6">
      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#D35400] text-white font-bold flex items-center justify-center text-sm sm:text-base flex-shrink-0 z-10 shadow">
        {numero}
      </span>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex-1">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2">
          {titulo}
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          {descricao}
        </p>
      </div>
    </div>
  );
}