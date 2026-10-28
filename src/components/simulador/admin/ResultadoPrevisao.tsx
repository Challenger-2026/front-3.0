import type { ClasseRisco, PrevisaoRisco } from '../../../types/types';
import { coresClasse, coresPerfil, nomesAtributosIa, textosClasse } from '../../../data/ia';

type ResultadoPrevisaoProps = {
  previsao: PrevisaoRisco;
  rotuloReal: ClasseRisco | null; // null: valores alterados, não há rótulo real para comparar
};

export default function ResultadoPrevisao({ previsao, rotuloReal }: ResultadoPrevisaoProps) {
  const porcentagem = Math.round(previsao.probabilidade_risco * 100);
  const acertou = rotuloReal === previsao.classe;

  return (
    <div className="animate-fade-in space-y-4 rounded-xl border border-[#f0e2c4] bg-[#fdf8ec] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${coresClasse[previsao.classe]}`}>
          {textosClasse[previsao.classe]}
        </span>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${coresPerfil[previsao.perfil]}`}>
          Perfil: {previsao.perfil}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-stone-700">Probabilidade de abandono</span>
          <span className="font-bold text-stone-900">{porcentagem}%</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-stone-200">
          <div
            className={`h-full rounded-full ${porcentagem >= 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-stone-700">
        <span className="font-semibold">Tom da ação:</span> {previsao.tom}
      </p>

      <div>
        <p className="text-sm font-semibold text-stone-700">Orientações de retenção</p>
        {previsao.orientacoes.length === 0 ? (
          <p className="mt-1 text-sm text-stone-600">
            Nenhum comportamento está aumentando o risco. Vale só reconhecer e manter o ritmo.
          </p>
        ) : (
          <ul className="mt-1 space-y-1">
            {previsao.orientacoes.map((o) => (
              <li key={o.atributo} className="text-sm text-stone-700">
                <span className="font-semibold">{o.acao}</span>
                <span className="text-stone-500"> · por causa de: {nomesAtributosIa[o.atributo]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {rotuloReal ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            acertou ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          Rótulo real: {textosClasse[rotuloReal]} · {acertou ? '✅ O modelo acertou' : '❌ O modelo errou'}
        </p>
      ) : (
        <p className="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-600">
          Valores alterados: não há rótulo real para comparar, só a previsão.
        </p>
      )}
    </div>
  );
}