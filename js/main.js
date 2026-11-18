document.addEventListener("DOMContentLoaded", () => {
  if (typeof CONFIG !== "undefined") {
    // 1. Vincula as fontes de áudio aos elementos
    const audioFundo = document.getElementById("audio-fundo");
    if (audioFundo && CONFIG.audioFundo) {
      audioFundo.src = CONFIG.audioFundo;

      // Limita o tempo do loop apenas se estiver configurado (> 0)
      if (CONFIG.tempoMaximoAudioSegundos && CONFIG.tempoMaximoAudioSegundos > 0) {
        audioFundo.addEventListener("timeupdate", () => {
          if (audioFundo.currentTime >= CONFIG.tempoMaximoAudioSegundos) {
            audioFundo.currentTime = 0;
            audioFundo.play().catch(e => console.log("Erro no loop:", e));
          }
        });
      }
    }

    const audioEnvelope = document.getElementById("audio-envelope");
    if (audioEnvelope && CONFIG.audioEnvelope) {
      audioEnvelope.src = CONFIG.audioEnvelope;
      audioEnvelope.volume = 0.6;
    }

    // 2. Preenche os campos e imagens do convite
    const imgLacoTopo = document.getElementById("img-laco-topo");
    if (imgLacoTopo && CONFIG.imagemLacoTopo) imgLacoTopo.src = CONFIG.imagemLacoTopo;

    const imgTema = document.getElementById("img-tema");
    if (imgTema && CONFIG.imagemTema) imgTema.src = CONFIG.imagemTema;

    const txtSubtitulo = document.getElementById("txt-subtitulo");
    if (txtSubtitulo && CONFIG.subtituloTopo) txtSubtitulo.innerText = CONFIG.subtituloTopo;

    const txtNome = document.getElementById("txt-nome");
    if (txtNome) txtNome.innerText = CONFIG.nomeBebê || CONFIG.nomeAniversariante || "Yan Levi";

    const txtFrase = document.getElementById("txt-frase");
    if (txtFrase) txtFrase.innerText = CONFIG.fraseTema || "";

    const txtDiaSemana = document.getElementById("txt-dia-semana");
    if (txtDiaSemana && CONFIG.diaSemana) txtDiaSemana.innerText = CONFIG.diaSemana;

    const txtDiaNumero = document.getElementById("txt-dia-numero");
    if (txtDiaNumero && CONFIG.diaNumero) txtDiaNumero.innerText = CONFIG.diaNumero;

    const txtMesAno = document.getElementById("txt-mes-ano");
    if (txtMesAno && CONFIG.mesAno) txtMesAno.innerText = CONFIG.mesAno;

    const txtHorario = document.getElementById("txt-horario");
    if (txtHorario && CONFIG.horario) txtHorario.innerText = CONFIG.horario;

    const txtLocal = document.getElementById("txt-local");
    if (txtLocal) {
      const tituloLocal = CONFIG.localNome || "Endereço da Comemoração";
      const endereco = CONFIG.localEndereco || "";
      txtLocal.innerHTML = `<strong>📍 ${tituloLocal}:</strong><br>${endereco}`;
    }

    const linkMaps = document.getElementById("link-maps");
    if (linkMaps && CONFIG.linkGoogleMaps) linkMaps.href = CONFIG.linkGoogleMaps;
  }
});

// ABRIR CONVITE (EXECUTA SOM E NAVEGAÇÃO AO CLICAR NO ENVELOPE)
function abrirConvite() {
  const telaEnvelope = document.getElementById("tela-envelope");
  const telaPrincipal = document.getElementById("tela-principal");
  const audioFundo = document.getElementById("audio-fundo");
  const audioEnvelope = document.getElementById("audio-envelope");

  // 1. Toca o efeito do envelope abrindo
  if (audioEnvelope) {
    audioEnvelope.currentTime = 0;
    audioEnvelope.play().catch(err => console.log("Erro ao tocar efeito do envelope:", err));
  }

  // 2. Toca a música de fundo e ajusta o volume de forma garantida
  if (audioFundo) {
    audioFundo.muted = false;
    audioFundo.currentTime = 0;
    audioFundo.volume = 0.35; // Volume suave a 35%
    audioFundo.play().catch(err => console.log("Erro ao iniciar música de fundo:", err));
  }

  // 3. Transição suave das telas via classes CSS
  if (telaEnvelope && telaPrincipal) {
    telaEnvelope.classList.add("oculto");
    telaPrincipal.classList.remove("oculto");
  }
}

// PAUSA O ÁUDIO AO MINIMIZAR / ALTERAR ABA
document.addEventListener("visibilitychange", () => {
  const audioFundo = document.getElementById("audio-fundo");
  if (!audioFundo) return;

  if (document.hidden) {
    audioFundo.pause();
  } else {
    const telaPrincipal = document.getElementById("tela-principal");
    if (telaPrincipal && !telaPrincipal.classList.contains("oculto")) {
      audioFundo.play().catch(err => console.log("Erro ao retomar áudio:", err));
    }
  }
});

// MODAL DE PRESENTES E LOJAS
function abrirModalPresentes() {
  const modal = document.getElementById("modal-presentes");
  const listaLojas = document.getElementById("lista-lojas");
  const listaPresentes = document.getElementById("lista-presentes");

  if (!modal || typeof CONFIG === "undefined") return;

  // Renderiza as lojas indicadas (Pingo de Gente & Estação Materna)
  if (listaLojas) {
    listaLojas.innerHTML = "";
    if (Array.isArray(CONFIG.lojasPresentes) && CONFIG.lojasPresentes.length > 0) {
      CONFIG.lojasPresentes.forEach(loja => {
        const card = document.createElement("div");
        card.className = "card-loja";
        card.innerHTML = `
          <div class="loja-cabecalho">
            <strong>🛍️ ${loja.nome}</strong>
            ${loja.descricao ? `<span class="loja-desc">${loja.descricao}</span>` : ""}
          </div>
          <p class="loja-endereco">${loja.endereco}</p>
          ${loja.referencia ? `<p class="loja-ref">📌 ${loja.referencia}</p>` : ""}
          ${loja.linkMaps ? `<a href="${loja.linkMaps}" target="_blank" rel="noopener noreferrer" class="btn-mapa-loja">📍 Ver loja no Google Maps</a>` : ""}
        `;
        listaLojas.appendChild(card);
      });
    }
  }

  // Renderiza sugestões extras em texto se houver
  if (listaPresentes) {
    listaPresentes.innerHTML = "";
    if (Array.isArray(CONFIG.sugestoesPresente) && CONFIG.sugestoesPresente.length > 0) {
      CONFIG.sugestoesPresente.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        listaPresentes.appendChild(li);
      });
      listaPresentes.style.display = "block";
    } else {
      listaPresentes.style.display = "none";
    }
  }

  modal.style.display = "flex";
}

function fecharModalPresentes() {
  const modal = document.getElementById("modal-presentes");
  if (modal) {
    modal.style.display = "none";
  }
}

function fecharModalSeClicarFora(event) {
  const modal = document.getElementById("modal-presentes");
  if (event.target === modal) {
    fecharModalPresentes();
  }
}

// CONFIRMAÇÃO DE PRESENÇA VIA WHATSAPP
function confirmarPresenca() {
  if (typeof CONFIG !== "undefined" && CONFIG.numeroWhatsApp) {
    const nome = CONFIG.nomeBebê || CONFIG.nomeAniversariante || "Yan Levi";
    const textoMensagem = CONFIG.mensagemWhatsApp || `Olá! Recebi o convite e gostaria de confirmar minha presença no Chá de Bebê do ${nome}! 🦆💚`;
    const mensagemFormatada = encodeURIComponent(textoMensagem);
    window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${mensagemFormatada}`, "_blank");
  }
}
