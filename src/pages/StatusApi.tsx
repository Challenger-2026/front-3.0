import { useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import type { ControllerJava, SituacaoApi } from '../types/types';
import { useRequisicoes } from '../hooks/useRequisicoes';
import { BASE_URL, USANDO_JSON_SERVER } from '../services/http';
import { LIMITE_LENTA_MS, LIMITE_VERIFICACOES, coresSituacao, rotasVerificacao, textosSituacao } from '../data/endpoints';
import CartaoController from '../components/simulador/CartaoController';
import Botao from '../components/Botao';
import { formatarHora } from '../utils/formatadores';

const controllers = Object.keys(rotasVerificacao) as ControllerJava[];

const resumos: Record<SituacaoApi, { titulo: string; classe: string }> = {
  operacional: { titulo: 'Todos os controllers estão operacionais', classe: 'bg-emerald-600' },
  lenta: { titulo: 'API respondendo com lentidão', classe: 'bg-amber-500' },
  fora: { titulo: 'API fora do ar ou com erro', classe: 'bg-red-600' },
};

// Aba "Status da API" (/simulador/status): mede um GET de cada controller, no estilo de uma página de status
export default function StatusApi() {
  const { verificacoes, verificando, verificarAgora } = useRequisicoes();

  // Verifica ao abrir a aba
  useEffect(() => {
    verificarAgora();
  }, [verificarAgora]);

  const ultima = verificacoes[0];
  // A pior situação da última verificação define o resumo
  const situacaoGeral: SituacaoApi | undefined = ultima
    ? (['fora', 'lenta', 'operacional'] as SituacaoApi[]).find((s) => ultima.resultados.some((r) => r.situacao === s))
    : undefined;

  return (
    <div className="space-y-6">
      <p className="text-center text-stone-700">
        Mede um GET de cada controller da API Java e mostra onde cada endpoint aparece no simulador.
      </p>

      <section className="overflow-hidden rounded-2xl border border-[#ead9b6] bg-[#fffbed]/95 shadow-[0_15px_35px_rgba(120,78,35,0.1)]">
        <div className={`px-6 py-4 text-white ${situacaoGeral ? resumos[situacaoGeral].classe : 'bg-stone-500'}`}>
          <h2 className="text-xl font-extrabold">{situacaoGeral ? resumos[situacaoGeral].titulo : 'Verificando a API…'}</h2>
          <p className="text-sm text-white/90">
            {USANDO_JSON_SERVER ? 'Modo json-server (db.json)' : `API Java em ${BASE_URL}`}
            {ultima && ` · última verificação às ${formatarHora(ultima.horario)}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
            {(Object.keys(textosSituacao) as SituacaoApi[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${coresSituacao[s]}`} />
                {textosSituacao[s]}
                {s === 'lenta' && ` (acima de ${LIMITE_LENTA_MS / 1000} s)`}
              </li>
            ))}
          </ul>
          <Botao acao={verificarAgora} desabilitado={verificando}>
            <FiRefreshCw aria-hidden className={`mr-2 ${verificando ? 'animate-spin' : ''}`} />
            {verificando ? 'Verificando…' : 'Verificar agora'}
          </Botao>
        </div>

        <p className="border-t border-[#ead9b6] bg-[#f9e8c9] px-6 py-3 text-sm text-[#66513c]">
          Demonstração: o histórico guarda só as últimas {LIMITE_VERIFICACOES} verificações desta sessão e some ao
          recarregar a página.
          {USANDO_JSON_SERVER &&
            ' A API Java ainda não está no ar: o tempo medido é o do json-server, com o status que o Java devolveria.'}
        </p>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {controllers.map((c) => (
          <CartaoController key={c} controller={c} verificacoes={verificacoes} />
        ))}
      </div>
    </div>
  );
}