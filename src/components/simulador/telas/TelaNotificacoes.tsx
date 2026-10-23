import type { ReactNode } from 'react';
import { FiAward, FiBell, FiCheckCircle, FiClock, FiShield, FiTarget, FiTrendingUp } from 'react-icons/fi';
import type { Notificacao, TipoNotificacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { formatarData } from '../../../utils/formatadores';

const icones: Record<TipoNotificacao, ReactNode> = {
  moderacao: <FiShield size={16} />,
  contestacao: <FiClock size={16} />,
  liga: <FiTrendingUp size={16} />,
  distintivo: <FiAward size={16} />,
  meta: <FiTarget size={16} />,
  inatividade: <FiBell size={16} />,
};

export default function TelaNotificacoes() {
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas, abrirPostagem, irPara } = useSimulador();

  // Abre o feedback da postagem ou a tela ligada à notificação (e marca como lida)
  const abrir = (n: Notificacao) => {
    marcarLida(n.id);
    if (n.idPostagem !== undefined) abrirPostagem(n.idPostagem);
    else if (n.tela) irPara(n.tela);
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Notificações</p>
        <h1 className="text-xl font-bold leading-snug">
          {naoLidas > 0 ? `${naoLidas} novidades para você.` : 'Tudo em dia por aqui.'}
        </h1>
      </div>

      <button
        type="button"
        onClick={marcarTodasLidas}
        disabled={naoLidas === 0}
        className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] cursor-pointer disabled:cursor-default disabled:text-slate-400"
      >
        <FiCheckCircle size={16} /> Marcar todas como lidas
      </button>

      <ul className="space-y-2">
        {notificacoes.map((n) => (
          <li
            key={n.id}
            className={`rounded-2xl border p-4 shadow-sm ${
              n.lida ? 'border-slate-200 bg-white' : 'border-[#4F46E5]/30 bg-[#4F46E5]/5'
            }`}
          >
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-[#4F46E5]">
                {icones[n.tipo]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{n.titulo}</p>
                <p className="mt-0.5 text-xs text-slate-500">{n.texto}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                  {n.demonstracao ? 'Demonstração' : 'API'}
                  {n.em && ` · ${formatarData(n.em)}`}
                </p>
                <div className="mt-2 flex gap-4 text-xs font-bold">
                  {(n.idPostagem !== undefined || n.tela) && (
                    <button type="button" onClick={() => abrir(n)} className="whitespace-nowrap text-[#4F46E5] cursor-pointer">
                      {n.idPostagem !== undefined ? 'Ver feedback →' : 'Abrir →'}
                    </button>
                  )}
                  {!n.lida && (
                    <button type="button" onClick={() => marcarLida(n.id)} className="whitespace-nowrap text-slate-500 cursor-pointer">
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
              {!n.lida && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#4F46E5]" aria-label="Não lida" />}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-center text-[11px] text-slate-500">
        Demonstração: liga, distintivo, contestação, meta e inatividade ficam só no front. Aprovadas e rejeitadas vêm
        da API.
      </p>
    </>
  );
}