import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoria } from '../../../data/categorias';
import { formatarPontos } from '../../../utils/formatadores';
import PostagemCard from '../PostagemCard';

export default function TelaPerfil() {
  const { usuario, postagens, comunidades } = useSimulador();

  if (!usuario) return null;

  const minhas = postagens
    .filter((p) => p.autorId === usuario.id)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
  const aprovadas = minhas.filter((p) => p.status === 'Aprovado');
  const pendentes = minhas.filter((p) => p.status === 'Pendente');
  const criadas = comunidades.filter((c) => c.criadorId === usuario.id);

  // CO₂ evitado = soma do fator de cada ação aprovada
  const co2Evitado = aprovadas.reduce(
    (total, p) => total + (buscarCategoria(p.categoriaId ?? p.categoriaSelecionada)?.co2Kg ?? 0),
    0,
  );

  const estatisticas = [
    { label: 'Publicações', valor: String(minhas.length) },
    { label: 'Validadas', valor: String(aprovadas.length) },
    { label: 'Pontos', valor: formatarPontos(usuario.pontos) },
  ];

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#4F46E5]/10 text-xl font-bold text-[#4F46E5]">
            {usuario.nome.charAt(0)}
          </span>
          <div>
            <h1 className="text-lg font-bold">{usuario.nome}</h1>
            <p className="text-xs text-slate-500">@{usuario.username}</p>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold">
              {usuario.perfil}
            </span>
          </div>
        </div>

        {criadas.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            Criadora de: <strong>{criadas.map((c) => c.nome).join(', ')}</strong>
          </p>
        )}

        {usuario.bio && <p className="mt-3 text-sm">{usuario.bio}</p>}

        {usuario.interesses && usuario.interesses.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {usuario.interesses.map((tema) => (
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
          <PostagemCard key={postagem.id} postagem={postagem} />
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