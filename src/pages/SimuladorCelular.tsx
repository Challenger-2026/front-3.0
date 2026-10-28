import Celular from '../components/simulador/Celular';
import AppSoulUp from '../components/simulador/AppSoulUp';
import PainelExplicacao from '../components/simulador/PainelExplicacao';
import TelaAtual from '../components/simulador/TelaAtual';
import PerfisTeste from '../components/simulador/PerfisTeste';

// Aba do celular (/simulador): o app à esquerda e a explicação de cada tela ao lado
export default function SimuladorCelular() {
  return (
    <div className="space-y-8">
      <p className="text-center text-stone-700">
        Navegue pelo app no celular. A explicação ao lado muda a cada tela.
      </p>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <Celular>
            <AppSoulUp>
              <TelaAtual/>
            </AppSoulUp>
          </Celular>
        </div>

        <div className="space-y-6">
          <PainelExplicacao/>
          <PerfisTeste/>
        </div>
      </div>
    </div>
  );
}