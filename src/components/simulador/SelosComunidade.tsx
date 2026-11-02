import { FiCheckCircle, FiStar } from 'react-icons/fi';
import { FaRegHandshake } from 'react-icons/fa';
import type { ComplementoComunidade } from '../../types/types';

type SelosComunidadeProps = {
  complemento: ComplementoComunidade;
};

// Selos discretos: plano, verificada e parceria proposta (demonstração: a API não tem esses campos)
export default function SelosComunidade({ complemento }: SelosComunidadeProps) {
  const premium = complemento.plano === 'Premium';

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          premium ? 'border-[#4F46E5]/30 bg-[#4F46E5]/10 text-[#4F46E5]' : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        {premium && <FiStar size={10} />} {complemento.plano}
      </span>

      {complemento.verificada && (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold">
          <FiCheckCircle size={10} className="text-[#4F46E5]" /> Verificada
        </span>
      )}

      {complemento.verificacaoPendente && !complemento.verificada && (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
          <FiCheckCircle size={10} /> Verificação pendente
        </span>
      )}

      {complemento.parceriaProposta && (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold">
          <FaRegHandshake size={11} /> Parceria proposta
        </span>
      )}
    </span>
  );
}