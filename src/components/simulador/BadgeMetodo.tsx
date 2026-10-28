import type { MetodoRequisicao } from '../../types/types';

// Cor de cada método: GET lê (verde), POST cria (azul), PUT/PATCH editam (amarelo), DELETE apaga (vermelho)
const coresMetodo: Record<MetodoRequisicao, string> = {
  GET: 'bg-emerald-100 text-emerald-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-amber-100 text-amber-800',
  PATCH: 'bg-amber-100 text-amber-800',
  DELETE: 'bg-red-100 text-red-800',
};

export default function BadgeMetodo({ metodo }: { metodo: MetodoRequisicao }) {
  return (
    <span
      className={`mr-1.5 inline-block min-w-[52px] rounded-md px-1.5 py-0.5 text-center font-sans text-[11px] font-extrabold ${coresMetodo[metodo]}`}
    >
      {metodo}
    </span>
  );
}