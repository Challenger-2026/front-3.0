// Opções do onboarding (mesmos textos do protótipo do Lovable)

export const momentos: { id: string; label: string; texto: string }[] = [
  { id: 'iniciante', label: 'Estou começando agora', texto: 'Quero dar os primeiros passos em hábitos sustentáveis.' },
  { id: 'praticante', label: 'Já pratico no dia a dia', texto: 'Tenho rotina sustentável e quero registrar e evoluir.' },
  { id: 'mobilizador', label: 'Mobilizo pessoas', texto: 'Organizo mutirões, coletivos ou projetos com outras pessoas.' },
  { id: 'estudante', label: 'Estudo ou trabalho com o tema', texto: 'Atuo com meio ambiente, educação ambiental ou ESG.' },
];

export const objetivos: { id: string; label: string; texto: string }[] = [
  { id: 'habitos', label: 'Criar novos hábitos', texto: 'Usar metas e lembretes para manter constância.' },
  { id: 'pontos', label: 'Acumular pontos e benefícios', texto: 'Trocar ações por benefícios de parceiros e ONGs.' },
  { id: 'comunidade', label: 'Encontrar comunidade', texto: 'Conhecer pessoas com os mesmos interesses.' },
  { id: 'impacto', label: 'Medir meu impacto', texto: 'Acompanhar CO₂ evitado e evolução no ranking.' },
];

// O label é o que fica salvo em "interesses" (igual aos complementos fixos)
export const temasInteresse: { label: string; emoji: string }[] = [
  { label: 'Resíduos e reciclagem', emoji: '♻️' },
  { label: 'Mobilidade urbana', emoji: '🚲' },
  { label: 'Natureza e reflorestamento', emoji: '🌳' },
  { label: 'Água', emoji: '💧' },
  { label: 'Energia', emoji: '⚡' },
  { label: 'Alimentação sustentável', emoji: '🥬' },
  { label: 'Consumo consciente', emoji: '🛍️' },
  { label: 'Educação ambiental', emoji: '📚' },
];

export const MIN_TEMAS = 2;