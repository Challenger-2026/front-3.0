import type { SecaoPrivacidade } from '../types/types';

// ===== Privacidade (demonstração: a API não guarda consentimento nem pedido de exclusão) =====

// Textos do protótipo, sem juridiquês
export const secoesPrivacidade: SecaoPrivacidade[] = [
  {
    icone: 'dados',
    titulo: 'Quais dados usamos',
    texto:
      'No módulo de gamificação usamos seus pontos, suas postagens e sua posição no ranking. Cadastro, CPF e e-mail ficam guardados com a plataforma Soul Up e não aparecem para outras pessoas.',
  },
  {
    icone: 'olho',
    titulo: 'Moderação às cegas',
    texto:
      'Quem modera nunca vê seu nome, sua foto ou sua comunidade: a postagem aparece só com um código. Essa pseudonimização impede que a postagem seja associada a você sem uma informação adicional que só a Soul Up guarda, em ambiente seguro (LGPD, art. 13, § 4º).',
  },
  {
    icone: 'cadeado',
    titulo: 'Ranking só com @usuário',
    texto: 'Nas ligas e nos rankings aparece apenas o seu @usuário, nunca o nome completo.',
  },
  {
    icone: 'lei',
    titulo: 'Base legal (LGPD)',
    texto:
      'Pontos, postagens e ranking são tratados para executar o serviço que você usa (art. 7º, V). Opções extras, como aparecer no ranking Entre amigos, dependem do seu consentimento, que pode ser revogado a qualquer momento (art. 7º, I, e art. 18, IX).',
  },
  {
    icone: 'direitos',
    titulo: 'Seus direitos (art. 18)',
    texto:
      'Confirmar e acessar seus dados, corrigir dados errados, pedir anonimização, bloqueio ou eliminação, levar seus dados para outro serviço (portabilidade) e saber com quem eles foram compartilhados.',
  },
];