/**
 * Portfólio de Hugo Moreira - comportamento da página (JavaScript puro).
 * Os dados (projetos, contatos, cursos) vêm de assets/js/config.js.
 */
(function () {
  'use strict';

  const CONFIG = window.PORTFOLIO_CONFIG || {};
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Lista fixa de habilidades: apresentadas como conhecimentos em desenvolvimento. */
  const HABILIDADES = [
    { nome: 'HTML', icone: 'bi-filetype-html' },
    { nome: 'CSS', icone: 'bi-filetype-css' },
    { nome: 'Java', icone: 'bi-cup-hot' },
    { nome: 'JavaScript', icone: 'bi-filetype-js' },
    { nome: 'Python', icone: 'bi-filetype-py' },
    { nome: 'SQL', icone: 'bi-filetype-sql' },
    { nome: 'Git e GitHub', icone: 'bi-github' },
    { nome: 'Redes de computadores', icone: 'bi-diagram-3' },
    { nome: 'MikroTik', icone: 'bi-router' },
    { nome: 'Suporte técnico', icone: 'bi-headset' },
    { nome: 'Hardware e software', icone: 'bi-pc-display' },
  ];

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */

  /** Cria um elemento com classes e texto (sem innerHTML, para evitar injeção). */
  function criar(tag, classes, texto) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  /** Mostra uma mensagem curta na tela. */
  let timerToast = null;
  function mostrarToast(texto) {
    const box = document.getElementById('toast');
    box.textContent = texto;
    box.classList.add('show');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => box.classList.remove('show'), 3200);
  }

  /** Abre um link configurado ou avisa que ele ainda não foi definido. */
  function abrirLink(link, nomeDoItem) {
    if (link) {
      window.open(link, '_blank', 'noopener');
    } else {
      mostrarToast('O link de ' + nomeDoItem + ' ainda não foi configurado em assets/js/config.js.');
    }
  }

  /* ------------------------------------------------------------------ */
  /* Efeito de digitação                                                 */
  /* ------------------------------------------------------------------ */

  function digitar(elemento, texto, velocidade, atraso) {
    return new Promise((resolver) => {
      if (reduzirMovimento) {
        elemento.textContent = texto;
        resolver();
        return;
      }
      let i = 0;
      setTimeout(function passo() {
        elemento.textContent = texto.slice(0, i + 1);
        i++;
        if (i < texto.length) {
          setTimeout(passo, velocidade);
        } else {
          resolver();
        }
      }, atraso);
    });
  }

  function iniciarDigitacao() {
    const nome = document.getElementById('nome-digitado');
    const subtitulo = document.getElementById('subtitulo-digitado');
    if (!nome || !subtitulo) return;
    digitar(nome, nome.dataset.texto, 90, 500).then(() =>
      digitar(subtitulo, subtitulo.dataset.texto, 28, 150)
    );
  }

  /* ------------------------------------------------------------------ */
  /* Renderização das seções                                             */
  /* ------------------------------------------------------------------ */

  function renderizarHabilidades() {
    const lista = document.getElementById('lista-habilidades');
    HABILIDADES.forEach((h, i) => {
      const col = criar('div', 'col-sm-6 col-lg-4 col-xl-3');
      const card = criar('div', 'skill-card h-100 glass');
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--d', (i % 4) * 0.08 + 's');
      const icone = criar('i', 'bi ' + h.icone + ' skill-icon');
      icone.setAttribute('aria-hidden', 'true');
      card.append(icone, criar('h3', 'h6 mt-3 mb-1', h.nome), criar('span', 'skill-tag', 'Em desenvolvimento'));
      col.appendChild(card);
      lista.appendChild(col);
    });
  }

  function renderizarProjetos() {
    const lista = document.getElementById('lista-projetos');
    (CONFIG.projetos || []).forEach((p, i) => {
      const col = criar('div', 'col-md-6');
      const card = criar('article', 'project-card glass h-100');
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--d', (i % 2) * 0.1 + 's');

      const midia = criar('div', 'project-media');
      if (p.imagem) {
        const img = criar('img', 'project-img');
        img.src = p.imagem;
        img.alt = 'Imagem do projeto ' + p.titulo;
        img.loading = 'lazy';
        midia.appendChild(img);
      } else {
        const icone = criar('i', 'bi bi-folder2-open project-placeholder');
        icone.setAttribute('aria-hidden', 'true');
        midia.appendChild(icone);
      }

      const corpo = criar('div', 'p-4 d-flex flex-column flex-grow-1');
      corpo.append(criar('h3', 'h5', p.titulo), criar('p', 'text-secondary mb-3', p.descricao));

      const tags = criar('div', 'd-flex flex-wrap gap-2 mb-4');
      if (p.tecnologias && p.tecnologias.length) {
        p.tecnologias.forEach((t) => tags.appendChild(criar('span', 'tech-tag', t)));
      } else {
        tags.appendChild(criar('span', 'tech-tag tech-tag-muted', 'Tecnologias a definir'));
      }

      const botao = criar('button', 'btn btn-ghost mt-auto align-self-start');
      botao.type = 'button';
      botao.append(criar('i', 'bi bi-github me-2'), document.createTextNode('Ver no GitHub'));
      botao.addEventListener('click', () => abrirLink(p.link, p.titulo));

      corpo.append(tags, botao);
      card.append(midia, corpo);
      col.appendChild(card);
      lista.appendChild(col);
    });
  }

  function renderizarContatos() {
    const lista = document.getElementById('lista-contatos');
    (CONFIG.contatos || []).forEach((c, i) => {
      const col = criar('div', 'col-6 col-md-4 col-lg-2');
      const botao = criar('button', 'contact-card glass w-100 h-100');
      botao.type = 'button';
      botao.setAttribute('data-reveal', '');
      botao.style.setProperty('--d', i * 0.07 + 's');
      const icone = criar('i', 'bi ' + c.icone + ' contact-icon');
      icone.setAttribute('aria-hidden', 'true');
      botao.append(icone, criar('span', 'd-block mt-2 fw-semibold', c.nome));
      botao.addEventListener('click', () => abrirLink(c.link, c.nome));
      col.appendChild(botao);
      lista.appendChild(col);
    });
  }

  function renderizarCursos() {
    const area = document.getElementById('cursos-extras');
    const cursos = CONFIG.cursosExtras || [];
    if (!cursos.length) {
      area.appendChild(criar('p', 'small text-secondary mb-0', 'Cursos e certificados serão adicionados aqui. Edite a lista cursosExtras em assets/js/config.js.'));
      return;
    }
    const ul = criar('ul', 'list-unstyled mb-0');
    cursos.forEach((c) => {
      const li = criar('li', 'mb-2', c.titulo + (c.instituicao ? ' · ' + c.instituicao : '') + (c.ano ? ' (' + c.ano + ')' : ''));
      ul.appendChild(li);
    });
    area.appendChild(ul);
  }

  /* ------------------------------------------------------------------ */
  /* Animações ao rolar, topo e menu                                     */
  /* ------------------------------------------------------------------ */

  function iniciarRevelacaoAoRolar() {
    const itens = document.querySelectorAll('[data-reveal]');
    if (reduzirMovimento || !('IntersectionObserver' in window)) {
      itens.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });
    itens.forEach((el) => observador.observe(el));
  }

  function iniciarBotaoTopo() {
    const botao = document.getElementById('voltar-topo');
    const atualizar = () => botao.classList.toggle('show', window.scrollY > 500);
    window.addEventListener('scroll', atualizar, { passive: true });
    botao.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    atualizar();
  }

  function iniciarMenu() {
    const menu = document.getElementById('menu');
    const nav = document.getElementById('topo-menu');
    // Fecha o menu do celular ao clicar em um item.
    menu.querySelectorAll('a.nav-link').forEach((link) =>
      link.addEventListener('click', () => {
        if (menu.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      })
    );
    // Reforça o fundo do menu ao rolar a página.
    const ajustar = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', ajustar, { passive: true });
    ajustar();
  }

  /* ------------------------------------------------------------------ */
  /* Inicialização                                                       */
  /* ------------------------------------------------------------------ */

  function ocultarCarregamento() {
    const loader = document.getElementById('loader');
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ano').textContent = new Date().getFullYear();
    renderizarHabilidades();
    renderizarProjetos();
    renderizarContatos();
    renderizarCursos();
    iniciarMenu();
    iniciarBotaoTopo();
    iniciarRevelacaoAoRolar();
    iniciarDigitacao();
  });

  window.addEventListener('load', ocultarCarregamento);
})();
