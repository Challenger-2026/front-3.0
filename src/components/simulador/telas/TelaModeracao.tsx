import { useEffect, useState } from 'react';
import { FiChevronRight, FiEyeOff, FiShield } from 'react-icons/fi';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import {
  DIAS_INATIVIDADE_MODERADOR,
  LIMITE_MODERACOES_DIA,
  denunciasNaFila,
} from '../../../data/moderacao';
import { ehAcessoNegado, mensagemDoErro } from '../../../utils/erros';
import { formatarPontos } from '../../../utils/formatadores';

export default function TelaModeracao() {
  const {
    usuario,
    fila,
    carregarFila,
    abrirAnalise,
    impedidas,
    postagens,
    denuncias,
    revisoesDenuncia,
    minhasComunidades,
    irPara,
  } = useSimulador();
  const [carregando, setCarregando] = useState(true);
  const [semAcesso, setSemAcesso] = useState(false);
  const [erro, setErro] = useState('');

  // GET /moderacoes/fila ao abrir a tela; 403 = não é moderador
  useEffect(() => {
    const buscarFila = async () => {
      try {
        await carregarFila();
        setSemAcesso(false);
        setErro('');
      } catch (err) {
        if (ehAcessoNegado(err)) setSemAcesso(true);
        else setErro(mensagemDoErro(err));
      } finally {
        setCarregando(false);
      }
    };
    buscarFila();
  }, [carregarFila]);

  if (!usuario) return null;

  if (carregando) {
    return <p className="py-10 text-center text-sm text-slate-500">Carregando a fila…</p>;
  }

  // ----- 403: convite para a candidatura -----
  if (semAcesso) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Moderação da Soul Up</p>
          <h1 className="text-xl font-bold leading-snug">A fila de moderação é exclusiva para moderadores.</h1>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
            <FiShield size={20} />
          </span>
          <p className="text-sm text-slate-600">
            Moderadores avaliam às cegas as ações de outras comunidades e ganham 10% dos pontos de cada postagem
            avaliada. Para entrar, faça a candidatura com o questionário.
          </p>
        </div>
        <button
          type="button"
          onClick={() => irPara('candidatura')}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Quero ser moderador
        </button>
      </>
    );
  }

  const pendentes = fila.filter((p) => !impedidas.includes(p.id)).sort((a, b) => b.id - a.id);
  const totalDenunciadas = denunciasNaFila(
    postagens,
    denuncias,
    revisoesDenuncia,
    usuario.id,
    minhasComunidades.map((c) => c.id),
  ).length;

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Moderação da Soul Up</p>
        <h1 className="text-xl font-bold leading-snug">Sua análise faz a comunidade confiar no ranking.</h1>
      </div>

      <p className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-500">
        <FiEyeOff size={16} className="shrink-0" />
        Fila global e às cegas. Postagens das comunidades que você participa não aparecem aqui.
      </p>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
        Demonstração: até {LIMITE_MODERACOES_DIA} moderações por dia; sem moderar por {DIAS_INATIVIDADE_MODERADOR} dias, o
        cargo é perdido.
      </p>

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={() => irPara('denuncias')}
        className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-left cursor-pointer"
      >
        <span className="text-sm font-bold text-red-600">Denúncias</span>
        <span className="shrink-0 text-xs font-semibold text-red-600">{totalDenunciadas} em revisão prioritária →</span>
      </button>

      <button
        type="button"
        onClick={() => irPara('revisoes')}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm cursor-pointer"
      >
        <span className="text-sm font-bold">Fila de contestações</span>
        <span className="shrink-0 text-xs font-semibold text-[#4F46E5]">Revisão de rejeições →</span>
      </button>

      <p className="text-sm text-slate-500">{pendentes.length} postagem(ns) aguardando decisão</p>

      <div className="space-y-3">
        {pendentes.map((p) => {
          const categoria = buscarCategoriaPorPontos(p.ptGerado);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => abrirAnalise(p.id)}
              className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm cursor-pointer"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#4F46E5]">Postagem #{p.id}</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  Pendente
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block text-sm">{p.ctTexto}</span>
              <span className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  {categoria?.nome ?? 'Categoria não identificada'} · {formatarPontos(p.ptGerado)} pts
                  {p.ctUrl ? ' · com evidência' : ' · sem evidência'}
                </span>
                <FiChevronRight className="shrink-0 text-slate-400" />
              </span>
            </button>
          );
        })}

        {pendentes.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Fila zerada. Ótimo trabalho, moderação em dia!
          </p>
        )}
      </div>
    </>
  );
}