import { useState } from 'react';
import type { ReactNode } from 'react';
import { FiEyeOff, FiFileText, FiLock, FiShield, FiTrash2, FiUser } from 'react-icons/fi';
import type { IconePrivacidade } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { secoesPrivacidade } from '../../../data/privacidade';
import { formatarData } from '../../../utils/formatadores';

const icones: Record<IconePrivacidade, ReactNode> = {
  dados: <FiUser size={16} />,
  olho: <FiEyeOff size={16} />,
  cadeado: <FiLock size={16} />,
  lei: <FiFileText size={16} />,
  direitos: <FiShield size={16} />,
};

export default function TelaPrivacidade() {
  const { usuario, ocultoEntreAmigos, alternarOcultoEntreAmigos, pedidoExclusaoEm, pedirExclusaoGamificacao } =
    useSimulador();
  const [confirmando, setConfirmando] = useState(false);

  if (!usuario) return null;

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Privacidade</p>
        <h1 className="text-xl font-bold leading-snug">Seus dados, explicados sem juridiquês.</h1>
      </div>

      <div className="space-y-2">
        {secoesPrivacidade.map((secao) => (
          <section key={secao.titulo} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <span className="text-[#4F46E5]">{icones[secao.icone]}</span>
              {secao.titulo}
            </h2>
            <p className="mt-1 text-xs text-slate-500">{secao.texto}</p>
          </section>
        ))}
      </div>

      <h2 className="pt-1 text-sm font-bold uppercase tracking-wider text-slate-500">Ações</h2>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: a API não guarda consentimento nem pedido de exclusão. As duas ações abaixo ficam só no
        simulador.
      </p>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <span id="rotulo-oculto" className="text-sm font-semibold">
          Ocultar meu perfil do ranking Entre amigos
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={ocultoEntreAmigos}
          aria-labelledby="rotulo-oculto"
          onClick={alternarOcultoEntreAmigos}
          className={`relative h-6 w-11 shrink-0 rounded-full cursor-pointer transition ${
            ocultoEntreAmigos ? 'bg-[#4F46E5]' : 'bg-slate-200'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              ocultoEntreAmigos ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {pedidoExclusaoEm ? (
        <p role="status" className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-4 text-sm font-semibold">
          Pedido registrado em {formatarData(pedidoExclusaoEm)}. A Soul Up vai confirmar a eliminação dos seus dados de
          gamificação pelo canal do titular (art. 18, VI).
        </p>
      ) : confirmando ? (
        <section aria-label="Confirmar pedido de exclusão" className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-600">Confirmar exclusão dos dados de gamificação?</p>
          <p className="text-xs">Pontos, postagens e posições no ranking serão apagados. Seu cadastro continua ativo.</p>
          <button
            type="button"
            onClick={() => {
              pedirExclusaoGamificacao();
              setConfirmando(false);
            }}
            className="w-full rounded-full bg-red-600 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            Confirmar pedido
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
          >
            Cancelar
          </button>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 cursor-pointer"
        >
          <FiTrash2 size={16} /> Pedir exclusão dos dados de gamificação
        </button>
      )}

      <p className="pt-2 text-center text-[11px] text-slate-500">
        Referência: Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
      </p>
    </>
  );
}