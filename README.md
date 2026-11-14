# Portfólio Web Dinâmico · Desenvolvedor Frontend

Portfólio pessoal construído do zero com **HTML5, CSS3, JavaScript e Bootstrap 5**, sem construtores de sites (Wix, WordPress, Squarespace etc.), como exige o Challenge do 4º Bimestre.

## Como executar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador (duplo clique ou arraste para o navegador).
3. Não é necessário servidor, banco de dados nem instalação.

Para testar a área administrativa oculta, abra `index.html#admin` no navegador.

## Estrutura do projeto

| Arquivo | Função |
| --- | --- |
| `index.html` | Páginas e seções do portfólio, formulário de contato e área administrativa oculta |
| `style.css` | Estilos próprios, com abordagem mobile first |
| `app.js` | Lógica do formulário, CRUD no LocalStorage, dados de teste e notificação de automação |
| `README.md` | Esta documentação |

## Etapa 1 · Interface

- **Apresentação pessoal:** nome, foto, perfil profissional, habilidades técnicas (hard skills) e comportamentais (soft skills).
- **Áreas do conhecimento:** quatro seções que relacionam Ciências Humanas, Ciências da Natureza, Matemática e Linguagens com a lógica de programação.
- **Tendências tecnológicas:** quatro seções sobre Cibersegurança, Blockchain, Automação/Robótica e Edge Computing.
- **Galeria de projetos:** cards com descrição, imagem e link para o repositório de cada projeto.
- **Contato:** formulário com validação em JavaScript.
- **Responsividade:** layout mobile first, com classes de grid e Flexbox do Bootstrap.

## Etapa 2 · Armazenamento e automação

### 2.1 · Dados locais (LocalStorage)

- As mensagens do formulário são guardadas no LocalStorage do navegador, em formato JSON, na chave `portfolio_mensagens`.
- A área administrativa oculta (`#admin`) faz o CRUD completo: **criar**, **listar** (com busca), **editar** e **excluir** mensagens.
- No primeiro acesso, se não houver dados, o `app.js` injeta **20 registros de teste** para validação imediata.
- As leituras e gravações ficam em blocos `try/catch`, para que a página continue funcionando caso o navegador bloqueie o armazenamento.

### 2.2 · Automação e notificação

Ferramenta escolhida: **Make** (plataforma de automação visual), usando um **webhook** de entrada.

Motivos da escolha:

- Recebe a mensagem do formulário por uma URL HTTP (webhook), sem precisar de servidor próprio.
- Permite enviar o e-mail de notificação com o módulo de e-mail (Gmail ou SMTP) sem escrever código de backend.
- Tem plano gratuito suficiente para o uso acadêmico e documentação em português.

Como funciona: ao enviar o formulário, o `app.js` grava a mensagem no LocalStorage e faz um `POST` em JSON para o webhook configurado em `CONFIG.webhookUrl`. O cenário no Make recebe os dados e dispara o e-mail de notificação.

Para ativar a notificação:

1. Crie um cenário no Make com o gatilho **Webhooks > Custom webhook** e copie a URL gerada.
2. Cole a URL na constante `webhookUrl` dentro de `app.js`.
3. Adicione o módulo de envio de e-mail ao cenário e use os campos `nome`, `email` e `mensagem` recebidos.

Enquanto `webhookUrl` estiver vazio, o formulário salva a mensagem localmente e informa que a notificação ainda não está configurada.

## Etapa 3 · Entrega

- Este repositório contém este README, que explica a escolha da ferramenta de automação e o acesso à área administrativa oculta.
- O projeto compactado (`.zip`) é anexado à entrega no Teams como cópia de segurança da versão final.

## Testes sugeridos

1. Abra `index.html` e envie o formulário com dados válidos. Confira que a mensagem aparece na área administrativa.
2. Abra `index.html#admin`, edite uma mensagem, exclua outra e use a busca.
3. Confira a página em largura de celular (modo de inspeção do navegador).
