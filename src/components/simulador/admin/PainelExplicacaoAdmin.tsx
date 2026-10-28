import { endpointsIa, explicacaoAdmin } from '../../../data/ia';
import { IA_URL } from '../../../services/http';

type PainelExplicacaoAdminProps = {
  proximaAcao: string;
};

// Mesmo formato do painel de explicação do celular, com os endpoints da API Python
export default function PainelExplicacaoAdmin({ proximaAcao }: PainelExplicacaoAdminProps) {
  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-[#e3cfa8] bg-white p-6 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Você está vendo</p>
      <h2 className="mt-1 text-2xl font-extrabold text-[#a84312]">{explicacaoAdmin.titulo}</h2>

      <p className="mt-4 text-stone-700 leading-relaxed">{explicacaoAdmin.descricao}</p>

      <ul className="mt-4 space-y-2">
        {explicacaoAdmin.destaques.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-stone-700">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D35400]" />
            {item}
          </li>
        ))}
      </ul>

        <div className="mt-5 rounded-lg border border-[#f0e2c4] bg-[#fdf8ec] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Endpoints desta tela</p>
        <p className="mt-1 break-all font-mono text-[11px] text-stone-500">API Python (Flask) em {IA_URL}</p>
        <ul className="mt-2 space-y-2">
          {endpointsIa.map((e) => (
            <li key={`${e.metodo} ${e.rota}`}>
              <p className="font-mono text-xs text-stone-800">
                <span className="font-bold">{e.metodo}</span> {e.rota}
              </p>
              <p className="text-xs text-stone-600">{e.descricao}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 rounded-lg border-l-4 border-[#D35400] bg-[#fff4e6] px-4 py-3 text-sm font-semibold text-[#7c2d12]">👉 {proximaAcao}</p>
    </section>
  );
}