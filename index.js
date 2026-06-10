let linhas,
  colunas,
  bombas,
  matriz,
  tabela,
  celulasReveladas,
  bandeirasMarcadas,
  diffAtual,
  nomeJogador = "";
let jogoAtivo = false;
let primeiroClique = true;
let tempo, timerInterval;
let tempScoreToSave = null;
let tempDifficultyToSave = null;
let audioContext;
let messageTimeout;

function tocarNotas(notas) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext ||= new AudioContext();
  const inicio = audioContext.currentTime;

  notas.forEach(
    ({ frequencia, duracao, atraso = 0, tipo = "sine", volume = 0.08 }) => {
      const oscilador = audioContext.createOscillator();
      const ganho = audioContext.createGain();
      const comeco = inicio + atraso;
      const fim = comeco + duracao;

      oscilador.type = tipo;
      oscilador.frequency.setValueAtTime(frequencia, comeco);
      ganho.gain.setValueAtTime(0.0001, comeco);
      ganho.gain.exponentialRampToValueAtTime(volume, comeco + 0.015);
      ganho.gain.exponentialRampToValueAtTime(0.0001, fim);
      oscilador.connect(ganho);
      ganho.connect(audioContext.destination);
      oscilador.start(comeco);
      oscilador.stop(fim);
    },
  );
}

function tocarSomClick() {
  tocarNotas([
    { frequencia: 420, duracao: 0.05, tipo: "square", volume: 0.025 },
  ]);
}

function tocarSomExplosao() {
  tocarNotas([
    { frequencia: 120, duracao: 0.35, tipo: "sawtooth", volume: 0.12 },
    {
      frequencia: 70,
      duracao: 0.45,
      atraso: 0.08,
      tipo: "square",
      volume: 0.08,
    },
  ]);
}

function tocarSomVitoria() {
  tocarNotas([
    { frequencia: 523, duracao: 0.16 },
    { frequencia: 659, duracao: 0.16, atraso: 0.14 },
    { frequencia: 784, duracao: 0.28, atraso: 0.28 },
  ]);
}

function tocarSomNovoRecorde() {
  tocarNotas([
    { frequencia: 659, duracao: 0.14 },
    { frequencia: 784, duracao: 0.14, atraso: 0.12 },
    { frequencia: 988, duracao: 0.16, atraso: 0.24 },
    { frequencia: 1319, duracao: 0.35, atraso: 0.38 },
  ]);
}

function mostrarMensagem(texto, tipo = "info") {
  const mensagem = document.getElementById("gameMessage");
  if (!mensagem) return;
  clearTimeout(messageTimeout);
  mensagem.textContent = texto;
  mensagem.className = `game-message show ${tipo}`;
  messageTimeout = setTimeout(() => {
    mensagem.className = "game-message";
  }, 3500);
}

function mostrarTabela() {
  tabela = document.getElementById("tabela");
  if (tabela) tabela.style.display = "table";

  const painel = document.querySelector(".painel");
  if (painel) painel.style.display = "flex";
  const highScores = document.querySelector(".high-scores");
  if (highScores) highScores.style.display = "none";

  init();

  const btnJogar = document.getElementById("botaoJogar");
  const btnNovo = document.getElementById("jogarNovamente");
  if (btnJogar) btnJogar.style.display = "none";
  if (btnNovo) btnNovo.style.display = "inline-block";
}

function confeteVitoria() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FFD700", "#FFCC00", "#FFF8DC"],
  });
}

function confeteDerrota() {
  party.confetti(document.body, {
    count: 40,
    spread: 100,
    shapes: ["emoji"],
    emojis: ["😢", "😭"],
    size: 2.0,
  });
}

function reiniciarJogo() {
  const btnJogar = document.getElementById("botaoJogar");
  const btnNovo = document.getElementById("jogarNovamente");
  if (btnNovo) btnNovo.style.display = "none";
  if (btnJogar) btnJogar.style.display = "inline-block";

  const highScores = document.querySelector(".high-scores");
  if (highScores) highScores.style.display = "none";
  init();
}

function gerarMatriz(l, c) {
  matriz = [];
  for (var i = 0; i < l; i++) {
    matriz[i] = new Array(c).fill(0);
  }
}
function gerarTabela(l, c) {
  gerarMatriz(l, c);
  let html = "";
  for (let i = 0; i < l; i++) {
    html += "<tr>";
    for (let j = 0; j < c; j++) {
      html += "<td class='blocked'></td>";
    }
    html += "</tr>";
  }
  tabela.innerHTML = html;
}
function gerarBombas(lExcluida, cExcluida) {
  for (var i = 0; i < bombas; ) {
    var linha = Math.floor(Math.random() * linhas);
    var coluna = Math.floor(Math.random() * colunas);
    if (
      matriz[linha][coluna] === 0 &&
      (linha !== lExcluida || coluna !== cExcluida)
    ) {
      matriz[linha][coluna] = -1;
      i++;
    }
  }
}
function gerarNumero(l, c) {
  var count = 0;
  for (var i = l - 1; i <= l + 1; i++) {
    for (var j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
        if (matriz[i][j] === -1) {
          count++;
        }
      }
    }
  }
  matriz[l][c] = count;
}
function gerarNumeros() {
  for (var i = 0; i < linhas; i++) {
    for (var j = 0; j < colunas; j++) {
      if (matriz[i][j] !== -1) {
        gerarNumero(i, j);
      }
    }
  }
}
function bandeira(event) {
  event.preventDefault();
  if (!jogoAtivo) return false;

  const cell = event.target;
  if (cell.className === "blocked") {
    cell.className = "flag";
    cell.innerHTML = "&#128681;";
    bandeirasMarcadas++;
  } else if (cell.className === "flag") {
    cell.className = "blocked";
    cell.innerHTML = "";
    bandeirasMarcadas--;
  }
  atualizarPainel();
  return false;
}
function init() {
  tabela = document.getElementById("tabela");
  tabela.onclick = verificar;
  tabela.oncontextmenu = bandeira;
  jogoAtivo = true;
  primeiroClique = true;
  celulasReveladas = 0;
  bandeirasMarcadas = 0;

  pararTimer();
  tempo = 0;
  const timerEl = document.getElementById("timer");
  if (timerEl) timerEl.innerHTML = "000";

  const diff = document.getElementById("dificuldade");
  if (!diff) return;

  diffAtual = parseInt(diff.value);
  switch (diffAtual) {
    case 0:
      linhas = 9;
      colunas = 9;
      bombas = 10;
      break;
    case 1:
      linhas = 16;
      colunas = 16;
      bombas = 40;
      break;
    default:
      linhas = 16;
      colunas = 30;
      bombas = 99;
      break;
  }
  gerarTabela(linhas, colunas);
  atualizarPainel();
}
function iniciarTimer() {
  timerInterval = setInterval(() => {
    tempo++;
    const timerEl = document.getElementById("timer");
    if (timerEl) {
      timerEl.innerHTML = tempo.toString().padStart(3, "0");
    }
  }, 1000);
}
function pararTimer() {
  clearInterval(timerInterval);
}
function atualizarPainel() {
  const contador = document.getElementById("contadorBandeiras");
  if (contador) {
    contador.innerHTML = (bombas - bandeirasMarcadas)
      .toString()
      .padStart(3, "0");
  }
}
function limparCelulas(l, c) {
  for (var i = l - 1; i <= l + 1; i++) {
    for (var j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
        const cell = tabela.rows[i].cells[j];
        if (cell.className === "blocked" || cell.className === "flag") {
          celulasReveladas++;
          switch (matriz[i][j]) {
            case -1:
              break;
            case 0:
              cell.innerHTML = "";
              cell.className = "blank";
              limparCelulas(i, j);
              break;
            default:
              cell.innerHTML = matriz[i][j];
              cell.className = "blank n" + matriz[i][j];
          }
        }
      }
    }
  }
}
function mostrarBombas() {
  for (var i = 0; i < linhas; i++) {
    for (var j = 0; j < colunas; j++) {
      if (matriz[i][j] === -1) {
        const cell = tabela.rows[i].cells[j];
        cell.innerHTML = "&#128163;";
        cell.className = "blank";
      }
    }
  }
}
function verificar(event) {
  if (!jogoAtivo) return;

  const cell = event.target;
  if (cell.tagName !== "TD") return;
  if (cell.className === "blocked") {
    tocarSomClick();
    const linha = cell.parentNode.rowIndex;
    const coluna = cell.cellIndex;

    if (primeiroClique) {
      primeiroClique = false;
      gerarBombas(linha, coluna);
      gerarNumeros();
      iniciarTimer();
    }

    switch (matriz[linha][coluna]) {
      case -1:
        document.body.classList.add("shake-screen");
        setTimeout(() => {
          document.body.classList.remove("shake-screen");
        }, 500);

        tocarSomExplosao();
        mostrarBombas();
        cell.style.backgroundColor = "red";
        pararTimer();
        jogoAtivo = false;
        confeteDerrota();

        mostrarMensagem("Você perdeu! Tente novamente.", "derrota");

        const btnJogar = document.getElementById("botaoJogar");
        const btnNovo = document.getElementById("jogarNovamente");
        if (btnJogar) btnJogar.style.display = "none";
        if (btnNovo) btnNovo.style.display = "inline-block";
        const highScores = document.querySelector(".high-scores");
        if (highScores) highScores.style.display = "block";

        break;

      case 0:
        limparCelulas(linha, coluna);
        break;
      default:
        celulasReveladas++;
        cell.innerHTML = matriz[linha][coluna];
        cell.className = "blank n" + matriz[linha][coluna];
    }
    fimDeJogo(cell);
  }
}

function isTop10(dificuldade, tempoFinal) {
  try {
    const key = `minesweeper_scores_${dificuldade}`;
    const savedData = localStorage.getItem(key);
    let scores = JSON.parse(savedData || "[]");
    if (!Array.isArray(scores)) scores = [];
    const validScores = scores.filter((s) => s && typeof s.time === "number");
    const piorTempoNoTop10 =
      validScores.length > 0
        ? validScores[validScores.length - 1].time
        : Infinity;
    return validScores.length < 10 || tempoFinal < piorTempoNoTop10;
  } catch {
    return true;
  }
}

function abrirPopUpNome(dificuldade, tempoFinal) {
  tempScoreToSave = tempoFinal;
  tempDifficultyToSave = dificuldade;
  const overlay = document.getElementById("name-popup-overlay");
  const titulo = document.querySelector(".modal-content h3");
  const rankInfo = document.getElementById("rankInfo");

  if (overlay) {
    if (titulo) {
      if (dificuldade !== null && tempoFinal !== null) {
        const key = `minesweeper_scores_${dificuldade}`;
        let scores = [];
        try {
          scores = JSON.parse(localStorage.getItem(key) || "[]");
        } catch (e) {}
        let posicao = scores.findIndex((s) => tempoFinal < s.time);
        if (posicao === -1) {
          posicao = scores.length + 1;
        } else {
          posicao += 1;
        }
        if (posicao === 1) {
          titulo.innerText = "🏆 Novo Recorde!";
          tocarSomNovoRecorde();
          titulo.classList.add("new-record-title");
        } else {
          titulo.innerText = "Fim de Jogo!";
          titulo.classList.remove("new-record-title");
        }

        if (rankInfo)
          rankInfo.innerText = `Você ficou em ${posicao}º lugar no ranking!`;
      } else {
        titulo.innerText = "Insira seu nome";
        titulo.classList.remove("new-record-title");
        if (rankInfo) rankInfo.innerText = "";
      }
    }
    overlay.style.display = "flex";
    const input = document.getElementById("playerNameInput");
    if (input) {
      input.value = nomeJogador;
      input.focus();
    }
  }
}

function salvarNomeEScore() {
  const nomeInput = document.getElementById("playerNameInput");
  if (!nomeInput) return;

  nomeJogador = nomeInput.value.trim() || "Anônimo";

  try {
    localStorage.setItem("minesweeper_player_name", nomeJogador);
  } catch {}

  if (tempScoreToSave !== null && tempDifficultyToSave !== null) {
    try {
      salvarHighScore(tempDifficultyToSave, tempScoreToSave, nomeJogador);
    } catch {
      mostrarMensagem(
        "Recorde atingido, mas o navegador bloqueou o salvamento.",
        "derrota",
      );
    }
  }
  document.getElementById("name-popup-overlay").style.display = "none";
}

function salvarHighScore(dificuldade, tempoFinal, nome) {
  const key = `minesweeper_scores_${dificuldade}`;
  const savedData = localStorage.getItem(key);
  let scores = JSON.parse(savedData || "[]");
  scores.push({ name: nome, time: tempoFinal });
  scores.sort((a, b) => a.time - b.time);
  scores = scores.slice(0, 10);

  localStorage.setItem(key, JSON.stringify(scores));
  confetti({
    particleCount: 200,
    spread: 80,
    colors: ["#03e9f4", "#FFD700", "#ffffff"],
  });

  carregarHighScores();
}

function fimDeJogo(celulaVitoria) {
  const totalCelulas = linhas * colunas;
  if (celulasReveladas >= totalCelulas - bombas) {
    jogoAtivo = false;
    pararTimer();

    if (celulaVitoria) {
      celulaVitoria.classList.add("win-glow");
    }
    try {
      tocarSomVitoria();
      confeteVitoria();
    } catch {}

    if (isTop10(diffAtual, tempo)) {
      abrirPopUpNome(diffAtual, tempo);
    } else {
      mostrarMensagem(
        "Você venceu! Continue tentando entrar no Top 10.",
        "vitoria",
      );
    }

    const btnJogar = document.getElementById("botaoJogar");
    const btnNovo = document.getElementById("jogarNovamente");
    if (btnJogar) btnJogar.style.display = "none";
    if (btnNovo) btnNovo.style.display = "inline-block";
    const highScores = document.querySelector(".high-scores");
    if (highScores) highScores.style.display = "block";
  }
}

function carregarHighScores() {
  for (let i = 0; i <= 2; i++) {
    const key = `minesweeper_scores_${i}`;
    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {}

    const container = document.getElementById(`scores-list-${i}`);
    if (container) {
      container.innerHTML = "";
      if (scores.length === 0) {
        container.innerHTML = '<div class="score-entry">--</div>';
      } else {
        scores.forEach((scoreEntry, index) => {
          const scoreEl = document.createElement("div");
          scoreEl.classList.add("score-entry");
          scoreEl.id = `score-${i}-${index}`;
          scoreEl.innerHTML = `${index + 1}. ${scoreEntry.name} - ${scoreEntry.time}s`;
          container.appendChild(scoreEl);
        });
      }
    }
  }
}

function registerEvents() {
  try {
    nomeJogador = localStorage.getItem("minesweeper_player_name") || "";
  } catch (e) {
    nomeJogador = "";
  }

  const diff = document.getElementById("dificuldade");
  diff.onchange = init;

  const temaSelect = document.getElementById("tema");
  if (temaSelect) {
    temaSelect.onchange = mudarTema;
    carregarTema();
  }
  const nameInput = document.getElementById("playerNameInput");
  if (nameInput) {
    nameInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") salvarNomeEScore();
    });
  }

  try {
    carregarHighScores();
  } catch (e) {}
}

function mudarTema() {
  const tema = document.getElementById("tema").value;
  document.body.classList.remove("theme-classico", "theme-cyberpunk");
  if (tema !== "neon") {
    document.body.classList.add(`theme-${tema}`);
  }
  try {
    localStorage.setItem("minesweeper_theme", tema);
  } catch (e) {}
}

function carregarTema() {
  try {
    const temaSalvo = localStorage.getItem("minesweeper_theme") || "neon";
    const temaSelect = document.getElementById("tema");
    if (temaSelect) {
      temaSelect.value = temaSalvo;
      mudarTema();
    }
  } catch {}
}

window.onload = registerEvents;
