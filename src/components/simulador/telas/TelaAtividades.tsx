import type { StatusValidacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { formatarPontos } from '../../../utils/formatadores';

const coresStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROVADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJEITADO: 'bg-red-50 text-red-600 border-red-200',
};

const nomesStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export default function TelaAtividades() {
  const { usuario, postagens, comunidades, abrirPostagem } = useSimulador();

  if (!usuario) return null;

  // Todas as postagens do usuário, mais recentes primeiro (id decrescente, a API não tem data)
  const minhas = postagens.filter((p) => p.idUsuario === usuario.id).sort((a, b) => b.id - a.id);

  const contagem = [
    { label: 'Aprovadas', valor: minhas.filter((p) => p.stValidacao === 'APROVADO').length },
    { label: 'Aguardando', valor: minhas.filter((p) => p.stValidacao === 'PENDENTE').length },
    { label: 'Rejeitadas', valor: minhas.filter((p) => p.stValidacao === 'REJEITADO').length },
  ];

  const nomeDaComunidade = (id: number) => comunidades.find((c) => c.id === id)?.nmComunidade;

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-bold">Atividades registradas</h1>
        <p className="mt-1 text-xs text-slate-500">Registro privado: só você vê o status das suas atividades.</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {contagem.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-100 py-2">
              <p className="text-sm font-extrabold">{item.valor}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ul className="space-y-2">
        {minhas.map((p) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">{nomeDaComunidade(p.idComunidade)}</p>
                <p className="mt-0.5 text-sm">{p.ctTexto}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${coresStatus[p.stValidacao]}`}
              >
                {p.stValidacao === 'APROVADO' ? `+${formatarPontos(p.ptGerado)}` : nomesStatus[p.stValidacao]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => abrirPostagem(p.id)}
              className="mt-2 text-xs font-semibold text-[#4F46E5] cursor-pointer"
            >
              Ver detalhes
            </button>
          </li>
        ))}

        {minhas.length === 0 && (
          <li className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma atividade registrada ainda. Toque no + para registrar a primeira.
          </li>
        )}
      </ul>
    </>
  );
}