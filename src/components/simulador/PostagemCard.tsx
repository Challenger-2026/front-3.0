import type { Postagem, StatusValidacao } from '../../types/types';
import { buscarCategoriaPorPontos } from '../../data/categorias';
import { formatarPontos } from '../../utils/formatadores';

type PostagemCardProps = {
  postagem: Postagem;
  nomeAutor?: string;
  nomeComunidade?: string;
};

const coresStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROVADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJEITADO: 'bg-red-50 text-red-600 border-red-200',
};

const nomesStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export default function PostagemCard({ postagem, nomeAutor = 'Usuário', nomeComunidade }: PostagemCardProps) {
  const categoria = buscarCategoriaPorPontos(postagem.ptGerado);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4F46E5]/10 text-sm font-bold text-[#4F46E5]">
            {nomeAutor.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-bold">{nomeAutor}</p>
            {nomeComunidade && <p className="text-[11px] text-slate-500">{nomeComunidade}</p>}
          </div>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${coresStatus[postagem.stValidacao]}`}>
          {nomesStatus[postagem.stValidacao]}
        </span>
      </div>

      <p className="mt-3 text-sm">{postagem.ctTexto}</p>

      <p className="mt-2 text-xs text-slate-500">
        {categoria?.nome}
        {postagem.stValidacao === 'APROVADO' && ` · +${formatarPontos(postagem.ptGerado)} pts`}
      </p>
    </article>
  );
}