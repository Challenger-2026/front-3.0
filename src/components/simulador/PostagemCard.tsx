import type { Postagem } from '../../types/types';
import { buscarCategoria } from '../../data/categorias';
import { formatarData, formatarPontos } from '../../utils/formatadores';

type PostagemCardProps = {
  postagem: Postagem;
  nomeComunidade?: string;
};

const coresStatus = {
  Pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  Aprovado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejeitado: 'bg-red-50 text-red-600 border-red-200',
};

export default function PostagemCard({ postagem, nomeComunidade }: PostagemCardProps) {
  const categoria = buscarCategoria(postagem.categoriaId ?? postagem.categoriaSelecionada);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4F46E5]/10 text-sm font-bold text-[#4F46E5]">
            {postagem.autorNome.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-bold">{postagem.autorNome}</p>
            <p className="text-[11px] text-slate-500">
              {formatarData(postagem.criadaEm)}
              {nomeComunidade && ` · ${nomeComunidade}`}
            </p>
          </div>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${coresStatus[postagem.status]}`}>
          {postagem.status}
        </span>
      </div>

      <p className="mt-3 text-sm">{postagem.conteudo}</p>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          {categoria?.nome}
          {postagem.status === 'Aprovado' && ` · +${formatarPontos(postagem.pontos)} pts`}
        </span>
        {postagem.validado && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            ✓ Validado
          </span>
        )}
      </div>
    </article>
  );
}