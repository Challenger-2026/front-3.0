# Lobo-guará Tech | Tecnologia com Rastro de Inovação e Sustentabilidade

<p align="center">
  <img src="src/assets/Guara.png" alt="Logotipo Lobo-guará Tech" width="160" />
</p>

## 📄 Descrição do Projeto e Objetivo

O projeto Lobo-guará Tech busca solucionar a dificuldade de engajamento ecológico ao transformar atitudes ecológicas em um ciclo contínuo de motivação. Indo ao encontro da junção entre as inovações incremental e disruptiva, a plataforma conecta mecanismos tecnológicos já existentes às lacunas presentes na sustentabilidade. Criamos, assim, um Sistema de Gamificação Sustentável integrado, desenvolvido para converter o impacto ambiental positivo dos usuários em recompensas tangíveis e reconhecimento por meio de rankings e desafios dinâmicos.

O objetivo deste trabalho é consolidar uma solução que coloque o usuário no centro da resolução de problemas ambientais. A proposta visa tornar a sustentabilidade não apenas uma escolha consciente, mas um hábito diário reforçado por incentivos reais. Dessa forma, a plataforma entrega uma ferramenta capaz de escalar o impacto ecológico de maneira ágil, transformando o compromisso com o planeta em uma experiência digital altamente recompensadora.

Nesta Sprint 4, o site passa a ter o **Simulador Lobo-guará Tech**, que consome a **API Java (Spring Boot)** e a **API de IA (Python)** do grupo. Ele tem três abas:

* **Celular:** o aplicativo Soul Up funcionando dentro de um celular, com explicação de cada tela ao lado.
* **Status da API:** a situação das duas APIs e onde cada endpoint é usado.
* **Admin (IA):** previsão de risco de abandono de um usuário com o modelo de IA.

Os detalhes estão na seção [Simulador Lobo-guará Tech](#-simulador-lobo-guará-tech).

## 🧪 Simulador Lobo-guará Tech

O simulador fica em `/simulador` e usa **rotas aninhadas com `Outlet`**. As três abas compartilham o mesmo estado (`SimuladorContext` e `RequisicoesContext`), então trocar de aba não perde o login nem o histórico de requisições.

| Aba | Rota | API usada | O que mostra |
| --- | --- | --- | --- |
| **Celular** | `/simulador` | API Java | O app Soul Up dentro de um celular: cadastro, onboarding, login, postagens de ações sustentáveis, comunidades, moderação às cegas, contestações, ranking (liga semanal e disputa mensal), carteira de pontos e benefícios. Ao lado, um painel explica a tela atual e mostra o endpoint chamado. |
| **Status da API** | `/simulador/status` | API Java e API de IA | Se cada API está no ar (última verificação) e a lista dos 23 endpoints da API Java, com as telas que chamam cada um. |
| **Admin (IA)** | `/simulador/admin` | API de IA | Visão de administração: sorteia um usuário de teste, envia os dados ao modelo e mostra a classe prevista, a probabilidade de risco de abandono, o perfil do agrupamento (K-Means), orientações de retenção e se o modelo acertou o rótulo real. |

### Painel de requisições ao vivo

Todas as chamadas às APIs passam por uma função única (`requisitar`, em `src/services/http.ts`) e aparecem no painel de requisições com o método, o endpoint e o status da resposta. Assim dá para ver, enquanto se navega, onde cada API é usada.

### Endpoints da API de IA

| Método | Endpoint | Uso no simulador |
| :---: | --- | --- |
| `GET` | `/sortear` | Sorteia um dos 50 usuários de teste, com o rótulo real |
| `POST` | `/prever` | Devolve a classe, a probabilidade de risco, o perfil do K-Means e as orientações de retenção |

### Perfis de teste

Todos usam a senha `soulup123` (os mesmos dados no `db.json` e na API Java).

| Usuário | O que demonstra |
| --- | --- |
| `anacarol` | Contestação de rejeição e o 409 do Criador |
| `brunot` | Criador de comunidades |
| `carlam` | Reputação 88: fila de moderação sem as comunidades dela |
| `helenap` | Reputação 96: revisa contestações |
| `diegoa` | Elegível: passa na candidatura a moderador |
| `dudalopes` | Não elegível (taxa de rejeição de 50%) |

### Recursos em demonstração

O que a API Java ainda não tem (missões, temas e respostas do onboarding, distintivos, benefícios, limite diário de moderações e histórico de previsões da IA) fica só no front e aparece com o aviso **"Demonstração"** na própria tela.

## 🛠️ Tecnologias Utilizadas

* **React:** interface como Single Page Application (SPA), com componentes reutilizáveis e hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
* **TypeScript:** tipagem estática de componentes, dados e respostas das APIs (inclusive com `Pick` e `Omit`).
* **Vite:** servidor de desenvolvimento e build da aplicação.
* **React Router:** rotas estáticas, rota dinâmica com parâmetro (`/integrantes/:rm`), rotas aninhadas com `Outlet` no simulador e redirecionamento de rotas inexistentes para a Home.
* **Context API:** estado do simulador e registro das requisições, com hooks próprios (`useSimulador` e `useRequisicoes`).
* **Fetch API:** consumo da API Java e da API de IA com `GET`, `POST`, `PUT`, `PATCH` e `DELETE`, tratamento de erros e de status de resposta.
* **React Hook Form:** validação dos formulários (Contato e telas do simulador).
* **Tailwind CSS:** estilização e responsividade para celular, tablet e desktop.
* **React Icons:** ícones da interface.
* **json-server:** API local de apoio (`db.json`) para testar o front sem a API Java.
* **API Java (Spring Boot):** back-end do projeto, publicado no Render ([repositório](https://github.com/Challenger-2026/java-api)).
* **API de IA (Python/Flask):** modelo de risco de abandono, publicado no Render ([repositório](https://github.com/Challenger-2026/lobo-guara-ia)).
* **Git, GitHub e Git Flow:** versionamento com branches `feature/` a partir da `develop`, pull requests e releases na `main`.
* **Vercel:** deploy da aplicação.

## 🚀 Como Usar

### Links do projeto

* 🔗 **Repositório no GitHub:** [github.com/Challenger-2026/front-3.0](https://github.com/Challenger-2026/front-3.0)
* 🌐 **Aplicação na Vercel:** [https://lobo-guara-swart.vercel.app/](https://lobo-guara-swart.vercel.app/)
* 📹 **Vídeo no YouTube:** [https://youtu.be/bQpkMBSZxE4](https://youtu.be/bQpkMBSZxE4)
* ☕ **API Java publicada (Render):** [https://guara-api.onrender.com](https://guara-api.onrender.com)
* 🤖 **API de IA publicada (Render):** [https://lobo-guara-ia.onrender.com](https://lobo-guara-ia.onrender.com)

### Como executar

```bash
git clone https://github.com/Challenger-2026/front-3.0.git
cd front-3.0
npm install
cp .env.example .env
npm run dev
```

No arquivo `.env`, escolha qual API Java o front vai usar:

```env
# json-server (db.json), rodando com "npm run backend"
VITE_API_URL=http://localhost:5000
# API Java no seu computador
# VITE_API_URL=http://localhost:8080
# API Java publicada no Render
# VITE_API_URL=https://guara-api.onrender.com

# API de IA (Python)
VITE_API_IA_URL=https://lobo-guara-ia.onrender.com
```

Para usar o json-server, rode `npm run backend` em outro terminal. Os demais comandos:

* `npm run build` – confere os tipos e gera a versão final;
* `npm run lint` – verifica as regras de código;
* `npm run preview` – abre a versão gerada pelo build.

### O que testar

* Navegue pelas páginas pelo menu: Home, Sobre, Solução, FAQ, Integrantes, Contato e Simulador.
* Em **Integrantes**, clique em uma pessoa para abrir o painel com a rota `/integrantes/:rm`.
* No **Simulador**, crie uma conta ou entre com um dos [perfis de teste](#perfis-de-teste), publique uma ação sustentável e acompanhe o painel de requisições.
* Na aba **Status da API**, veja se as APIs estão no ar e quais endpoints cada tela usa.
* Na aba **Admin (IA)**, sorteie um usuário de teste e veja a previsão de risco de abandono.
* Confira o layout em celular, tablet e desktop.

**Observação:** as APIs estão no plano gratuito do Render e podem levar alguns segundos para responder na primeira chamada.

## 📂 Estrutura de Pastas do Projeto

```text
front-3.0/
├── public/                         # Favicon, imagens e vídeos da página Solução
│
├── src/
│   ├── assets/                     # Logotipo, fotos dos integrantes, ícones e prints das páginas
│   │
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── Header.tsx              # Cabeçalho e navegação
│   │   ├── Footer.tsx              # Rodapé
│   │   ├── CardIntegrante.tsx      # Card dos integrantes
│   │   ├── FaqItem.tsx             # Item do accordion do FAQ
│   │   ├── Reveal.tsx              # Animação de entrada dos blocos
│   │   ├── ...                     # Botões, cards e linha do tempo
│   │   └── simulador/              # Componentes do simulador
│   │       ├── Celular.tsx         # Moldura do celular
│   │       ├── PainelExplicacao.tsx  # Explicação e endpoint de cada tela
│   │       ├── PainelRequisicoes.tsx # Requisições às APIs ao vivo
│   │       ├── telas/              # Telas do app (cadastro, login, postagens, ranking...)
│   │       └── admin/              # Componentes da aba Admin (IA)
│   │
│   ├── context/                    # SimuladorContext e RequisicoesContext
│   ├── hooks/                      # useSimulador e useRequisicoes
│   ├── services/                   # Chamadas às APIs
│   │   ├── http.ts                 # Função única com o fetch e o registro das requisições
│   │   ├── api.ts                  # Endpoints da API Java
│   │   └── apiIa.ts                # Endpoints da API de IA
│   ├── data/                       # Dados fixos (endpoints, benefícios, explicações...)
│   ├── utils/                      # Validações, formatadores e mensagens de erro
│   │
│   ├── pages/                      # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Sobre.tsx
│   │   ├── Solucao.tsx
│   │   ├── Faq.tsx
│   │   ├── Integrantes.tsx         # Lista e painel do integrante (/integrantes/:rm)
│   │   ├── Contato.tsx
│   │   ├── Simulador.tsx           # Abas do simulador (Outlet)
│   │   ├── SimuladorCelular.tsx    # Aba Celular
│   │   ├── StatusApi.tsx           # Aba Status da API
│   │   └── SimuladorAdmin.tsx      # Aba Admin (IA)
│   │
│   ├── types/types.ts              # Tipos TypeScript
│   ├── App.tsx                     # Layout com Header, Outlet e Footer
│   ├── main.tsx                    # Rotas (createBrowserRouter) e entrada da aplicação
│   └── index.css                   # Tailwind e estilos globais
│
├── db.json                         # Dados do json-server
├── .env.example                    # Modelo das variáveis de ambiente
├── vercel.json                     # Redirecionamento das rotas da SPA na Vercel
├── package.json                    # Dependências e scripts
├── vite.config.ts                  # Configuração do Vite
├── tsconfig*.json                  # Configurações do TypeScript
├── eslint.config.js                # Configuração do ESLint
└── README.md                       # Este arquivo
```

## 👥 Autores e Créditos

Equipe **Lobo-guará Tech**, estudantes de **Análise e Desenvolvimento de Sistemas (ADS)** da **FIAP**:

| Foto | Nome | RM | Turma | Função | Links |
| :---: | --- | :---: | :---: | --- | --- |
| <img src="src/assets/Pic4.png" alt="Ana" width="70" /> | Ana Carolina Orcelli Bautzer | 570281 | 1TDSPI | Líder de Projeto | [LinkedIn](https://www.linkedin.com/in/ana-bautzer/) · [GitHub](https://github.com/anabautzer) |
| <img src="src/assets/Pic2.png" alt="Eduardo" width="70" /> | Eduardo Lima de Souza | 570412 | 1TDSPI | Front-End | [LinkedIn](https://www.linkedin.com/in/duduulimatech/) · [GitHub](https://github.com/duduutech) |
| <img src="src/assets/Pic1.png" alt="Lucas Serrano" width="70" /> | Lucas Costa Serrano | 571016 | 1TDSPI | Python | [LinkedIn](https://www.linkedin.com/in/lucas-costa-serrano-647327278/) · [GitHub](https://github.com/luckz4) |
| <img src="src/assets/Pic3.png" alt="Lucas Fortunato" width="70" /> | Lucas Fortunato Brandão de Pinho | 572860 | 1TDSPI | ChatBot e IA | [LinkedIn](https://www.linkedin.com/in/lucas-fortunato-317643397/) · [GitHub](https://github.com/Loutcoun) |
| <img src="src/assets/Pic5.png" alt="Nicolas" width="70" /> | Nicolas Rodrigues Martins | 573178 | 1TDSPW | Java e Python | [LinkedIn](https://www.linkedin.com/in/nicolas-rodrigues-martins-126607360/) · [GitHub](https://github.com/NickRM22) |

## 📸 Imagens e Representação do Projeto

As imagens estão na pasta `src/assets`.

### 💻 1. Página Inicial (Home)
![Demonstração da Home Page](src/assets/index.png)
![Demonstração da Home Page](src/assets/indexcont.png)
*Legenda: seção principal com a proposta do projeto e acesso às demais páginas.*

### 📄 2. Página Sobre
![Demonstração da Página Sobre](src/assets/sobre.png)
![Demonstração da Página Sobre](src/assets/sobrecont.png)
*Legenda: contexto e problema, tipos de solução e roadmap de desenvolvimento.*

### 🚀 3. Página Solução
![Demonstração da Página de Solução](src/assets/solucao.png)![Demonstração da Página de Solução](src/assets/solucaocont.png)
*Legenda: explicação do ecossistema de gamificação, regras e dinâmica de pontuação.*

### 📱 4. FAQ
![Demonstração do FAQ](src/assets/faq.png)
*Legenda: perguntas frequentes em accordion.*

### 👥 5. Integrantes
![Demonstração da Página de Integrantes](src/assets/integrantes.png)
*Legenda: cards da equipe com fotos e links; ao clicar, abre o painel com a contribuição de cada pessoa.*

### ✉️ 6. Contato
![Demonstração da Página de Contato](src/assets/contato.png)
*Legenda: formulário com validação dos campos.*

### 🧪 7. Simulador — Celular
![Demonstração do Simulador](src/assets/simulador.png)
*Legenda: app Soul Up dentro do celular, com a explicação da tela e o endpoint usado ao lado, e o painel de requisições ao vivo.*

### 📡 8. Simulador — Status da API
![Demonstração do Status da API](src/assets/api.png)
*Legenda: situação da API Java e da API de IA e a lista de endpoints com as telas que chamam cada um.*

### 🤖 9. Simulador — Admin (IA)
![Demonstração do Admin com IA](src/assets/ia.png)
*Legenda: previsão de risco de abandono de um usuário de teste, com a probabilidade, o perfil do K-Means e a comparação com o rótulo real.*

## 📞 Contato

Para dúvidas sobre o projeto, entre em contato com a equipe:

* **E-mail:** contato@loboguaratech.com.br
* **Página de Contato:** disponível na aplicação, em `/contato`
* **Integrantes:** LinkedIn e GitHub de cada pessoa na tabela de [Autores e Créditos](#-autores-e-créditos)