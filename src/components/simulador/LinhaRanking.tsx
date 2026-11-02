import type { ParticipanteRanking } from '../../types/types';
import { formatarPontos } from '../../utils/formatadores';

type LinhaRankingProps = {
  posicao: number; // começa em 1
  participante: ParticipanteRanking;
  cor?: string; // classes de borda e fundo (zonas da liga, linha do distintivo)
};

// Uma linha do ranking: posição, @username e pontos (o usuário logado ganha destaque)
export default function LinhaRanking({ posicao, participante, cor }: LinhaRankingProps) {
  const classeCor = cor ?? (participante.eu ? 'border-[#4F46E5]/30 bg-[#4F46E5]/5' : 'border-slate-200 bg-white');

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm ${classeCor} ${
        participante.eu ? 'ring-2 ring-[#4F46E5]/40' : ''
      }`}
    >
      <span className="w-7 text-center text-base font-extrabold text-[#4F46E5]">{posicao}º</span>
      <p className="min-w-0 flex-1 truncate text-sm font-bold">
        @{participante.username}
        {participante.eu && <span className="ml-1 text-[11px] font-semibold text-[#4F46E5]">(você)</span>}
      </p>
      <span className="shrink-0 text-sm font-extrabold">{formatarPontos(participante.pontos)} pts</span>
    </li>
  );
}