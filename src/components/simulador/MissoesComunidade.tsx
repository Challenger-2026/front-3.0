import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FiTarget } from 'react-icons/fi';
import type { Comunidade, Missao, MissaoCadastro } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { categorias, buscarCategoriaPorImpacto } from '../../data/categorias';
import { ehDono } from '../../data/comunidades';
import { mensagemDoErro } from '../../utils/erros';
import { formatarData, formatarPontos } from '../../utils/formatadores';
import { regrasDescricaoMissao, regrasTituloMissao } from '../../utils/validacoes';

type MissoesComunidadeProps = {
  comunidade: Comunidade;
};

// No formulário o prazo é texto (input date vazio = ""); na missão ele é opcional
type FormMissao = Omit<MissaoCadastro, 'prazo'> & { prazo: string };

const VAZIO: FormMissao = { titulo: '', descricao: '', impacto: 'ROTINA', prazo: '' };

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Missões: sugestões do Criador para a comunidade (demonstração: a API não tem essa tabela)
export default function MissoesComunidade({ comunidade }: MissoesComunidadeProps) {
  const {
    usuario,
    missoes,
    minhasComunidades,
    criarMissao,
    editarMissao,
    encerrarMissao,
    entrarComunidade,
    seguirSugestao,
  } = useSimulador();
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormMissao>({ defaultValues: VAZIO });

  const ehCriador = ehDono(comunidade, usuario);
  const daComunidade = missoes.filter((m) => m.idComunidade === comunidade.id);
  const ativas = daComunidade.filter((m) => !m.encerrada);
  const encerradas = daComunidade.filter((m) => m.encerrada);
  const participa = minhasComunidades.some((c) => c.id === comunidade.id);

  if (!ehCriador && ativas.length === 0) return null;

  // Abre o formulário vazio (nova missão) ou com os dados da missão (edição)
  const abrir = (missao?: Missao) => {
    reset(
      missao
        ? { titulo: missao.titulo, descricao: missao.descricao, impacto: missao.impacto, prazo: missao.prazo ?? '' }
        : VAZIO,
    );
    setEditando(missao?.id ?? null);
    setAberto(true);
  };

  const salvar: SubmitHandler<FormMissao> = (dados) => {
    const missao: MissaoCadastro = {
      titulo: dados.titulo.trim(),
      descricao: dados.descricao.trim(),
      impacto: dados.impacto,
      prazo: dados.prazo || undefined,
    };
    if (editando) editarMissao(editando, missao);
    else criarMissao(comunidade.id, missao);
    setEditando(null);
    setAberto(false);
  };

  // Só membros publicam (a API responde 409 para os outros): quem não participa entra antes de registrar
  const registrar = async (missao: Missao) => {
    setErro('');
    try {
      if (!participa) await entrarComunidade(comunidade.id);
      seguirSugestao({
        tela: 'nova-postagem',
        idComunidade: comunidade.id,
        impacto: missao.impacto,
        missao: missao.titulo,
      });
    } catch (err) {
      setErro(mensagemDoErro(err));
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 pt-1 text-sm font-bold uppercase tracking-wider text-slate-500">
        <FiTarget size={16} /> Missões da comunidade
      </h2>

      {ehCriador && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="rounded-xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 px-3 py-2 text-xs">
            Missões são sugestões para a comunidade. Elas não dão pontos extras: as ações seguem a pontuação normal da
            categoria.
          </p>

          {!aberto ? (
            <button
              type="button"
              onClick={() => abrir()}
              className="w-full rounded-full bg-[#4F46E5] py-2.5 text-sm font-bold text-white cursor-pointer"
            >
              Criar missão
            </button>
          ) : (
            <form onSubmit={handleSubmit(salvar)} noValidate className="space-y-3">
              <div>
                <label htmlFor="missao-titulo" className="mb-1 block text-xs font-bold">
                  Título
                </label>
                <input
                  id="missao-titulo"
                  placeholder="Ex.: Semana da composteira"
                  aria-invalid={errors.titulo ? 'true' : 'false'}
                  className={classeCampo}
                  {...register('titulo', regrasTituloMissao)}
                />
                {errors.titulo && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="missao-descricao" className="mb-1 block text-xs font-bold">
                  Descrição curta (o que fazer e como registrar)
                </label>
                <textarea
                  id="missao-descricao"
                  rows={3}
                  aria-invalid={errors.descricao ? 'true' : 'false'}
                  className={`${classeCampo} resize-none`}
                  {...register('descricao', regrasDescricaoMissao)}
                />
                {errors.descricao && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="missao-impacto" className="mb-1 block text-xs font-bold">
                  Tipo de impacto sugerido
                </label>
                <select id="missao-impacto" className={classeCampo} {...register('impacto')}>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.impacto}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="missao-prazo" className="mb-1 block text-xs font-bold">
                  Prazo (opcional)
                </label>
                <input id="missao-prazo" type="date" className={classeCampo} {...register('prazo')} />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#4F46E5] py-2.5 text-sm font-bold text-white cursor-pointer"
                >
                  Salvar missão
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {ehCriador && ativas.length === 0 && <p className="text-xs text-slate-500">Nenhuma missão ativa no momento.</p>}

      {ativas.map((missao) => {
        const categoria = buscarCategoriaPorImpacto(missao.impacto);
        return (
          <article key={missao.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold">{missao.titulo}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{missao.descricao}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
              {categoria && (
                <span className="rounded-full border border-[#4F46E5]/25 bg-[#4F46E5]/5 px-2.5 py-1 text-[#4F46E5]">
                  {categoria.nome} · {formatarPontos(categoria.pontosAcao)} pts
                </span>
              )}
              {missao.prazo && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Até {formatarData(missao.prazo)}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => registrar(missao)}
              className="mt-3 w-full rounded-full bg-[#4F46E5] py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              {participa ? 'Registrar ação desta missão' : 'Entrar e registrar ação desta missão'}
            </button>

            {ehCriador && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => abrir(missao)}
                  className="rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold cursor-pointer"
                >
                  Editar missão
                </button>
                <button
                  type="button"
                  onClick={() => encerrarMissao(missao.id)}
                  className="rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  Encerrar missão
                </button>
              </div>
            )}
          </article>
        );
      })}

      {ehCriador &&
        encerradas.map((missao) => (
          <div
            key={missao.id}
            className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3"
          >
            <span className="text-xs font-semibold text-slate-500">{missao.titulo}</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
              Encerrada
            </span>
          </div>
        ))}

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      <p className="text-center text-[11px] text-slate-500">Demonstração: as missões ficam só no front.</p>
    </section>
  );
}