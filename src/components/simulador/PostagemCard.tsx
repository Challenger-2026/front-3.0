import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FiFlag } from 'react-icons/fi';
import type { MotivoDenuncia, Postagem, StatusValidacao } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../data/categorias';
import { MOTIVOS_DENUNCIA, postagemRemovida, prioridadeDenuncia } from '../../data/moderacao';
import { formatarPontos } from '../../utils/formatadores';

type PostagemCardProps = {
  postagem: Postagem;
  nomeAutor?: string;
  nomeComunidade?: string;
};

type FormDenuncia = {
  motivo: MotivoDenuncia;
  detalhe: string;
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

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#4F46E5]';

export default function PostagemCard({ postagem, nomeAutor = 'Usuário', nomeComunidade }: PostagemCardProps) {
  const { usuario, denuncias, revisoesDenuncia, denunciar } = useSimulador();
  const [denunciando, setDenunciando] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormDenuncia>({
    defaultValues: { motivo: MOTIVOS_DENUNCIA[0], detalhe: '' },
  });

  const categoria = buscarCategoriaPorPontos(postagem.ptGerado);

  // Demonstração: denúncia procedente tira a publicação do feed (na API ela continua aprovada)
  if (postagemRemovida(postagem.id, revisoesDenuncia)) {
    return (
      <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-4 text-sm text-slate-500">
        Publicação removida pela moderação da Soul Up após revisão de denúncias.
      </article>
    );
  }

  const recebidas = denuncias.filter((d) => d.idPostagem === postagem.id);
  const propria = usuario?.id === postagem.idUsuario;
  const jaDenunciou = recebidas.some((d) => d.idUsuario === usuario?.id);

  const enviar: SubmitHandler<FormDenuncia> = (dados) => {
    denunciar(postagem.id, dados.motivo, dados.detalhe.trim());
    reset();
    setDenunciando(false);
  };

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

      {recebidas.length > 0 && (
        <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {recebidas.length} denúncia(s) · prioridade {prioridadeDenuncia(recebidas.length)} na revisão da moderação
        </p>
      )}

      {usuario && (
        <div className="mt-3">
          {propria ? (
            <span className="text-xs font-semibold text-slate-500">Sua publicação</span>
          ) : (
            <button
              type="button"
              onClick={() => setDenunciando((aberto) => !aberto)}
              disabled={jaDenunciou}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 cursor-pointer hover:text-red-600 disabled:cursor-default disabled:opacity-50"
            >
              <FiFlag size={14} /> {jaDenunciou ? 'Você já denunciou' : 'Denunciar'}
            </button>
          )}
        </div>
      )}

      {denunciando && !jaDenunciou && !propria && (
        <form
          onSubmit={handleSubmit(enviar)}
          noValidate
          className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <label htmlFor={`denuncia-motivo-${postagem.id}`} className="block text-xs font-semibold">
            Por que esta publicação é falsa ou indevida?
          </label>
          <select id={`denuncia-motivo-${postagem.id}`} className={classeCampo} {...register('motivo')}>
            {MOTIVOS_DENUNCIA.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
          <textarea
            rows={2}
            placeholder="Detalhe opcional para ajudar a moderação"
            aria-label="Detalhe da denúncia"
            className={`${classeCampo} resize-none`}
            {...register('detalhe')}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-red-600 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            Enviar denúncia
          </button>
          <p className="text-[11px] text-slate-500">Demonstração: a denúncia fica só nesta sessão do simulador.</p>
        </form>
      )}
    </article>
  );
}