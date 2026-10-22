import { Link } from 'react-router-dom';
import CardMini, { type CardMiniProps } from '../components/CardMini';
import Reveal from '../components/Reveal'; 


const listaResumo: CardMiniProps[] = [
  {
    icone: '🪴',
    titulo: 'Descrição',
    descricao:
      'O projeto Lobo-guará Tech transforma ações sustentáveis em um sistema de recompensas e desafios com rankeamento. Unindo inovação incremental e disruptiva, conectamos mecanismos já existentes com as lacunas da sustentabilidade — criando uma plataforma de gamificação que torna o engajamento ambiental tangível e motivador.',
  },
  {
    icone: '🎯',
    titulo: 'Objetivo',
    descricao:
      'Colocar o usuário no centro da solução: tornar a sustentabilidade não apenas uma escolha consciente, mas um hábito reforçado por recompensas reais. A plataforma escala o impacto ambiental de forma ágil, transformando o compromisso com o planeta em uma experiência digital recompensadora.',
  },
  {
    icone: '🏆',
    titulo: 'Diferencial',
    descricao:
      'Comunidades ligadas a ONGs focadas em impacto ambiental e um sistema de ranking. Sistema de medalhas mensais inspirado na fauna brasileira, rankeamento entre usuários e ciclos de engajamento personalizados. A identidade do lobo-guará reforça o vínculo entre tecnologia e natureza, criando uma experiência única e com propósito.',
  },
];

export default function Home() {
  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

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

        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10 mb-16">
          <Reveal delay={100}>
            <div className="w-full bg-[#fffdf5] rounded-2xl px-8 py-10 border border-[#ead9b6]/40 shadow-sm text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold text-stone-900 mb-6">
                O Ecossistema Lobo-guará Tech
              </h2>
              <p className="text-stone-700 leading-relaxed text-base sm:text-lg">
                Nossa plataforma vai além de um aplicativo de tarefas: criamos uma <strong className="text-stone-900">rede de impacto socioambiental</strong>. Através da união entre tecnologia, validação comunitária e incentivos reais, transformamos a conscientização ecológica em hábitos diários e mensuráveis. 
              </p>
            </div>
          </Reveal>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
          <Reveal delay={200}>
            <h2 id="resumo-title" className="text-3xl sm:text-4xl font-extrabold text-[#D35400] text-center mb-14">
              O Projeto em Resumo
              <div className="w-24 h-1.5 bg-[#D35400]/40 mx-auto mt-4 rounded-full"></div>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full">
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