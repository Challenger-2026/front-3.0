import { useState, useEffect } from 'react';
import TimelineItem from '../components/TimelineItem';
import Reveal from '../components/Reveal';

export interface CardSolucaoItem {
  numero: string;
  titulo: string;
  descricao: string;
}

export interface EtapaRoadmap {
  numero: number;
  titulo: string;
  descricao: string;
}

const cardsSolucao: CardSolucaoItem[] = [
  {
    numero: '01',
    titulo: 'Inovação Incremental',
    descricao:
      'Pegamos mecanismos de recompensas que já funcionam e os adaptamos para a causa ambiental.',
  },
  {
    numero: '02',
    titulo: 'Gamificação Real',
    descricao:
      'Transformamos o "dever" em "prazer" através de ciclos de feedback e reconhecimento social.',
  },
  {
    numero: '03',
    titulo: 'Impacto Tangível',
    descricao:
      'Pontos que se tornam medalhas da fauna e benefícios reais em parceiros ESG.',
  },
  {
    numero: '04',
    titulo: 'Comunidades Parceiras',
    descricao:
      'Criação de comunidades engajadas para uma aproximação com as causas ambientais.',
  },
];

const etapasRoadmap: EtapaRoadmap[] = [
  {
    numero: 1,
    titulo: 'Definição do problema',
    descricao:
      'Buscamos solucionar a lacuna de transformar ações sustentáveis em um sistema de recompensa e desafios com rankeamento, atingindo o usuário e seu ciclo de engajamento, pensando em seus objetivos e motivações.',
  },
  {
    numero: 2,
    titulo: 'Gamificação',
    descricao:
      'Desenvolvemos um Sistema de Gamificação Sustentável integrado à plataforma, impulsionado por um algoritmo inteligente de pontuação. Em vez de valores fixos, o sistema calcula os pontos com base no tipo de atividade, frequência, consistência e impacto real da ação do usuário. Essa métrica alimenta um sistema de rankeamento que converte engajamento ecológico em recompensas tangíveis. A solução ainda promove o ecossistema social através de comunidades moderadas ligadas a ONGs — dando visibilidade às suas causas — e conecta empresas parceiras para a oferta de benefícios diversos.',
  },
  {
    numero: 3,
    titulo: 'Futuro',
    descricao:
      'Iremos integrar com banco de dados para salvar as pontuações dos usuários, desenvolvimento do algoritmo, conexão com APIs de empresas parceiras para o resgate de recompensas tangíveis e implementação no aplicativo mobile nativo da Lobo-guará Tech.',
  },
];

export default function Sobre() {
  const [progressoScroll, setProgressoScroll] = useState(0);

  useEffect(() => {
    const atualizarProgresso = () => {
   
      const scrollAtual = window.scrollY;
    
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      
      if (alturaTotal > 0) {
        // Transforma em porcentagem (0 a 100)
        const porcentagem = (scrollAtual / alturaTotal) * 100;
        setProgressoScroll(porcentagem);
      } else {
        setProgressoScroll(0);
      }
    };

    window.addEventListener('scroll', atualizarProgresso);
  
    atualizarProgresso();

    return () => window.removeEventListener('scroll', atualizarProgresso);
  }, []);

  return (
    <>

      <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-[100] pointer-events-none">
        <div 
          className="h-full bg-[#D35400] transition-all duration-150 ease-out rounded-r-full shadow-[0_0_10px_rgba(211,84,0,0.5)]"
          style={{ width: `${progressoScroll}%` }}
        ></div>
      </div>

      <main className="w-full max-w-5xl mx-auto px-4 py-10 space-y-16 relative">
        <section aria-labelledby="contexto-title" className="space-y-4">
          <Reveal>
            <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
              <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
                O Desafio
              </span>
              <h1
                id="contexto-title"
                className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
              >
                Contexto e o Problema
              </h1>
            </div>
          </Reveal>

          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <Reveal delay={150}>
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed max-w-xl">
                <p>
                  Vivemos na era da <strong className="text-stone-900 font-semibold">Sociedade 5.0</strong>, onde a tecnologia deve servir ao bem-estar humano. No entanto, enfrentamos um paradoxo: estamos mais conectados do que nunca, mas desconectados das urgências ambientais do nosso próprio bioma.
                </p>
                <p>
                  O grande desafio atual não é apenas a falta de informação, mas a{' '}
                  <strong className="text-stone-900 font-semibold">falha no engajamento</strong>. Ações sustentáveis são vistas como tarefas isoladas e cansativas, sem um retorno imediato ou social que motive a constância.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <aside
                role="figure"
                aria-label="Estatística: 60% do Cerrado pode desaparecer se não houver inovação na preservação"
                className="group bg-[#1C1C1C] text-white p-6 sm:p-8 rounded-2xl w-full md:w-64 flex flex-col items-center justify-center text-center shadow-md shrink-0 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
              >
                <span className="text-4xl sm:text-5xl font-black text-[#D35400] tracking-tight mb-2 transition-transform duration-300 group-hover:-translate-y-1">
                  60%
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-snug">
                  do Cerrado pode desaparecer se não houver inovação na preservação.
                </p>
                
                <div className="max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4">
                  <p className="text-xs text-orange-200 border-t border-stone-700 pt-3 text-left">
                    <strong className="text-white block mb-1">Curiosidade:</strong> 
                    O Cerrado é o "berço das águas" do Brasil. A sua destruição impacta bacias hidrográficas de todo o continente sul-americano.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="solucao-title" className="space-y-6">
          <Reveal>
            <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
              <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
                Nossa Resposta
              </span>
              <h2
                id="solucao-title"
                className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
              >
                A Solução Lobo-guará Tech
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardsSolucao.map((item, index) => (
              <Reveal key={item.numero} delay={150 + index * 100}>
                <article className="bg-white rounded-2xl p-6 shadow-sm border-b-4 border-[#D35400] border-t border-l border-r border-stone-100 flex flex-col text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                  <span className="text-xs font-bold text-[#D35400] bg-orange-50 px-2.5 py-1 rounded-md w-fit mb-4">
                    {item.numero}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{item.titulo}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.descricao}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="roadmap-title" className="space-y-6">
          <Reveal>
            <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
              <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
                Próximos Passos
              </span>
              <h2
                id="roadmap-title"
                className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
              >
                Roadmap de Desenvolvimento
              </h2>
            </div>
          </Reveal>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-[2px] before:bg-stone-200">
            {etapasRoadmap.map((etapa, index) => (
              <Reveal key={etapa.numero} delay={200 + index * 150}>
                <TimelineItem {...etapa} />
              </Reveal>
            ))}
          </div>
        </section>
        
      </main>
    </>
  );
}