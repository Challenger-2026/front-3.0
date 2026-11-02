import { useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BotaoTopo from './components/BotaoTopo';


export default function App() {
  const location = useLocation();
  const nomeProjeto = 'Lobo-guará Tech';
  const caminhoAnterior = useRef(location.pathname);

  useEffect(() => {
    const entreIntegrantes =
      caminhoAnterior.current.startsWith('/integrantes') &&
      location.pathname.startsWith('/integrantes');
    caminhoAnterior.current = location.pathname;

    if (!entreIntegrantes) window.scrollTo(0, 0);

    let titulo = 'Lobo-guará Tech';
    if (location.pathname === '/sobre') titulo = 'Sobre Nós | Lobo-guará Tech';
    else if (location.pathname === '/solucao') titulo = 'Nossa Solução | Lobo-guará Tech';
    else if (location.pathname === '/faq') titulo = 'Perguntas Frequentes | Lobo-guará Tech';
    else if (location.pathname === '/contato') titulo = 'Contato | Lobo-guará Tech';
    else if (location.pathname.startsWith('/simulador')) titulo = 'Simulador | Lobo-guará Tech';
    else if (location.pathname.startsWith('/integrantes')) return;

    document.title = titulo;
  }, [location.pathname]);

  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-x-clip bg-[#fffbed] text-stone-900">
      <Header titulo={nomeProjeto} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>

      <Footer />
      <BotaoTopo />
    </div>
  );
}