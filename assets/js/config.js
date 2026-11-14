/**
 * Configuração editável do portfólio.
 *
 * Preencha os campos "link" com os endereços reais quando estiverem prontos.
 * Enquanto um link estiver vazio, o botão correspondente exibe um aviso
 * em vez de abrir uma página, para que nenhum link seja inventado.
 */
window.PORTFOLIO_CONFIG = {
  /* Projetos: uma entrada por projeto. */
  projetos: [
    {
      titulo: 'Avante Inovação',
      descricao: 'Projeto de sistema e soluções tecnológicas voltadas à organização e gestão empresarial.',
      tecnologias: [], // preencher com as tecnologias usadas
      imagem: '', // caminho da imagem do projeto, ex.: 'assets/projetos/avante.jpg'
      link: '', // link do GitHub
    },
    {
      titulo: 'Sistema de Reservas de Laboratório',
      descricao: 'Sistema desenvolvido com Python, Streamlit e SQL para gerenciamento de laboratórios e reservas.',
      tecnologias: ['Python', 'Streamlit', 'SQL'],
      imagem: '',
      link: '',
    },
    {
      titulo: 'Giga Sul Telecom',
      descricao: 'Projeto de presença digital para uma empresa de internet, com desenvolvimento de site, identidade visual e materiais de divulgação.',
      tecnologias: [],
      imagem: '',
      link: '',
    },
    {
      titulo: 'Laboratório de Redes',
      descricao: 'Experimentos práticos envolvendo MikroTik, configuração de redes, DHCP, DNS, PPPoE e infraestrutura.',
      tecnologias: ['MikroTik', 'DHCP', 'DNS', 'PPPoE'],
      imagem: '',
      link: '',
    },
  ],

  /* Contatos: deixe o link vazio até ter o endereço real. */
  contatos: [
    { nome: 'GitHub', icone: 'bi-github', link: '' },
    { nome: 'LinkedIn', icone: 'bi-linkedin', link: '' },
    { nome: 'Instagram', icone: 'bi-instagram', link: '' },
    { nome: 'E-mail', icone: 'bi-envelope', link: '' },
    { nome: 'WhatsApp', icone: 'bi-whatsapp', link: '' },
  ],

  /* Cursos e certificados futuros: cada item é { titulo, instituicao, ano }. */
  cursosExtras: [],
};
