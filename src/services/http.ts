import type { ErroApi, ErroComStatus, MetodoRequisicao, OpcoesRequisicao, RegistroRequisicao } from '../types/types';

// ----- Para onde vão as chamadas -----
const JSON_SERVER_URL = 'http://localhost:5000';
export const BASE_URL = import.meta.env.VITE_API_URL ?? JSON_SERVER_URL;

// Apontando para a porta 5000, o front está usando o json-server (db.json)
export const USANDO_JSON_SERVER = BASE_URL === JSON_SERVER_URL;

const HEADERS_JSON = { 'Content-Type': 'application/json' };

// Erro com a mensagem e o status da API (a tela usa o status, ex.: 403 na fila de moderação)
export const erroDaApi = (mensagem: string, status: number): ErroComStatus => Object.assign(new Error(mensagem), { status });

// ----- Registro das chamadas (usado depois pelo painel de requisições ao vivo) -----

// Nunca aparecem no registro: o login do json-server manda a senha na URL
const PARAMETROS_SENSIVEIS = ['senha', 'cpf', 'email'];

// Tira os valores sensíveis da rota: /usuarios?username=ana&senha=123 → /usuarios?username=ana&senha=***
const rotaSegura = (caminho: string) => {
  const [rota, consulta] = caminho.split('?');
  if (!consulta) return rota;
  const parametros = consulta.split('&').map((par) => {
    const [nome] = par.split('=');
    return PARAMETROS_SENSIVEIS.includes(nome) ? `${nome}=***` : par;
  });
  return `${rota}?${parametros.join('&')}`;
};

type OuvinteRequisicao = (registro: RegistroRequisicao) => void;

// Quem quer saber de cada chamada (na etapa 2, o contexto do painel)
let ouvintes: OuvinteRequisicao[] = [];
let proximoId = 1;

// Começa a ouvir; devolve a função que para de ouvir (para o retorno do useEffect)
export const ouvirRequisicoes = (ouvinte: OuvinteRequisicao) => {
  ouvintes = [...ouvintes, ouvinte];
  return () => {
    ouvintes = ouvintes.filter((o) => o !== ouvinte);
  };
};

const registrar = (dados: Omit<RegistroRequisicao, 'id'>) => {
  const registro: RegistroRequisicao = { id: proximoId++, ...dados };
  ouvintes.forEach((ouvinte) => ouvinte(registro));
};

// ----- A única função que chama o fetch -----
// Faz a chamada, mede o tempo, registra e trata a resposta como o tratarResposta fazia:
// erro → repassa a mensagem "erro" da API Java; 204 ou 201 sem corpo → undefined
export const requisitar = async <T>(metodo: MetodoRequisicao, caminho: string, opcoes: OpcoesRequisicao): Promise<T> => {
  const inicio = Date.now();
  const base = {
    metodo,
    rota: rotaSegura(caminho),
    horario: new Date(inicio).toISOString(),
    apoio: opcoes.apoio ?? false,
  };

  let response: Response;
  try {
    response = await fetch(
      `${BASE_URL}${caminho}`,
      opcoes.corpo === undefined
        ? { method: metodo }
        : { method: metodo, headers: HEADERS_JSON, body: JSON.stringify(opcoes.corpo) },
    );
  } catch (err) {
    // TypeError do fetch: o mensagemDoErro (utils/erros.ts) mostra "Não foi possível conectar…"
    registrar({ ...base, status: null, tempoMs: Date.now() - inicio, erro: 'Sem resposta da API' });
    throw err;
  }

  const tempoMs = Date.now() - inicio;

  if (!response.ok) {
    let mensagem = opcoes.mensagemErro;
    try {
      const corpo: ErroApi = await response.json();
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // resposta sem JSON: fica a mensagem padrão
    }
    registrar({ ...base, status: response.status, tempoMs, erro: mensagem });
    throw erroDaApi(mensagem, response.status);
  }

  registrar({ ...base, status: response.status, tempoMs });

  if (response.status === 204) return undefined as T; // 204 No Content: sem corpo (DELETE)
  // 201 sem corpo (ex.: entrar na comunidade): lê como texto antes de converter
  const texto = await response.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
};