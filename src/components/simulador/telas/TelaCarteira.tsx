import { FiChevronRight } from 'react-icons/fi';
import type { TelaId } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos, TETO_DIARIO_PONTOS } from '../../../data/categorias';
import { concluidasDaMeta, diasRestantes } from '../../../data/metas';
import { distintivoDoMesAtual } from '../../../data/liga';
import { formatarPontos } from '../../../utils/formatadores';
import CartaoSaldo from '../CartaoSaldo';

type Atalho = { tela: TelaId; label: string; principal?: boolean };

// Botões do fim da tela, na ordem do protótipo
const atalhos: Atalho[] = [
  { tela: 'nova-postagem', label: 'Registrar ação sustentável', principal: true },
  { tela: 'pontos', label: 'Ver minha pontuação' },
  { tela: 'beneficios', label: 'Resgatar benefício' },
  { tela: 'ranking', label: 'Ver ranking' },
];

export default function TelaCarteira() {
  const { usuario, postagens, metas, saldoDisponivel, irPara } = useSimulador();

  if (!usuario) return null;

  const minhas = postagens.filter((p) => p.idUsuario === usuario.id);
  const aprovadas = minhas.filter((p) => p.stValidacao === 'APROVADO');
  const pendentes = minhas.filter((p) => p.stValidacao === 'PENDENTE').length;

  // CO₂ evitado = soma do fator de cada ação aprovada
  const co2Evitado = aprovadas.reduce((total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0), 0);

  // Hoje (demonstração): sem data na API, todas as aprovadas contam como de hoje (pode passar do teto)
  const pontosHoje = aprovadas.reduce((total, p) => total + p.ptGerado, 0);
  const distintivo = distintivoDoMesAtual();
  const meta = metas[usuario.id];
  const concluidas = meta ? concluidasDaMeta(meta, postagens, usuario.id) : 0;

  const numeros = [
    { label: 'Aprovadas', valor: String(aprovadas.length) },
    { label: 'Pendentes', valor: String(pendentes) },
    { label: 'Hoje', valor: `${formatarPontos(pontosHoje)}/${TETO_DIARIO_PONTOS}` },
  ];

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Carteira</p>
        <h1 className="text-xl font-bold leading-snug">Seus pontos, metas e benefícios.</h1>
      </div>

      <CartaoSaldo pontos={saldoDisponivel} co2={co2Evitado}>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl">{distintivo.emoji}</span>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Distintivo de {distintivo.mes}</p>
            <p className="text-sm font-bold">{distintivo.animal}</p>
            <p className="text-[11px] text-[#4F46E5]">{distintivo.status}</p>
          </div>
        </div>
      </CartaoSaldo>

      <div className="grid grid-cols-3 gap-3">
        {numeros.map((n) => (
          <div key={n.label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-extrabold text-[#4F46E5]">{n.valor}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{n.label}</p>
          </div>
        ))}
      </div>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: o saldo desconta os resgates feitos aqui (a API não tem resgates). Como a postagem não tem
        data na API, os pontos de hoje somam todas as postagens aprovadas e o distintivo do mês é fixo.
      </p>

      {/* Meta de atividades (fica no front) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Meta de atividades</h2>
          <button
            type="button"
            onClick={() => irPara('metas')}
            className="text-xs font-bold text-[#4F46E5] cursor-pointer"
          >
            {meta ? 'Ver meta ›' : 'Definir ›'}
          </button>
        </div>
        {meta ? (
          <>
            <p className="mt-1 text-xs text-slate-500">
              {concluidas}/{meta.alvo} atividades · {diasRestantes(meta)} dia(s) restantes de {meta.periodoDias}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#4F46E5]"
                style={{ width: `${Math.min(100, (concluidas / meta.alvo) * 100)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            Escolha um período de 7, 15 ou 30 dias e quantas atividades quer concluir nele.
          </p>
        )}
      </section>

      <div className="space-y-3">
        {atalhos.map((a) => (
          <button
            key={a.tela}
            type="button"
            onClick={() => irPara(a.tela)}
            className={`flex w-full items-center justify-between rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer ${
              a.principal ? 'bg-[#4F46E5] text-white shadow-sm' : 'border border-slate-200 bg-white'
            }`}
          >
            {a.label}
            <FiChevronRight size={16} />
          </button>
        ))}
      </div>
    </>
  );
}