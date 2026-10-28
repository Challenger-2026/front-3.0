import type { ControllerJava, EndpointJava, SituacaoApi, VerificacaoApi } from '../../types/types';
import {
  LIMITE_VERIFICACOES,
  coresSituacao,
  endpoints,
  nomesControllers,
  rotasVerificacao,
  textosSituacao,
} from '../../data/endpoints';
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

type CartaoControllerProps = {
  controller: ControllerJava;
  verificacoes: VerificacaoApi[]; // mais nova primeiro
};

export default function CartaoController({ controller, verificacoes }: CartaoControllerProps) {
  // Resultados deste controller, do mais antigo para o mais novo (as barras crescem para a direita)
  const resultados = verificacoes
    .flatMap((v) => {
      const resultado = v.resultados.find((r) => r.controller === controller);
      return resultado ? [{ ...resultado, id: v.id, horario: v.horario }] : [];
    })
    .reverse();
  const ultimo = resultados[resultados.length - 1];
  const operacionais = resultados.filter((r) => r.situacao === 'operacional').length;
  const vazias = LIMITE_VERIFICACOES - resultados.length;
  const doController = endpoints.filter((e) => e.controller === controller);

  return (
      <article className="rounded-2xl border border-[#e3cfa8] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-[#a84312]">{nomesControllers[controller]}</h3>
          <p className="font-mono text-xs text-stone-500">
            {controller} · GET {rotasVerificacao[controller]}
          </p>
        </div>
        {ultimo ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${chipsSituacao[ultimo.situacao]}`}>
            {textosSituacao[ultimo.situacao]} · {ultimo.status ?? 'sem resposta'} · {ultimo.tempoMs} ms
          </span>
        ) : (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">Verificando…</span>
        )}
      </div>

      {/* Barras: uma por verificação; as vazias são verificações que ainda não aconteceram */}
      <div className="mt-4 flex h-8 gap-1" role="img" aria-label={`${operacionais} de ${resultados.length} verificações operacionais`}>
        {Array.from({ length: vazias }, (_, i) => (
          <span key={`vazia-${i}`} className="flex-1 rounded-sm bg-stone-200" />
        ))}
        {resultados.map((r) => (
          <span
            key={r.id}
            title={`${formatarHora(r.horario)} · ${textosSituacao[r.situacao]} · ${r.status ?? 'sem resposta'} · ${r.tempoMs} ms${r.erro ? ` · ${r.erro}` : ''}`}
            className={`flex-1 rounded-sm ${coresSituacao[r.situacao]}`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-stone-500">
        <span>mais antiga</span>
        <span>
          {operacionais} de {resultados.length} operacionais
        </span>
        <span>agora</span>
      </div>

      {ultimo?.erro && <p className="mt-2 text-xs text-red-700">{ultimo.erro}</p>}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#35685b]">
          {doController.length} endpoints e onde aparecem
        </summary>
        <ul className="mt-2 divide-y divide-[#f3e9d6]">
          {doController.map((e) => (
            <li key={`${e.metodo} ${e.rota}`} className="py-2">
              <p className="font-mono text-xs">
                <span className="font-bold">{e.metodo}</span> {e.rota}
              </p>
              <p className="text-xs text-stone-600">{e.descricao}</p>
              <p className={`text-xs ${e.telas.length === 0 && !e.aoAbrir ? 'text-stone-400' : 'text-[#35685b]'}`}>
                {usoDoEndpoint(e)}
              </p>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}