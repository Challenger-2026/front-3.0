// Regras do react-hook-form usadas no Cadastro e nos Dados cadastrais
// (os limites de tamanho são os mesmos do @Size dos DTOs do Java)

export const regrasNome = {
  required: 'Informe seu nome completo.',
  maxLength: { value: 150, message: 'O nome pode ter no máximo 150 caracteres.' },
  pattern: {
    value: /^[A-Za-zÀ-ÖØ-öø-ÿ'’ -]+$/,
    message: 'Use apenas letras (espaços, apóstrofos e hífens são aceitos).',
  },
  validate: (valor: string) => valor.trim().includes(' ') || 'Digite nome e sobrenome.',
};

export const regrasUsername = {
  required: 'Escolha um nome de usuário.',
  minLength: { value: 3, message: 'O nome de usuário precisa ter ao menos 3 caracteres.' },
  maxLength: { value: 50, message: 'O nome de usuário pode ter no máximo 50 caracteres.' },
  pattern: {
    value: /^[a-zA-Z0-9._-]+$/,
    message: 'Sem espaços: use letras, números, ponto, hífen ou underline.',
  },
};

export const regrasSenha = {
  required: 'Informe a senha.',
  minLength: { value: 8, message: 'A senha precisa ter ao menos 8 caracteres.' },
  maxLength: { value: 150, message: 'A senha pode ter no máximo 150 caracteres.' },
};

// Regras da Nova postagem e da Edição de postagem
// (vazio usa as mesmas mensagens do @NotBlank do DTOPostagemRequest)

export const regrasTextoPostagem = {
  validate: (valor: string) => {
    const texto = valor.trim();
    if (!texto) return 'O texto da postagem é obrigatório';
    if (texto.length < 15) return 'Conte um pouco mais sobre a ação (mínimo de 15 caracteres)';
    return true;
  },
};

export const regrasUrlPostagem = {
  validate: (valor: string) => {
    const url = valor.trim();
    if (!url) return 'A URL da evidência é obrigatória';
    if (!/^https?:\/\/\S+\.\S+$/i.test(url)) return 'Informe um link começando com http:// ou https://';
    return true;
  },
};

// Regras da moderação: justificativa de rejeição, parecer das denúncias e da revisão
export const regrasParecer = {
  validate: (valor: string) => valor.trim().length >= 10 || 'Escreva pelo menos 10 caracteres.',
};

// Motivo da contestação
export const regrasMotivoContestacao = {
  validate: (valor: string) => valor.trim().length >= 15 || 'Descreva sua contestação com pelo menos 15 caracteres.',
};


// Regras da comunidade (criar e editar): nome igual ao @NotBlank/@Size do DTOComunidadeRequest;
// a descrição pede no mínimo 20 caracteres, como no protótipo (o Java só exige que não seja vazia)
export const regrasNomeComunidade = {
  validate: (valor: string) => valor.trim().length > 0 || 'O nome da comunidade é obrigatório',
  maxLength: { value: 150, message: 'O nome pode ter no máximo 150 caracteres' },
};

export const regrasDescricaoComunidade = {
  validate: (valor: string) => {
    const texto = valor.trim();
    if (!texto) return 'A descrição é obrigatória';
    if (texto.length < 20) return 'Descreva o propósito com pelo menos 20 caracteres';
    return true;
  },
};

// Missão (demonstração): título obrigatório e descrição com no mínimo 10 caracteres
export const regrasTituloMissao = {
  validate: (valor: string) => valor.trim().length > 0 || 'Dê um título para a missão.',
};

export const regrasDescricaoMissao = {
  validate: (valor: string) =>
    valor.trim().length >= 10 || 'Descreva o que fazer e como registrar (mínimo de 10 caracteres).',
};