import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  ControllerJava,
  ErroComStatus,
  RegistroRequisicao,
  RequisicoesContextType,
  ResultadoVerificacao,
  VerificacaoApi,
} from '../types/types';
import { ouvirRequisicoes } from '../services/http';
import { api } from '../services/api';
import { LIMITE_VERIFICACOES, rotasVerificacao, situacaoDe } from '../data/endpoints';

// Quantas linhas o painel guarda de cada tipo (do Java e de apoio do json-server)
const LIMITE_REQUISICOES = 20;

// O GET sem parâmetro de cada controller: as mesmas funções que o simulador usa ao abrir
const chamadasVerificacao: Record<ControllerJava, () => Promise<unknown>> = {
  UsuarioController: api.getUsuarios,
  ComunidadeController: api.getComunidades,
  PostagemController: api.getPostagens,
  ModeracaoController: api.getModeracoes,
};

const controllers = Object.keys(rotasVerificacao) as ControllerJava[];

// Mede o GET de um controller. Nunca lança erro: a falha vira um resultado "fora".
const medir = async (controller: ControllerJava): Promise<ResultadoVerificacao> => {
  const rota = rotasVerificacao[controller];
  const inicio = Date.now();
  try {
    await chamadasVerificacao[controller]();
    const tempoMs = Date.now() - inicio;
    // GET com sucesso: o Java responde 200
    return { controller, rota, status: 200, tempoMs, situacao: situacaoDe(200, tempoMs) };
  } catch (err) {
    const tempoMs = Date.now() - inicio;
    // TypeError do fetch: a API não respondeu
    const semResposta = err instanceof TypeError;
    const status = semResposta ? null : ((err as ErroComStatus).status ?? null);
    return {
      controller,
      rota,
      status,
      tempoMs,
      erro: semResposta ? 'Sem resposta da API' : (err as Error).message,
      situacao: situacaoDe(status, tempoMs),
    };
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const RequisicoesContext = createContext<RequisicoesContextType | undefined>(undefined);

export const RequisicoesProvider = ({ children }: { children: ReactNode }) => {
  // ----- Painel de requisições ao vivo -----
  const [requisicoes, setRequisicoes] = useState<RegistroRequisicao[]>([]);

  // ----- Página de status -----
  const [verificacoes, setVerificacoes] = useState<VerificacaoApi[]>([]);
  const [verificando, setVerificando] = useState<boolean>(false);

  // Ouve cada chamada do services/http.ts; o retorno para de ouvir quando o Simulador fecha
  useEffect(() => {
    const pararDeOuvir = ouvirRequisicoes((registro) => {
      setRequisicoes((anteriores) => {
        // Guarda até 20 do mesmo tipo (Java ou apoio), para o apoio não empurrar as linhas do Java para fora
        const mesmoTipo = anteriores.filter((r) => r.apoio === registro.apoio).slice(0, LIMITE_REQUISICOES - 1);
        const outroTipo = anteriores.filter((r) => r.apoio !== registro.apoio);
        return [registro, ...mesmoTipo, ...outroTipo].sort((a, b) => b.id - a.id); // mais novas primeiro
      });
    });
    return pararDeOuvir;
  }, []);

  const limparRequisicoes = useCallback(() => setRequisicoes([]), []);

  // Mede os 4 controllers ao mesmo tempo e guarda a verificação (últimas 20 da sessão)
  const verificarAgora = useCallback(async () => {
    setVerificando(true);
    const horario = new Date().toISOString();
    const resultados = await Promise.all(controllers.map(medir));
    setVerificacoes((anteriores) =>
      [{ id: (anteriores[0]?.id ?? 0) + 1, horario, resultados }, ...anteriores].slice(0, LIMITE_VERIFICACOES),
    );
    setVerificando(false);
  }, []);

  return (
    <RequisicoesContext.Provider
      value={{
        requisicoes,
        limparRequisicoes,
        verificacoes,
        verificando,
        verificarAgora,
      }}
    >
      {children}
    </RequisicoesContext.Provider>
  );
};