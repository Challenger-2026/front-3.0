import { useState } from 'react';
import { FiActivity, FiChevronDown, FiTrash2 } from 'react-icons/fi';
import type { RegistroRequisicao } from '../../types/types';
import { useRequisicoes } from '../../hooks/useRequisicoes';
import { USANDO_JSON_SERVER } from '../../services/http';
import { formatarHora } from '../../utils/formatadores';

// Cor pelo status: 2xx deu certo, 4xx foi barrado por uma regra da API, sem resposta ou 5xx é falha
const corDoStatus = (status: number | null) => {
  if (status === null || status >= 500) return 'bg-red-100 text-red-800';
  if (status >= 400) return 'bg-amber-100 text-amber-800';
  return 'bg-emerald-100 text-emerald-800';
};

const corDoPonto = (status: number | null) => {
  if (status === null || status >= 500) return 'bg-red-500';
  if (status >= 400) return 'bg-amber-500';
  return 'bg-emerald-500';
};

function LinhaRequisicao({ registro }: { registro: RegistroRequisicao }) {
  return (
    <li className={`px-4 py-2.5 ${registro.apoio ? 'bg-stone-50 text-stone-500' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 font-mono text-xs font-bold">{registro.metodo}</span>
        <span className="min-w-0 flex-1 break-all font-mono text-xs">{registro.rota}</span>
        <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold ${corDoStatus(registro.status)}`}>
          {registro.status ?? '—'}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-16 text-[11px] text-stone-500">
        <span>{formatarHora(registro.horario)}</span>
        <span>{registro.tempoMs} ms</span>
        {registro.simulado && (
          <span className="rounded bg-indigo-50 px-1.5 font-semibold text-indigo-700">como o Java responderia</span>
        )}
        {registro.apoio && <span className="rounded bg-stone-200 px-1.5 font-semibold">apoio do json-server</span>}
      </div>

      {registro.erro && <p className="mt-1 pl-16 text-xs text-red-700">{registro.erro}</p>}
    </li>
  );
}

// Rodapé fixo à esquerda (o botão "voltar ao topo" fica à direita): abre a lista das últimas chamadas à API.
// Fica abaixo do Header (z-50) e a altura máxima deixa o Header à vista.
export default function PainelRequisicoes() {
  const { requisicoes, limparRequisicoes } = useRequisicoes();
  const [aberto, setAberto] = useState<boolean>(false);
  const [mostrarApoio, setMostrarApoio] = useState<boolean>(false);

  const visiveis = mostrarApoio ? requisicoes : requisicoes.filter((r) => !r.apoio);
  const ultima = requisicoes.find((r) => !r.apoio);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[30rem]">
      {aberto && (
        <section
          id="painel-requisicoes"
          aria-label="Requisições à API"
          className="pointer-events-auto mx-4 flex max-h-[calc(100dvh-16rem)] flex-col overflow-hidden rounded-2xl border border-[#ead9b6] bg-white shadow-[0_10px_35px_rgba(120,78,35,0.25)] sm:mx-0 sm:mb-3 sm:max-h-[calc(100dvh-12rem)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
            <div>
              <h2 className="font-extrabold text-[#a84312]">Requisições ao vivo</h2>
              <p className="text-xs text-stone-500">
                {USANDO_JSON_SERVER ? 'Modo json-server (db.json)' : 'API Java'} · mais novas primeiro
              </p>
            </div>
            <button
              type="button"
              onClick={limparRequisicoes}
              disabled={requisicoes.length === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-semibold text-stone-700 cursor-pointer hover:border-[#D35400] hover:text-[#D35400] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 aria-hidden /> Limpar
            </button>
          </div>

          {USANDO_JSON_SERVER && (
            <p className="border-b border-stone-200 bg-[#f9e8c9] px-4 py-2 text-xs text-[#66513c]">
              Demonstração: a API Java ainda não está no ar. Cada linha mostra o endpoint e o status que o Java
              devolveria; o tempo é o do json-server.
            </p>
          )}

          {USANDO_JSON_SERVER && (
            <label className="flex items-center gap-2 border-b border-stone-200 px-4 py-2 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={mostrarApoio}
                onChange={(e) => setMostrarApoio(e.target.checked)}
                className="accent-[#D35400]"
              />
              Mostrar apoio do json-server (as chamadas que imitam as regras do Java)
            </label>
          )}

          {visiveis.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-stone-500">
              Nenhuma requisição ainda. Use o app no celular para ver as chamadas aqui.
            </p>
          ) : (
            <ul className="divide-y divide-stone-100 overflow-y-auto">
              {visiveis.map((registro) => (
                <LinhaRequisicao key={registro.id} registro={registro} />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* no celular o botão fica à esquerda, longe do "voltar ao topo" */}
      <div className="p-4 pt-3 sm:p-0">
        <button
          type="button"
          onClick={() => setAberto((atual) => !atual)}
          aria-expanded={aberto}
          aria-controls="painel-requisicoes"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#35685b] px-4 py-3 text-sm font-bold text-white shadow-lg cursor-pointer hover:bg-[#2b5649]"
        >
          <FiActivity aria-hidden />
          Requisições
          <span className="rounded-full bg-white/20 px-2 text-xs">{requisicoes.filter((r) => !r.apoio).length}</span>
          {ultima && <span className={`h-2.5 w-2.5 rounded-full ${corDoPonto(ultima.status)}`} title="Última requisição" />}
          <FiChevronDown aria-hidden className={`ml-1 transition-transform ${aberto ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </div>
  );
}