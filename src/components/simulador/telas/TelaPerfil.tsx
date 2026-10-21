import { FiSettings } from 'react-icons/fi';
import type { TipoPerfil } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import { formatarPontos } from '../../../utils/formatadores';
import PostagemCard from '../PostagemCard';

const nomesPerfil: Record<TipoPerfil, string> = {
  COMUM: 'Comum',
  CRIADOR: 'Criador',
  MODERADOR: 'Moderador',
};

export default function TelaPerfil() {
  const { usuario, postagens, comunidades, complementos, irPara } = useSimulador();

  if (!usuario) return null;

  const complemento = complementos[usuario.id];

  const minhas = postagens
    .filter((p) => p.idUsuario === usuario.id)
    .sort((a, b) => b.id - a.id);
  const aprovadas = minhas.filter((p) => p.stValidacao === 'APROVADO');
  const pendentes = minhas.filter((p) => p.stValidacao === 'PENDENTE');
  const criadas = comunidades.filter((c) => c.idCriador === usuario.id);

  // CO₂ evitado = soma do fator de cada ação aprovada
  const co2Evitado = aprovadas.reduce(
    (total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0),
    0,
  );

  const estatisticas = [
    { label: 'Publicações', valor: String(minhas.length) },
    { label: 'Validadas', valor: String(aprovadas.length) },
    { label: 'Pontos', valor: formatarPontos(usuario.sdPonto) },
  ];

  return (
    <>
      <section className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => irPara('ajustes')}
          aria-label="Configurações"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 cursor-pointer"
        >
          <FiSettings size={16} />
        </button>
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#4F46E5]/10 text-xl font-bold text-[#4F46E5]">
            {usuario.nmCompleto.charAt(0)}
          </span>
          <div>
            <h1 className="text-lg font-bold">{usuario.nmCompleto}</h1>
            <p className="text-xs text-slate-500">@{usuario.username}</p>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold">
              {nomesPerfil[usuario.tipoPerfil]}
            </span>
          </div>
        </div>

        {criadas.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            Criadora de: <strong>{criadas.map((c) => c.nmComunidade).join(', ')}</strong>
          </p>
        )}

        {complemento && <p className="mt-3 text-sm">{complemento.bio}</p>}

        {complemento && complemento.interesses.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {complemento.interesses.map((tema) => (
              <span key={tema} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                {tema}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {estatisticas.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-100 py-2">
              <p className="text-sm font-extrabold">{item.valor}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500">
          {formatarPontos(co2Evitado)} kg de CO₂ evitados · {pendentes.length} ação(ões) aguardando validação
        </p>
      </section>

      <h2 className="pt-1 text-sm font-bold uppercase tracking-wider text-slate-500">Minhas publicações</h2>
      <div className="space-y-3">
        {aprovadas.map((postagem) => (
          <PostagemCard key={postagem.id} postagem={postagem} nomeAutor={usuario.nmCompleto} />
        ))}

        {aprovadas.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma publicação validada ainda.
          </p>
        )}
      </div>
    </>
  );
}