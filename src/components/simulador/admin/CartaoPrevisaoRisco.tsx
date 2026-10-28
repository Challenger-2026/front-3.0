import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { apiIa } from '../../../services/apiIa';
import { atributosIa } from '../../../data/ia';
import Botao from '../../Botao';
import ResultadoPrevisao from './ResultadoPrevisao';
import type { AtributosComportamento, ClasseRisco, PrevisaoRisco, RegistroPrevisao, UsuarioTeste } from '../../../types/types';

const classeCampo =
  'w-full rounded-lg border border-[#e3cfa8] bg-[#fdf8ec] px-3 py-2 text-sm outline-none focus:border-[#D35400] focus:bg-white';

// Campo vazio vira null (a API preenche o ranking e o tempo); o resto vira número
const paraNumero = (valor: string | number | null) => (valor === '' || valor === null ? null : Number(valor));

// Falha de conexão: no plano free, o Render "dorme" e a primeira chamada demora
const mensagemErroIa = (err: unknown) =>
  err instanceof Error && !(err instanceof TypeError)
    ? err.message
    : 'Não foi possível conectar à API de IA. Ela pode estar acordando no Render: tente de novo em alguns segundos.';

type CartaoPrevisaoRiscoProps = {
  aoMudarEtapa: (etapa: 'inicio' | 'sorteado' | 'previsto') => void;
  aoPrever: (registro: Omit<RegistroPrevisao, 'id' | 'horario'>) => void;
};

export default function CartaoPrevisaoRisco({ aoMudarEtapa, aoPrever }: CartaoPrevisaoRiscoProps){
  const [usuario, setUsuario] = useState<UsuarioTeste | null>(null);
  const [previsao, setPrevisao] = useState<PrevisaoRisco | null>(null);
  const [rotuloComparado, setRotuloComparado] = useState<ClasseRisco | null>(null);
  const [sorteando, setSorteando] = useState<boolean>(false);
  const [erroApi, setErroApi] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AtributosComportamento>();

  const sortear = async () => {
    setErroApi('');
    setSorteando(true);
    try {
      const sorteado = await apiIa.sortearUsuario();
      setUsuario(sorteado);
      setPrevisao(null);
      // os valores sorteados viram o padrão do formulário: o isDirty mostra se alguém mudou algum
      reset({
        total_acoes: sorteado.total_acoes,
        streak_maximo: sorteado.streak_maximo,
        diversidade_categorias: sorteado.diversidade_categorias,
        pontos_totais: sorteado.pontos_totais,
        interacoes_sociais_media: sorteado.interacoes_sociais_media,
        posicao_ranking_media: sorteado.posicao_ranking_media,
        tempo_medio_entre_acoes_dias: sorteado.tempo_medio_entre_acoes_dias,
      });
      aoMudarEtapa('sorteado');
    } catch (err) {
      setErroApi(mensagemErroIa(err));
    } finally {
      setSorteando(false);
    }
  };

  const prever: SubmitHandler<AtributosComportamento> = async (dados) => {
    setErroApi('');
    try {
      const resultado = await apiIa.preverRisco(dados);
      setPrevisao(resultado);
      // só compara com o rótulo real se os valores são exatamente os do usuário sorteado
      const rotulo = usuario && !isDirty ? usuario.rotulo_real : null;
      setRotuloComparado(rotulo);
      aoPrever({
        usuario: usuario ? `Teste ${usuario.usuario_id}${isDirty ? ' (alterado)' : ''}` : 'Preenchido à mão',
        classe: resultado.classe,
        probabilidade_risco: resultado.probabilidade_risco,
        rotuloReal: rotulo,
      });
      aoMudarEtapa('previsto');
    } catch (err) {
      setErroApi(mensagemErroIa(err));
    }
  };

  const aguardando = sorteando || isSubmitting;

  return (
    <section className="space-y-5 rounded-2xl border border-[#e3cfa8] bg-white p-6 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
      <div>
        <h2 className="text-2xl font-extrabold text-[#a84312]">Previsão de risco de abandono</h2>
        <p className="mt-1 text-sm text-stone-600">
          {usuario
            ? `Usuário de teste ${usuario.usuario_id}${isDirty ? ' (valores alterados)' : ''}`
            : 'Sorteie um usuário de teste ou preencha os comportamentos.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(prever)} noValidate className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {atributosIa.map((a) => (
            <div key={a.campo}>
              <label htmlFor={`ia-${a.campo}`} className="mb-1 block text-xs font-bold text-stone-800">
                {a.nome}
              </label>
              <input
                id={`ia-${a.campo}`}
                type="number"
                step="any"
                min={0}
                placeholder={a.opcional ? 'vazio' : ''}
                aria-invalid={errors[a.campo] ? 'true' : 'false'}
                className={classeCampo}
                {...register(a.campo, {
                  setValueAs: paraNumero,
                  validate: (valor) => {
                    if (valor === null) return a.opcional ? true : 'Informe um valor';
                    return valor >= 0 || 'Não pode ser negativo';
                  },
                })}
              />
              {errors[a.campo] ? (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {errors[a.campo]?.message}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-stone-500">{a.ajuda}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Botao variante="secundario" acao={sortear} desabilitado={aguardando}>
            {sorteando ? 'Sorteando…' : 'Sortear usuário'}
          </Botao>
          <Botao tipo="submit" desabilitado={aguardando}>
            {isSubmitting ? 'Prevendo…' : 'Prever'}
          </Botao>
        </div>

        {aguardando && (
          <p className="text-xs text-stone-500">
            Aguardando a API de IA. Se ela estiver dormindo no Render, a primeira chamada pode levar até 1 minuto.
          </p>
        )}
        {erroApi && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {erroApi}
          </p>
        )}
      </form>

      {previsao && <ResultadoPrevisao previsao={previsao} rotuloReal={rotuloComparado} />}
    </section>
  );
}