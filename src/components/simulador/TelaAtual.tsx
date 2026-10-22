import { useSimulador } from '../../hooks/useSimulador';
import TelaInicio from './telas/TelaInicio';
import TelaPerfil from './telas/TelaPerfil';
import TelaAjustes from './telas/TelaAjustes';
import TelaDados from './telas/TelaDados';
import TelaEmConstrucao from './telas/TelaEmConstrucao';
import TelaLogin from './telas/TelaLogin';
import TelaCadastro from './telas/TelaCadastro';
import TelaOnboarding from './telas/TelaOnboarding';
import TelaNovaPostagem from './telas/TelaNovaPostagem';
import TelaAtividades from './telas/TelaAtividades';
import TelaFeedback from './telas/TelaFeedback';
import TelaEditarPostagem from './telas/TelaEditarPostagem';
import TelaPontos from './telas/TelaPontos';
import TelaMetas from './telas/TelaMetas';
import TelaCandidatura from './telas/TelaCandidatura';
import TelaModeracao from './telas/TelaModeracao';
import TelaAnaliseModeracao from './telas/TelaAnaliseModeracao';
import TelaDenuncias from './telas/TelaDenuncias';
import TelaContestacao from './telas/TelaContestacao';

export default function TelaAtual() {
  const { telaAtual, loading, error, carregarDados } = useSimulador();

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-500">Carregando…</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
        <p>{error}</p>
        <button type="button" onClick={carregarDados} className="mt-3 font-bold underline cursor-pointer">
          Tentar novamente
        </button>
      </div>
    );
  }

  switch (telaAtual) {
    case 'login':
      return <TelaLogin />;
    case 'cadastro':
      return <TelaCadastro />;
    case 'onboarding':
      return <TelaOnboarding />;  
    case 'inicio':
      return <TelaInicio />;
    case 'perfil':
      return <TelaPerfil />;
    case 'ajustes':
      return <TelaAjustes />;
    case 'dados':
      return <TelaDados />;
    case 'nova-postagem':
      return <TelaNovaPostagem />;
    case 'atividades':
      return <TelaAtividades />;
    case 'feedback':
      return <TelaFeedback />;
    case 'editar-postagem':
      return <TelaEditarPostagem />;
    case 'pontos':
      return <TelaPontos />;
    case 'metas':
      return <TelaMetas />;
    case 'candidatura':
      return <TelaCandidatura />;
    case 'moderacao':
      return <TelaModeracao />;
    case 'moderacao-analise':
      return <TelaAnaliseModeracao />; 
    case 'denuncias':
      return <TelaDenuncias />;
    case 'contestacao':
      return <TelaContestacao />; 
    default:
      return <TelaEmConstrucao />;
  }
}