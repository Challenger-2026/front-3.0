import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import { FeedbackProvider } from './context/FeedbackContext';

import App from './App.tsx';
import Home from './pages/Home';
import Solucao from './pages/Solucao';
import Sobre from './pages/Sobre';
import Faq from './pages/Faq';
import Integrantes from './pages/Integrantes';
import Contato from './pages/Contato';
import Simulador from './pages/Simulador';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/solucao', element: <Solucao /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/faq', element: <Faq /> },
      { path: '/integrantes', element: <Integrantes /> },
      { path: '/integrantes/:rm', element: <Integrantes /> },
      { path: '/contato', element: <Contato /> },
      { path: '/simulador', element: <Simulador /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FeedbackProvider>
      <RouterProvider router={router} />
    </FeedbackProvider>
  </StrictMode>,
);