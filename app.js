/**
 * Portfólio - lógica em JavaScript puro.
 *
 * Armazenamento: as mensagens do formulário de contato ficam no LocalStorage,
 * em JSON, na chave CONFIG.storageKey (CRUD completo na área administrativa).
 *
 * Automação (Etapa 2.2): ao enviar o formulário, a mensagem também é enviada
 * por POST (JSON) para CONFIG.webhookUrl, um webhook de ferramenta de
 * automação (ex.: Make, n8n ou Zapier) que dispara o e-mail de notificação.
 */
(function () {
  'use strict';

  const CONFIG = {
    storageKey: 'portfolio_mensagens',
    seedFlagKey: 'portfolio_seed_ok',
    // Cole aqui a URL do webhook criado na ferramenta de automação escolhida.
    webhookUrl: '',
  };

  /* ------------------------------------------------------------------ */
  /* Camada de armazenamento (LocalStorage) com try/catch               */
  /* ------------------------------------------------------------------ */

  function lerMensagens() {
    try {
      const bruto = localStorage.getItem(CONFIG.storageKey);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      console.warn('Não foi possível ler o LocalStorage:', erro);
      return [];
    }
  }

  function salvarMensagens(lista) {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(lista));
      return true;
    } catch (erro) {
      console.warn('Não foi possível gravar no LocalStorage:', erro);
      return false;
    }
  }

  function novoId(lista) {
    return lista.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  }

  /** CRUD: criar */
  function criarMensagem(dados) {
    const lista = lerMensagens();
    const mensagem = {
      id: novoId(lista),
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      mensagem: dados.mensagem.trim(),
      data: new Date().toISOString(),
    };
    lista.push(mensagem);
    salvarMensagens(lista);
    return mensagem;
  }

  /** CRUD: atualizar */
  function atualizarMensagem(id, dados) {
    const lista = lerMensagens();
    const indice = lista.findIndex((m) => m.id === id);
    if (indice === -1) return false;
    lista[indice] = {
      ...lista[indice],
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      mensagem: dados.mensagem.trim(),
    };
    return salvarMensagens(lista);
  }

  /** CRUD: excluir */
  function excluirMensagem(id) {
    const lista = lerMensagens().filter((m) => m.id !== id);
    return salvarMensagens(lista);
  }

  /**
   * Primeiro acesso: se ainda não houver dados, injeta 20 registros de teste
   * para validação imediata do CRUD.
   */
  function garantirDadosDeTeste() {
    try {
      if (localStorage.getItem(CONFIG.seedFlagKey)) return;
      if (lerMensagens().length === 0) {
        const nomes = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Rocha', 'Elaine Costa',
          'Felipe Alves', 'Gabriela Nunes', 'Hugo Pereira', 'Isabela Ramos', 'João Ferreira',
          'Karina Dias', 'Lucas Martins', 'Marina Lopes', 'Nicolas Gomes', 'Olívia Barros',
          'Paulo Teixeira', 'Quésia Moura', 'Rafael Cardoso', 'Sofia Araújo', 'Tiago Monteiro'];
        const agora = Date.now();
        const lista = nomes.map((nome, i) => ({
          id: i + 1,
          nome,
          email: nome.split(' ')[0].toLowerCase() + '@exemplo.com',
          mensagem: 'Mensagem de teste número ' + (i + 1) + ' para validar a listagem e o CRUD.',
          data: new Date(agora - i * 86400000).toISOString(),
        }));
        salvarMensagens(lista);
      }
      localStorage.setItem(CONFIG.seedFlagKey, '1');
    } catch (erro) {
      console.warn('Não foi possível gerar os dados de teste:', erro);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto);
    return div.innerHTML;
  }

  function formatarData(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '-' : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ------------------------------------------------------------------ */
  /* Formulário de contato                                               */
  /* ------------------------------------------------------------------ */

  function mostrarFeedback(texto, tipo) {
    const box = document.getElementById('contato-feedback');
    box.className = 'alert alert-' + tipo;
    box.textContent = texto;
  }

  async function notificarAutomacao(mensagem) {
    if (!CONFIG.webhookUrl) {
      return { ok: false, motivo: 'nao-configurado' };
    }
    try {
      const resposta = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origem: 'portfolio',
          nome: mensagem.nome,
          email: mensagem.email,
          mensagem: mensagem.mensagem,
          data: mensagem.data,
        }),
      });
      return { ok: resposta.ok, motivo: resposta.ok ? null : 'http-' + resposta.status };
    } catch (erro) {
      return { ok: false, motivo: 'rede' };
    }
  }

  function iniciarFormularioContato() {
    const form = document.getElementById('form-contato');
    form.addEventListener('submit', async function (evento) {
      evento.preventDefault();
      const campos = {
        nome: form.nome,
        email: form.email,
        mensagem: form.mensagem,
      };
      let valido = true;
      Object.values(campos).forEach((campo) => campo.classList.remove('is-invalid'));
      if (form.nome.value.trim().length < 3) { form.nome.classList.add('is-invalid'); valido = false; }
      if (!emailValido(form.email.value.trim())) { form.email.classList.add('is-invalid'); valido = false; }
      if (form.mensagem.value.trim().length < 10) { form.mensagem.classList.add('is-invalid'); valido = false; }
      if (!valido) return;

      const botao = document.getElementById('btn-enviar');
      botao.disabled = true;

      const salvo = criarMensagem({
        nome: form.nome.value,
        email: form.email.value,
        mensagem: form.mensagem.value,
      });

      const resultado = await notificarAutomacao(salvo);
      botao.disabled = false;

      if (resultado.ok) {
        mostrarFeedback('Mensagem salva e notificação enviada. Obrigado pelo contato!', 'success');
      } else if (resultado.motivo === 'nao-configurado') {
        mostrarFeedback('Mensagem salva localmente. A notificação por e-mail ainda não está configurada.', 'warning');
      } else {
        mostrarFeedback('Mensagem salva localmente, mas a notificação falhou (' + resultado.motivo + ').', 'danger');
      }
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Área administrativa oculta (#admin)                                 */
  /* ------------------------------------------------------------------ */

  let modalEdicao = null;

  function renderizarAdmin() {
    const termo = document.getElementById('admin-busca').value.trim().toLowerCase();
    const todas = lerMensagens();
    const filtradas = todas.filter((m) =>
      !termo || [m.nome, m.email, m.mensagem].some((t) => t.toLowerCase().includes(termo))
    );
    const corpo = document.getElementById('admin-tabela');

    if (filtradas.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-4">Nenhuma mensagem encontrada.</td></tr>';
    } else {
      corpo.innerHTML = filtradas.map((m) => `
        <tr>
          <td>${escaparHtml(m.id)}</td>
          <td class="fw-semibold">${escaparHtml(m.nome)}</td>
          <td>${escaparHtml(m.email)}</td>
          <td>${escaparHtml(m.mensagem)}</td>
          <td class="text-nowrap">${escaparHtml(formatarData(m.data))}</td>
          <td class="text-end text-nowrap">
            <button class="btn btn-sm btn-outline-dark" data-acao="editar" data-id="${m.id}" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${m.id}" title="Excluir"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`).join('');
    }
    document.getElementById('admin-total').textContent =
      filtradas.length + ' de ' + todas.length + ' mensagem(ns).';
  }

  function abrirEdicao(id) {
    const form = document.getElementById('form-edicao');
    form.classList.remove('was-validated');
    document.getElementById('edit-id').value = id || '';
    document.getElementById('modal-titulo').textContent = id ? 'Editar mensagem #' + id : 'Nova mensagem';
    if (id) {
      const m = lerMensagens().find((x) => x.id === id);
      if (!m) return;
      document.getElementById('edit-nome').value = m.nome;
      document.getElementById('edit-email').value = m.email;
      document.getElementById('edit-mensagem').value = m.mensagem;
    } else {
      form.reset();
    }
    modalEdicao.show();
  }

  function iniciarAdmin() {
    modalEdicao = new bootstrap.Modal(document.getElementById('modal-edicao'));

    document.getElementById('admin-busca').addEventListener('input', renderizarAdmin);
    document.getElementById('admin-novo').addEventListener('click', () => abrirEdicao(null));

    document.getElementById('admin-tabela').addEventListener('click', function (evento) {
      const botao = evento.target.closest('button[data-acao]');
      if (!botao) return;
      const id = Number(botao.dataset.id);
      if (botao.dataset.acao === 'editar') {
        abrirEdicao(id);
      } else if (botao.dataset.acao === 'excluir') {
        if (window.confirm('Excluir a mensagem #' + id + '? Esta ação não pode ser desfeita.')) {
          excluirMensagem(id);
          renderizarAdmin();
        }
      }
    });

    document.getElementById('form-edicao').addEventListener('submit', function (evento) {
      evento.preventDefault();
      const form = evento.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const dados = {
        nome: document.getElementById('edit-nome').value,
        email: document.getElementById('edit-email').value,
        mensagem: document.getElementById('edit-mensagem').value,
      };
      const id = Number(document.getElementById('edit-id').value);
      if (id) {
        atualizarMensagem(id, dados);
      } else {
        criarMensagem(dados);
      }
      modalEdicao.hide();
      renderizarAdmin();
    });
  }

  /** Mostra a área administrativa somente quando o endereço termina em #admin. */
  function alternarAdmin() {
    const admin = document.getElementById('admin');
    const ativo = window.location.hash === '#admin';
    admin.classList.toggle('d-none', !ativo);
    if (ativo) {
      renderizarAdmin();
      admin.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Inicialização                                                       */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    garantirDadosDeTeste();
    iniciarFormularioContato();
    iniciarAdmin();
    window.addEventListener('hashchange', alternarAdmin);
    alternarAdmin();
  });
})();
