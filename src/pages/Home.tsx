import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiTarget, FiAward } from 'react-icons/fi';
import CardMini, { type CardMiniProps } from '../components/CardMini';
import Reveal from '../components/Reveal'; 

const listaResumo: CardMiniProps[] = [
  {
    titulo: 'Descrição',
    icone: FiFileText,
    frase: 'Ações sustentáveis viram pontos, desafios e ranking.',
    descricao:
      'O projeto Lobo-guará Tech transforma ações sustentáveis em um sistema de recompensas e desafios com rankeamento. Unindo inovação incremental e disruptiva, conectamos mecanismos já existentes com as lacunas da sustentabilidade — criando uma plataforma de gamificação que torna o engajamento ambiental tangível e motivador.',
  },
  {
    titulo: 'Objetivo',
    icone: FiTarget,
    frase: 'Fazer da sustentabilidade um hábito com recompensas reais.',
    descricao:
      'Colocar o usuário no centro da solução: tornar a sustentabilidade não apenas uma escolha consciente, mas um hábito reforçado por recompensas reais. A plataforma escala o impacto ambiental de forma ágil, transformando o compromisso com o planeta em uma experiência digital recompensadora.',
  },
  {
    titulo: 'Diferencial',
    icone: FiAward,
    frase: 'Comunidades com ONGs, ligas e distintivos da fauna brasileira.',
    descricao:
      'Comunidades ligadas a ONGs focadas em impacto ambiental e um sistema de ranking. Sistema de medalhas mensais inspirado na fauna brasileira, rankeamento entre usuários e ciclos de engajamento personalizados. A identidade do lobo-guará reforça o vínculo entre tecnologia e natureza, criando uma experiência única e com propósito.',
  },
];
// O parágrafo dividido em array de palavras para o efeito de scroll
const palavrasReveal = "Nossa plataforma vai além de um aplicativo de tarefas: criamos uma rede de impacto socioambiental. Através da união entre tecnologia, validação comunitária e incentivos reais, transformamos a conscientização ecológica em hábitos diários e mensuráveis.".split(" ");

export default function Home() {
  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  const revealRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null); // Referência para o título gigante
  
  const [progressoTexto, setProgressoTexto] = useState(0);
  const [distanciaTitulo, setDistanciaTitulo] = useState(0); // Estado para o parallax

  useEffect(() => {
    const handleScroll = () => {
      if (revealRef.current) {
        const { top, height } = revealRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const distanciaRolavel = height - windowHeight;
        let progresso = -top / distanciaRolavel;
        
        // Limitar o progresso entre 0 e 1
        progresso = Math.max(0, Math.min(1, progresso));
        setProgressoTexto(progresso);
      }

      if (tituloRef.current) {
        const { top } = tituloRef.current.getBoundingClientRect();
        setDistanciaTitulo(top);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <main className="relative w-[100vw] left-1/2 -translate-x-1/2 -mt-8">
      
      <section className="sticky top-0 h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20 bg-stone-900"
        >
          <source src="/video-cerrado.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-stone-900/60 -z-10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in mb-24">
          <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            Tecnologia com rastro de inovação e <span className="text-[#D35400]">sustentabilidade</span>
          </h1>
          <p className="text-stone-200 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow-md font-medium">
            Transformamos ações sustentáveis em recompensas reais unindo gamificação, tecnologia e hábitos sustentáveis.
          </p>
          <Link to="/sobre" className={`${efeitoOnda} inline-flex items-center justify-center px-10 py-4 rounded-xl bg-[#D35400] hover:bg-[#b84500] text-white font-bold text-lg shadow-2xl transition-all duration-300 select-none hover:-translate-y-1 active:scale-95`}>
            Conheça o Projeto
          </Link>
        </div>
      </section>

      <section className="relative z-20 bg-[#fffbed] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%] drop-shadow-[0_-15px_15px_rgba(0,0,0,0.35)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px] sm:h-[120px] md:h-[160px]">
            <path d="M0,15 C30,20 60,40 80,60 C110,90 130,115 160,115 C190,115 200,85 220,85 C240,85 250,105 280,105 C320,105 340,40 390,40 C420,40 450,70 480,70 C520,70 550,10 600,10 C650,10 680,55 730,55 C770,55 790,35 830,35 C870,35 890,65 940,65 C980,65 1010,25 1050,25 C1090,25 1130,65 1200,65 L1200,120 L0,120 Z" className="fill-[#fffbed]"></path>
          </svg>
        </div>

        <div className="w-full flex flex-col items-center">
          
          <div ref={tituloRef} className="w-full pt-10 pb-8 flex flex-col items-center justify-center text-center px-4 relative z-10 overflow-hidden">
            <h2 className="font-black uppercase tracking-tighter leading-[0.85] text-[#D35400] text-[11vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] select-none flex flex-col">
              <span 
                className="inline-block transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${distanciaTitulo * -0.35}px)` }}
              >
                O Ecossistema
              </span>
              <span 
                className="inline-block transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${distanciaTitulo * 0.35}px)` }}
              >
                Lobo-guará
              </span>
            </h2>
          </div>

          <div ref={revealRef} className="relative w-full h-[200vh] mb-12">
            <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center px-6 md:px-12">
              <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-center max-w-5xl leading-tight md:leading-tight">
                {palavrasReveal.map((palavra, index) => {
                  const threshold = index / palavrasReveal.length;
                  const estaAtiva = progressoTexto > threshold;
                  
                  const isHighlight = palavra.includes('impacto') || palavra.includes('socioambiental') || palavra.includes('conscientização') || palavra.includes('ecológica');

                  return (
                    <span 
                      key={index} 
                      className={`inline-block mr-2 md:mr-3 transition-colors duration-300 ${
                        estaAtiva 
                          ? isHighlight ? 'text-[#D35400]' : 'text-stone-900' 
                          : 'text-[#c2ab84]'
                      }`}
                    >
                      {palavra}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>


        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
          <Reveal delay={200}>
            <h2 id="resumo-title" className="text-3xl sm:text-4xl font-extrabold text-[#D35400] text-center mb-14">
              O Projeto em Resumo
              <div className="w-24 h-1.5 bg-[#D35400]/40 mx-auto mt-4 rounded-full"></div>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full max-w-md lg:max-w-none">
            {listaResumo.map((item, index) => (
              <Reveal key={item.titulo} delay={300 + index * 150}>
                <CardMini {...item} />
              </Reveal>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}