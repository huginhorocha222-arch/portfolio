# Portfólio · Hugo Moreira

Portfólio pessoal e profissional de Hugo Moreira, estudante de Tecnologia da Informação e desenvolvedor em formação.

Construído do zero com **HTML5, CSS3, JavaScript e Bootstrap 5**, sem construtores de sites.

## Como executar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Não é necessário servidor, banco de dados nem instalação.

## Estrutura

| Caminho | Função |
| --- | --- |
| `index.html` | Estrutura de todas as seções |
| `assets/profile.jpg` | Foto de perfil |
| `assets/css/style.css` | Tema escuro, azul neon, glassmorphism e animações |
| `assets/js/config.js` | Dados editáveis: projetos, contatos e cursos |
| `assets/js/main.js` | Comportamento da página: digitação, animações, menu e botões |

## Como atualizar

Edite `assets/js/config.js`:

- **Links dos projetos:** preencha o campo `link` de cada projeto com o endereço do GitHub.
- **Tecnologias:** preencha o campo `tecnologias` quando souber quais foram usadas.
- **Imagens dos projetos:** preencha o campo `imagem` com o caminho da imagem.
- **Contatos:** preencha o campo `link` de GitHub, LinkedIn, Instagram, E-mail e WhatsApp.
- **Cursos e certificados:** adicione itens em `cursosExtras`, com `titulo`, `instituicao` e `ano`.

Enquanto um link estiver vazio, o botão mostra um aviso em vez de abrir uma página.

## Recursos

- Animação de entrada e efeito de digitação na página inicial.
- Animações ao rolar a página e cards com efeito hover.
- Menu fixo no topo, navegação suave e botão para voltar ao topo.
- Layout responsivo para computador, tablet e celular.
- Respeita a preferência de movimento reduzido do sistema operacional.
