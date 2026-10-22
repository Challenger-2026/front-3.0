import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AcaoDenuncia, Denuncia, Postagem, PrioridadeDenuncia } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { denunciasNaFila, prioridadeDenuncia } from '../../../data/moderacao';
import { regrasParecer } from '../../../utils/validacoes';

const coresPrioridade: Record<PrioridadeDenuncia, string> = {
  Crítica: 'border-red-200 bg-red-50 text-red-600',
  Alta: 'border-amber-200 bg-amber-50 text-amber-700',
  Normal: 'border-slate-200 bg-slate-100 text-slate-500',
};

type ItemDenunciaProps = {
  postagem: Postagem;
  recebidas: Denuncia[];
  aberta: boolean;
  alternar: () => void;
  decidir: (acao: AcaoDenuncia, parecer: string) => void;
};

type FormParecer = { parecer: string };

function ItemDenuncia({ postagem, recebidas, aberta, alternar, decidir }: ItemDenunciaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormParecer>({ defaultValues: { parecer: '' } });

  const prioridade = prioridadeDenuncia(recebidas.length);

  // Os dois botões usam o mesmo formulário: muda só a ação
  const decidirCom = (acao: AcaoDenuncia) => handleSubmit((dados) => decidir(acao, dados.parecer.trim()));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${coresPrioridade[prioridade]}`}>
          Prioridade {prioridade} · {recebidas.length} denúncia(s)
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
          Aprovado
        </span>
      </div>

      <p className={`mt-3 text-sm ${aberta ? '' : 'line-clamp-2'}`}>{postagem.ctTexto}</p>
      <p className="mt-1 text-xs text-slate-500">
        Postagem #{postagem.id} · Autor oculto para garantir uma avaliação imparcial.
      </p>

      {!aberta ? (
        <button
          type="button"
          onClick={alternar}
          className="mt-3 w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
        >
          Abrir postagem denunciada
        </button>
      ) : (
        <form noValidate className="mt-3 space-y-3">
          {postagem.ctUrl && (
            <a
              href={postagem.ctUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-all rounded-xl bg-slate-100 px-3 py-2 text-xs text-[#4F46E5] underline"
            >
              Evidência: {postagem.ctUrl}
            </a>
          )}

          <ul className="space-y-1.5">
            {recebidas.map((d) => (
              <li key={d.id} className="rounded-xl bg-slate-100 px-3 py-2 text-xs">
                <strong className="font-bold">{d.motivo}</strong>
                {d.detalhe && <span className="block text-slate-500">{d.detalhe}</span>}
              </li>
            ))}
          </ul>

          <div>
            <label htmlFor={`parecer-${postagem.id}`} className="mb-1 block text-xs font-bold">
              Parecer da moderação
            </label>
            <textarea
              id={`parecer-${postagem.id}`}
              rows={2}
              placeholder="Parecer da moderação sobre as denúncias"
              aria-invalid={errors.parecer ? 'true' : 'false'}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#4F46E5]"
              {...register('parecer', regrasParecer)}
            />
            {errors.parecer && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.parecer.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={decidirCom('MANTER')}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
          >
            Manter publicação (improcedente)
          </button>
          <button
            type="button"
            onClick={decidirCom('REMOVER')}
            className="w-full rounded-full bg-red-600 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            Remover publicação (procedente)
          </button>
          <p className="text-[11px] text-slate-500">
            Manter = denúncia improcedente. Remover = denúncia procedente; a publicação sai do feed.
          </p>
        </form>
      )}
    </article>
  );
}

export default function TelaDenuncias() {
  const { usuario, postagens, denuncias, revisoesDenuncia, minhasComunidades, revisarDenuncias, voltar } = useSimulador();
  const [aberta, setAberta] = useState<number | null>(null);
  const [aviso, setAviso] = useState('');

  if (!usuario) return null;

  if (usuario.tipoPerfil !== 'MODERADOR') {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Denúncias</p>
        <h1 className="text-xl font-bold leading-snug">A revisão de denúncias é exclusiva para moderadores.</h1>
      </div>
    );
  }

  const fila = denunciasNaFila(
    postagens,
    denuncias,
    revisoesDenuncia,
    usuario.id,
    minhasComunidades.map((c) => c.id),
  );

  const decidir = (idPostagem: number, acao: AcaoDenuncia, parecer: string) => {
    revisarDenuncias(idPostagem, acao, parecer);
    setAberta(null);
    setAviso(`Parecer registrado. Postagem #${idPostagem} ${acao === 'MANTER' ? 'mantida' : 'removida do feed'}.`);
  };

  return (
    <>
      {aviso && (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <span role="status">{aviso}</span>
          <button type="button" aria-label="Fechar" onClick={() => setAviso('')} className="cursor-pointer text-slate-500">
            ✕
          </button>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Denúncias</p>
        <h1 className="text-xl font-bold leading-snug">Publicações sinalizadas, na fila global da Soul Up.</h1>
      </div>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
        Demonstração: a API ainda não tem denúncias. A decisão vale só nesta sessão do simulador.
      </p>

      <p className="text-sm text-slate-500">
        {fila.length} publicação(ões) na fila, ordenadas pelo volume de denúncias recebidas.
      </p>

      <div className="space-y-3">
        {fila.map(({ postagem, recebidas }) => (
          <ItemDenuncia
            key={postagem.id}
            postagem={postagem}
            recebidas={recebidas}
            aberta={aberta === postagem.id}
            alternar={() => setAberta(aberta === postagem.id ? null : postagem.id)}
            decidir={(acao, parecer) => decidir(postagem.id, acao, parecer)}
          />
        ))}

        {fila.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma denúncia pendente. A comunidade está em dia.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={voltar}
        className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
      >
        Voltar para a fila de moderação
      </button>
    </>
  );
}