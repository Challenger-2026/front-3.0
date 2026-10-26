import type { ReactNode } from 'react';
import { FaLeaf } from 'react-icons/fa';
import { formatarPontos } from '../../utils/formatadores';

type CartaoSaldoProps = {
  pontos: number; // saldo disponível
  co2: number; // kg de CO₂ evitado pelas ações aprovadas
  children?: ReactNode; // extra embaixo do saldo (ex.: distintivo do mês na Carteira)
};

// Saldo de pontos usado na Carteira e nos Benefícios
export default function CartaoSaldo({ pontos, co2, children }: CartaoSaldoProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Saldo de pontos</p>
          <p className="mt-1 flex items-baseline gap-2 text-4xl font-extrabold leading-none text-[#4F46E5]">
            {formatarPontos(pontos)}
            <span className="text-base font-semibold text-slate-500">pts</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            equivale a{' '}
            <strong className="font-semibold text-[#16173A]">
              {co2.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
            </strong>{' '}
            de CO₂ evitado
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5]">
          <FaLeaf size={22} />
        </span>
      </div>
      {children}
    </section>
  );
}