import type { ClasseRisco, RegistroPrevisao } from '../../../types/types';
import { coresClasse, textosClasse } from '../../../data/ia';
import { formatarHora } from '../../../utils/formatadores';

type HistoricoPrevisoesProps = {
  historico: RegistroPrevisao[];
  aoLimpar: () => void;
};

function SeloClasse({ classe }: { classe: ClasseRisco }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${coresClasse[classe]}`}>
      {textosClasse[classe]}
    </span>
  );
}

// Tabela "A IA acertou?": cada previsão da sessão, comparada com o rótulo real quando ele existe
export default function HistoricoPrevisoes({ historico, aoLimpar }: HistoricoPrevisoesProps) {
  // Só as previsões com os valores do usuário sorteado têm rótulo real para comparar
  const comRotulo = historico.filter((r) => r.rotuloReal !== null);
  const acertos = comRotulo.filter((r) => r.rotuloReal === r.classe).length;

  return (
    <section className="rounded-2xl border border-[#e3cfa8] bg-white p-6 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Histórico desta sessão</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#a84312]">A IA acertou?</h2>
          <p className="mt-1 text-sm text-stone-600">
            Cada previsão entra aqui. Só dá para conferir quando os valores são os do usuário sorteado, porque é ele que
            tem o rótulo real.
          </p>
        </div>
        <p className="rounded-xl border border-[#f0e2c4] bg-[#fdf8ec] px-4 py-2 text-sm font-bold text-[#35685b]">
          {comRotulo.length === 0
            ? 'Nenhuma previsão com rótulo ainda'
            : `${acertos} de ${comRotulo.length} acertos (${Math.round((acertos / comRotulo.length) * 100)}%)`}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#f0e2c4]">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[#fdf8ec] text-[11px] uppercase tracking-[0.12em] text-[#35685b]">
            <tr>
              <th className="px-3 py-2.5">Hora</th>
              <th className="px-3 py-2.5">Usuário</th>
              <th className="px-3 py-2.5">Previsão</th>
              <th className="px-3 py-2.5">Risco</th>
              <th className="px-3 py-2.5">Rótulo real</th>
              <th className="px-3 py-2.5">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {historico.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-stone-400">
                  Sorteie um usuário e clique em "Prever" para começar.
                </td>
              </tr>
            ) : (
              historico.map((r) => (
                <tr key={r.id} className="border-t border-[#f3e9d6] text-stone-700">
                  <td className="px-3 py-2.5">{formatarHora(r.horario)}</td>
                  <td className="px-3 py-2.5">{r.usuario}</td>
                  <td className="px-3 py-2.5">
                    <SeloClasse classe={r.classe} />
                  </td>
                  <td className="px-3 py-2.5">{Math.round(r.probabilidade_risco * 100)}%</td>
                  <td className="px-3 py-2.5">
                    {r.rotuloReal ? <SeloClasse classe={r.rotuloReal} /> : <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.rotuloReal === null ? (
                      <span className="text-stone-400">Sem rótulo</span>
                    ) : r.rotuloReal === r.classe ? (
                      <span className="font-bold text-emerald-700">✅ Acertou</span>
                    ) : (
                      <span className="font-bold text-red-700">❌ Errou</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
        <span>Demonstração: o histórico fica só no navegador e some ao trocar de aba ou recarregar a página.</span>
        <button
          type="button"
          onClick={aoLimpar}
          disabled={historico.length === 0}
          className="rounded-lg border border-stone-300 px-3 py-1.5 font-bold text-stone-600 cursor-pointer hover:border-[#D35400] hover:text-[#D35400] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpar histórico
        </button>
      </div>
    </section>
  );
}