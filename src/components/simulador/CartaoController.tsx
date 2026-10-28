import type { EndpointJava, ResultadoVerificacao, ServicoStatus, SituacaoApi } from '../../types/types';
import {
  ROTA_VERIFICACAO_IA,
  coresSituacao,
  endpoints,
  nomesControllers,
  rotasVerificacao,
  textosSituacao,
} from '../../data/endpoints';
import { endpointsIa } from '../../data/ia';
import { explicacoes } from '../../data/explicacoes';
import { formatarHora } from '../../utils/formatadores';

const chipsSituacao: Record<SituacaoApi, string> = {
  operacional: 'bg-emerald-100 text-emerald-800',
  lenta: 'bg-amber-100 text-amber-800',
  fora: 'bg-red-100 text-red-800',
};

// Onde o endpoint aparece no simulador
const usoDoEndpoint = (endpoint: EndpointJava) => {
  if (endpoint.aoAbrir) return 'Ao abrir o simulador (dados de todas as telas)';
  if (endpoint.telas.length === 0) return 'Não usado no simulador';
  return endpoint.telas.map((tela) => explicacoes[tela].titulo).join(', ');
};

// Os endpoints de cada serviço, já com o texto de onde aparecem (os da IA só aparecem na aba Admin)
const endpointsDoServico = (servico: ServicoStatus) =>
  servico === 'ApiIa'
    ? endpointsIa.map((e) => ({ ...e, uso: 'Admin (IA)', usado: true }))
    : endpoints
        .filter((e) => e.controller === servico)
        .map((e) => ({ ...e, uso: usoDoEndpoint(e), usado: e.aoAbrir || e.telas.length > 0 }));

type CartaoControllerProps = {
  controller: ServicoStatus;
  resultado?: ResultadoVerificacao; // vazio: ainda verificando
  horario?: string; // hora da última verificação (ISO)
};

// Card de um serviço na página de status: só o resultado da última verificação
export default function CartaoController({ controller, resultado, horario }: CartaoControllerProps) {
  const ehIa = controller === 'ApiIa';
  const rota = ehIa ? ROTA_VERIFICACAO_IA : rotasVerificacao[controller];
  const doServico = endpointsDoServico(controller);

  return (
    <article className="rounded-2xl border border-[#e3cfa8] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-[#a84312]">{nomesControllers[controller]}</h3>
          <p className="font-mono text-xs text-stone-500">
            {ehIa ? 'API de IA' : controller} · GET {rota}
          </p>
        </div>
        {resultado ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${chipsSituacao[resultado.situacao]}`}>
            {textosSituacao[resultado.situacao]}
          </span>
        ) : (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">Verificando…</span>
        )}
      </div>

      {resultado && horario && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#f0e2c4] bg-[#fdf8ec] px-4 py-3">
          <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${coresSituacao[resultado.situacao]}`} />
          <div>
            <p className="text-sm font-bold text-stone-800">
              {resultado.status ?? 'Sem resposta'} · respondeu em {resultado.tempoMs} ms
            </p>
            <p className="text-xs text-stone-600">Última verificação às {formatarHora(horario)}</p>
            {resultado.erro && <p className="text-xs text-red-700">{resultado.erro}</p>}
          </div>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#35685b]">
          {doServico.length} endpoints e onde aparecem
        </summary>
        <ul className="mt-2 divide-y divide-[#f3e9d6]">
          {doServico.map((e) => (
            <li key={`${e.metodo} ${e.rota}`} className="py-2">
              <p className="font-mono text-xs">
                <span className="font-bold">{e.metodo}</span> {e.rota}
              </p>
              <p className="text-xs text-stone-600">{e.descricao}</p>
              <p className={`text-xs ${e.usado ? 'text-[#35685b]' : 'text-stone-400'}`}>{e.uso}</p>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}