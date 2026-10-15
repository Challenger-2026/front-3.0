import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Integrantes from './pages/Integrantes';
import Contato from './pages/Contato';
import Faq from './pages/Faq';
import Home from './pages/Home';
import Solucao from './pages/Solucao';
import Sobre from './pages/Sobre';

function Rotas() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    let titulo = 'Lobo-guará Tech';

    if (location.pathname === '/sobre') {
      titulo = 'Sobre Nós | Lobo-guará Tech';
    } else if (location.pathname === '/solucao') {
      titulo = 'Nossa Solução | Lobo-guará Tech';
    } else if (location.pathname === '/faq') {
      titulo = 'Perguntas Frequentes | Lobo-guará Tech';
    } else if (location.pathname === '/contato') {
      titulo = 'Contato | Lobo-guará Tech';
    } else if (location.pathname.startsWith('/integrantes')) {
      // A página da equipe usa o nome do integrante no título.
      return;
    }

    document.title = titulo;
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solucao" element={<Solucao />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/integrantes/:rm" element={<Integrantes />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const nomeProjeto = 'Lobo-guará Tech';

  return (
    <BrowserRouter>
   
      <div className="relative isolate min-h-screen flex flex-col bg-[#fffbed] text-stone-900 before:content-[''] before:fixed before:inset-0 before:-z-10 before:pointer-events-none before:bg-[url('./assets/papel-fundo.jpg')] before:bg-no-repeat before:bg-center before:bg-cover portrait:before:bg-bottom portrait:before:bg-[length:100%_auto]">
        <Header titulo={nomeProjeto} />

        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Rotas />
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}