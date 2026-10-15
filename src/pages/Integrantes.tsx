import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardIntegrante from '../components/CardIntegrante';
import Botao from '../components/Botao';
import type { IntegranteProps } from '../types/types';

import foto1 from '../assets/Pic4.png';
import foto2 from '../assets/Pic2.png';
import foto3 from '../assets/Pic1.png';
import foto4 from '../assets/Pic3.png';
import foto5 from '../assets/Pic5.png';

const listaIntegrantes: IntegranteProps[] = [
  {
    nome: 'Ana Carolina Orcelli Bautzer',
    rm: '570281',
    turma: '1TDSPI',
    foto: foto1,
    funcao: 'Líder de Projeto',
    contribuicao: [
      'Gestão e Qualidade: Coordenação do fluxo da equipe, controle de prazos e revisão final de código e conformidade dos artefatos.',
      'Banco de Dados: Modelagem física no Oracle Data Modeler e geração do script DDL com constraints de integridade (PK, FK, CHECK, UNIQUE).',
      'Engenharia de Software: Validação das regras de negócio e suporte na estruturação dos diagramas de casos de uso e atividades.',
    ],
    github: 'https://github.com/anabautzer',
    linkedin: 'https://www.linkedin.com/in/ana-bautzer/',
  },
  {
    nome: 'Eduardo Lima de Souza',
    rm: '570412',
    turma: '1TDSPI',
    foto: foto2,
    funcao: 'Front-End',
    contribuicao: [
      'Arquitetura e SPA: Migração para React, Vite e TypeScript com rotas dinâmicas via React Router.',
      'Interface e Estilo: Componentização modular e layout 100% responsivo com Tailwind CSS.',
      'Formulários e Regras: Validação reativa com React Hook Form tipado e acessibilidade semântica.',
    ],
    github: 'https://github.com/duduutech',
    linkedin: 'https://www.linkedin.com/in/duduulimatech/',
  },
  {
    nome: 'Lucas Costa Serrano',
    rm: '571016',
    turma: '1TDSPI',
    foto: foto3,
    funcao: 'Python',
    contribuicao: [
      'Interface e CRUD: Criação do sistema de menus e submenus interativos para acesso às operações do CRUD.',
      'Estrutura de Dados: Funções modulares documentadas para organização e filtro de dados em listas de dicionários.',
      'Tratamento e Validação: Validação de entradas e tratamento de erros de execução com try, except, else e finally.',
    ],
    github: 'https://github.com/luckz4',
    linkedin: 'https://www.linkedin.com/in/lucas-costa-serrano-647327278/',
  },
  {
    nome: 'Lucas Fortunato Brandão de Pinho',
    rm: '572860',
    turma: '1TDSPI',
    foto: foto4,
    funcao: 'ChatBot e IA',
    contribuicao: [
      'Curadoria do Dataset: Coleta, higienização e estruturação da base de dados tabular aderente ao desafio.',
      'Engenharia de Dados: Mapeamento de atributos de entrada (features), qualidade dos registros e definição do label.',
      'Documentação Técnica: Análise da volumetria, justificativa da origem dos dados e objetivos para o modelo de IA.',
    ],
    github: 'https://github.com/Loutcoun',
    linkedin: 'https://www.linkedin.com/in/lucas-fortunato-317643397/',
  },
  {
    nome: 'Nicolas Rodrigues Martins',
    rm: '573178',
    turma: '1TDSPW',
    foto: foto5,
    funcao: 'Java',
    contribuicao: [
      'Modelagem & OOP: Estruturação das entidades da camada Model com encapsulamento, construtores e métodos de acesso.',
      'Regras de Negócio: Implementação dos métodos principais com a lógica da solução e classe executável de testes.',
      'Persistência & DAO: Configuração da classe de conexão JDBC e operações completas de CRUD na camada DAO.',
    ],
    github: 'https://github.com/NickRM22',
    linkedin: 'https://www.linkedin.com/in/nicolas-rodrigues-martins-126607360/',
  },
];

export default function Integrantes() {
  const { rm } = useParams<{ rm?: string }>();
  const navigate = useNavigate();

  const selecionado = listaIntegrantes.find((item) => item.rm === rm);

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  useEffect(() => {
    document.title = selecionado
      ? `${selecionado.nome} | Lobo-guará Tech`
      : 'Integrantes | Lobo-guará Tech';
  }, [selecionado]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 text-center">
      <h1 className="text-3xl font-extrabold text-[#a84312] mb-3">Nossa Equipe</h1>

      <p className="max-w-3xl mx-auto mb-10 py-6 px-6 sm:px-8 bg-[#fffdf5]/95 rounded-2xl relative z-10 text-stone-700 text-sm leading-relaxed border border-[#ead9b6]/40 shadow-sm">
        A Lobo-guará Tech nasceu com o propósito de unir a inovação tecnológica da Sociedade 5.0 à
        urgência da preservação ambiental. Nosso objetivo é transformar hábitos ecológicos do dia a
        dia em uma experiência engajadora e recompensadora através da gamificação. Acreditamos que o
        desenvolvimento de sistemas deve servir ao bem-estar planetário, provando que linhas de
        código podem ser ferramentas ativas para proteger nossa biodiversidade e construir um futuro
        sustentável.
      </p>

      {rm && !selecionado && (
        <p role="status" className="mb-6 text-[#a84312] font-semibold">
          Integrante não encontrado. Escolha uma pessoa da equipe abaixo.
        </p>
      )}

      {selecionado && (
        <article className="max-w-xl mx-auto mb-12 p-6 sm:p-8 bg-white border-2 border-orange-500 rounded-2xl shadow-lg flex flex-col items-center transition-all duration-300 animate-fade-in text-center">
          <span className="text-xs font-bold text-[#a84312] uppercase tracking-widest mb-3">
            Integrante em Destaque
          </span>

          <img
            src={selecionado.foto}
            alt={`Foto de ${selecionado.nome}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-orange-500 mb-3 shadow"
          />

          <h2 className="text-2xl font-bold text-stone-900">{selecionado.nome}</h2>

          <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full mt-1 mb-2">
            {selecionado.funcao || 'Membro do Projeto'}
          </span>

          <p className="text-stone-500 text-xs sm:text-sm mb-4">
            <strong className="text-stone-700">RM:</strong> {selecionado.rm} &bull;{' '}
            <strong className="text-stone-700">Turma:</strong> {selecionado.turma}
          </p>

          {selecionado.contribuicao && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 w-full text-stone-700 text-xs sm:text-sm text-left">
              <strong className="text-stone-900 block mb-2 font-bold">
                Contribuição no Projeto:
              </strong>
              <ul className="list-disc pl-5 space-y-2">
                {selecionado.contribuicao.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 w-full mb-6">
            <a
              href={selecionado.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub de ${selecionado.nome}`}
              className={`${efeitoOnda} flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-colors duration-200`}
            >
              GitHub
            </a>
            <a
              href={selecionado.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn de ${selecionado.nome}`}
              className={`${efeitoOnda} flex-1 py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold transition-colors duration-200`}
            >
              LinkedIn
            </a>
          </div>

          <Botao acao={() => navigate('/integrantes')} variante="secundario">
            Limpar Destaque
          </Botao>
        </article>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center items-stretch">
        {listaIntegrantes.map((integrante) => (
          <div
            key={integrante.rm}
            className="w-full max-w-[220px] h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 rounded-xl"
          >
            <CardIntegrante
              nome={integrante.nome}
              rm={integrante.rm}
              turma={integrante.turma}
              foto={integrante.foto}
              github={integrante.github}
              linkedin={integrante.linkedin}
            />
          </div>
        ))}
      </div>
    </main>
  );
}