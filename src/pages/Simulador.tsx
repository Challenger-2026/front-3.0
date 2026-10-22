import { SimuladorProvider } from '../context/SimuladorContext';
import Celular from '../components/simulador/Celular';
import AppSoulUp from '../components/simulador/AppSoulUp';
import PainelExplicacao from '../components/simulador/PainelExplicacao';
import TelaAtual from '../components/simulador/TelaAtual';
import PerfisTeste from '../components/simulador/PerfisTeste';

export default function Simulador() {
  return (
    <SimuladorProvider>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#a84312]">Simulador do Soul Up</h1>
          <p className="mt-2 text-stone-700">
            Navegue pelo app no celular. A explicação ao lado muda a cada tela.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Celular>
            <AppSoulUp>
              <TelaAtual/>
            </AppSoulUp>
          </Celular>

          <div className="space-y-6">
            <PainelExplicacao/>
            <PerfisTeste/>
          </div>
        </div>
      </div>
    </SimuladorProvider>
  );
}