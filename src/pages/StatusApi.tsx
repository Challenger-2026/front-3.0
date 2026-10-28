import { useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import type { ControllerJava, ServicoStatus, SituacaoApi } from '../types/types';
import { useRequisicoes } from '../hooks/useRequisicoes';
import { BASE_URL, IA_URL, USANDO_JSON_SERVER } from '../services/http';
import { LIMITE_LENTA_MS, coresSituacao, rotasVerificacao, textosSituacao } from '../data/endpoints';
import CartaoController from '../components/simulador/CartaoController';
import Botao from '../components/Botao';
import { formatarHora } from '../utils/formatadores';

const controllers = Object.keys(rotasVerificacao) as ControllerJava[];

const resumos: Record<SituacaoApi, { titulo: string; classe: string }> = {
  operacional: { titulo: 'Todas as APIs estão operacionais', classe: 'bg-emerald-600' },
  lenta: { titulo: 'Alguma API está respondendo com lentidão', classe: 'bg-amber-500' },
  fora: { titulo: 'Alguma API está fora do ar ou com erro', classe: 'bg-red-600' },
};

// Título de cada grupo de cards (a API Java e a API de IA)
function TituloGrupo({ etiqueta, cor, texto }: { etiqueta: string; cor: string; texto: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cor}`}>{etiqueta}</span>
      <h3 className="text-sm font-bold text-stone-800">{texto}</h3>
    </div>
  );
}

// Aba "Status da API" (/simulador/status): mede um GET de cada controller e da API de IA, no estilo de uma página de status
export default function StatusApi() {
  const { ultimaVerificacao: ultima, verificando, verificarAgora } = useRequisicoes();

  // Verifica ao abrir a aba
  useEffect(() => {
    verificarAgora();
  }, [verificarAgora]);

  // A pior situação da última verificação define o resumo
  const situacaoGeral: SituacaoApi | undefined = ultima
    ? (['fora', 'lenta', 'operacional'] as SituacaoApi[]).find((s) => ultima.resultados.some((r) => r.situacao === s))
    : undefined;
  const resultadoDe = (servico: ServicoStatus) => ultima?.resultados.find((r) => r.controller === servico);

  return (
    <div className="space-y-6">
      <p className="text-center text-stone-700">
        Mede um GET de cada controller da API Java e da API de IA e mostra onde cada endpoint aparece no simulador.
      </p>

      <section className="overflow-hidden rounded-2xl border border-[#e3cfa8] bg-white shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
        <div className={`px-6 py-4 text-white ${situacaoGeral ? resumos[situacaoGeral].classe : 'bg-stone-500'}`}>
          <h2 className="text-xl font-extrabold">{situacaoGeral ? resumos[situacaoGeral].titulo : 'Verificando a API…'}</h2>
          <p className="text-sm text-white/90">
            {ultima ? `Verificado às ${formatarHora(ultima.horario)}` : 'Medindo a API Java e a API de IA'}
            {USANDO_JSON_SERVER && ' · API Java em modo json-server (db.json)'}
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

        <p className="border-t border-[#f0e2c4] bg-[#fdf8ec] px-6 py-3 text-sm text-stone-600">
          Mostra só a última verificação. As duas APIs ficam no plano free do Render e “dormem” sem uso: a primeira
          verificação pode aparecer como lenta enquanto elas acordam.
          {USANDO_JSON_SERVER &&
            ' Em modo json-server, o tempo da API Java é o do json-server, com o status que o Java devolveria.'}
        </p>
      </section>

      <section className="space-y-3">
        <TituloGrupo
          etiqueta="Java"
          cor="bg-orange-100 text-[#9a3412]"
          texto={USANDO_JSON_SERVER ? 'API Java (json-server)' : `API Java (Spring Boot) · ${BASE_URL}`}
        />
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {controllers.map((c) => (
            <CartaoController key={c} controller={c} resultado={resultadoDe(c)} horario={ultima?.horario} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <TituloGrupo etiqueta="Python" cor="bg-violet-100 text-violet-800" texto={`API de IA (Flask) · ${IA_URL}`} />
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <CartaoController controller="ApiIa" resultado={resultadoDe('ApiIa')} horario={ultima?.horario} />
        </div>
      </section>
    </div>
  );
}