import { useState } from 'react';
import CardPilar from '../components/CardPilar';
import Reveal from '../components/Reveal';

export interface CardSolucao {
  id: string;
  imagem: string;
  titulo: string;
  descricao: string;
}

export interface EtapaRanking {
  numero: number;
  titulo: string;
  descricao: string;
}

const listaCards: CardSolucao[] = [
  {
    id: 'comunidades',
    imagem: '/img-comunidades.jpg',
    titulo: 'Comunidades Ativas',
    descricao:
      'Os usuários podem se unir em comunidades parceiras com ONGs e unem forças para cumprir macro-desafios, como a revitalização de uma praça ou mutirões de reciclagem.',
  },
  {
    id: 'moderadores',
    imagem: '/img-moderadores.jpg',
    titulo: 'Moderadores Guardiões',
    descricao:
      'Para garantir a integridade do sistema, membros veteranos e engajados atuam como moderadores. Eles são responsáveis por auditar as evidências enviadas pelos usuários.',
  },
  {
    id: 'pontuacao',
    imagem: '/img-pontuacao.jpg',
    titulo: 'Pontuação Inteligente',
    descricao:
      'O sistema considera múltiplos fatores antes de calcular a pontuação final do usuário: tipo da ação, frequência, consistência e o impacto gerado.',
  },
  {
    id: 'ranking',
    imagem: '/img-ranking.jpg',
    titulo: 'Ranking e Ligas',
    descricao:
      'O motor de engajamento do nosso sistema. Dividido em ligas mensais baseadas na fauna brasileira, o ranking estimula a competição saudável.',
  },
  {
    id: 'criadores',
    imagem: '/img-criadores.jpg',
    titulo: 'Criadores de Comunidade',
    descricao:
      'Inicialmente, pensamos nas Comunidades estarem atreladas as ONGs parceiras para ter visibilidade dentro de suas causas.',
  },
  {
    id: 'regras',
    imagem: '/img-regras.jpg',
    titulo: 'Regras do Sistema',
    descricao:
      'Para ser moderador e criador dentro da plataforma, existem regras que o usuário deve seguir inicialmente baseadas no tempo de uso.',
  },
];

const listaEtapas: EtapaRanking[] = [
  {
    numero: 1,
    titulo: 'Ação e Foto',
    descricao: 'Você realiza uma ação e envia a comprovação.',
  },
  {
    numero: 2,
    titulo: 'Validação',
    descricao: 'Moderadores aprovam a veracidade da sua atividade.',
  },
  {
    numero: 3,
    titulo: 'Pontuação',
    descricao: 'Seus pontos sobem no ranking geral da sua comunidade.',
  },
];

export default function Solucao() {
  const [cardAtivo, setCardAtivo] = useState<string | null>(null);

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      
      <section className="w-full mb-16 mt-4">
        <Reveal>
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-200 flex flex-col lg:flex-row gap-10 items-center justify-between">
            
            <div className="lg:w-5/12 space-y-4">
              <span className="text-sm font-bold tracking-widest text-[#D35400] uppercase block">
                Nossa Abordagem
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
                O Ecossistema <br />
                <span className="text-[#D35400]">Lobo-guará Tech</span>
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Nossa plataforma vai muito além de um simples aplicativo de tarefas. Criamos uma <strong className="text-stone-900 font-semibold">rede de impacto socioambiental</strong> baseada em engajamento real.
              </p>
            </div>

            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="bg-[#1C1C1C] p-6 rounded-2xl border border-stone-800 shadow-md transition-transform hover:-translate-y-1">
                <h2 className="text-lg font-bold text-[#D35400] mb-2">União e Tecnologia</h2>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Através de validação comunitária e incentivos reais, conectamos pessoas em prol de um ecossistema mais sustentável e colaborativo.
                </p>
              </div>
              
              <div className="bg-[#1C1C1C] p-6 rounded-2xl border border-stone-800 shadow-md transition-transform hover:-translate-y-1">
                <h2 className="text-lg font-bold text-[#D35400] mb-2">Hábitos Mensuráveis</h2>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Transformamos a conscientização ecológica em ações práticas, desenvolvendo hábitos que são diários, constantes e mensuráveis.
                </p>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

     
      <section aria-labelledby="pilares-title" className="w-full max-w-5xl mx-auto mb-16">
        <h2 id="pilares-title" className="sr-only">
          Pilares da Solução
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {listaCards.map((card, index) => {
            const isAtivo = cardAtivo === card.id;

            return (
              <div key={card.id}>
                <Reveal delay={index * 50}>
                  <CardPilar
                    imagem={card.imagem}
                    titulo={card.titulo}
                    descricao={card.descricao}
                    ativo={isAtivo}
                    onClick={() => setCardAtivo(isAtivo ? null : card.id)}
                  />
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

     
      <section aria-labelledby="ranking-title" className="w-full">
        <div className="bg-[#1C1C1C] rounded-2xl p-8 sm:p-12 text-center text-amber-50 shadow-lg border border-stone-800">
            <h2 id="ranking-title" className="text-2xl sm:text-3xl font-extrabold text-[#D35400] mb-3">
              Como funciona a dinâmica de Ranking?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl mx-auto mb-10 leading-relaxed">
              Todo mês, o ciclo se reinicia e os usuários são distribuídos em Ligas Competitivas. Suas ações diárias ditam sua posição no ecossistema:
            </p>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none">
              {listaEtapas.map((etapa, index) => (
                <Reveal key={etapa.numero} delay={150 + index * 200}>
                  <li className="bg-[#242424] border border-stone-800 rounded-2xl p-6 flex flex-col items-center text-center relative transition-transform duration-300 hover:-translate-y-1 shadow-sm h-full">
                    <span className="w-10 h-10 rounded-full bg-[#D35400] text-white font-bold flex items-center justify-center text-sm mb-4 shadow">
                      {etapa.numero}
                    </span>
                    <h3 className="font-bold text-base text-white mb-2">{etapa.titulo}</h3>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                      {etapa.descricao}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
        </div>
      </section>
      
    </main>
  );
}