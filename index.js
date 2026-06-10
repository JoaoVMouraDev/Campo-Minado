let linhas, colunas, bombas, matriz, tabela, celulasReveladas, bandeirasMarcadas, diffAtual, nomeJogador = "";
let jogoAtivo = false;
let primeiroClique = true;
let tempo, timerInterval; 
let tempScoreToSave = null; // Para guardar o score temporariamente
let tempDifficultyToSave = null; // Para guardar a dificuldade temporariamente

// Carrega o som de clique (usando um link público como exemplo)
const somClick = new Audio('https://www.soundjay.com/buttons/sounds/button-50.mp3');
const somExplosao = new Audio('https://www.soundjay.com/misc/sounds/explosion-01.mp3');
const somVitoria = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
const somNovoRecorde = new Audio('https://www.soundjay.com/misc/sounds/trumpet-fanfare-01.mp3'); // Exemplo de som de trombeta

function tocarSomClick() {
    somClick.currentTime = 0;
    somClick.play().catch(e => console.log("Aguardando interação do usuário para tocar áudio."));
}

function tocarSomExplosao() {
    somExplosao.currentTime = 0;
    somExplosao.play().catch(e => console.log("Erro ao tocar som de explosão."));
}

function tocarSomVitoria() {
    somVitoria.currentTime = 0;
    somVitoria.play().catch(e => console.log("Erro ao tocar som de vitória."));
}

function tocarSomNovoRecorde() {
    somNovoRecorde.currentTime = 0;
    somNovoRecorde.play().catch(e => console.log("Erro ao tocar som de novo recorde."));
}

function mostrarTabela() {
  tabela = document.getElementById("tabela");
  if (tabela) tabela.style.display = "table";
  

  const painel = document.querySelector('.painel');
  if (painel) painel.style.display = 'flex';

  // Esconde o ranking ao começar
  const highScores = document.querySelector('.high-scores');
  if (highScores) highScores.style.display = 'none';

  init(); 

  const btnJogar = document.getElementById('botaoJogar');
  const btnNovo = document.getElementById('jogarNovamente');
  if (btnJogar) btnJogar.style.display = 'none';
  if (btnNovo) btnNovo.style.display = 'inline-block';
}

function confeteVitoria() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFCC00', '#FFF8DC'], // tons dourados
  });
}

function confeteDerrota() {
  party.confetti(document.body, {
    count: 40,
    spread: 100,
    shapes: ["emoji"],
    emojis: ["😢", "😭"],
    size: 2.0
  });
}

function reiniciarJogo() {
  const btnJogar = document.getElementById('botaoJogar');
  const btnNovo = document.getElementById('jogarNovamente');
  if (btnNovo) btnNovo.style.display = "none";
  if (btnJogar) btnJogar.style.display = "inline-block";
  

  const highScores = document.querySelector('.high-scores');
  if (highScores) highScores.style.display = 'none';
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
function mostrarMatriz() {
    for (var i = 0; i < linhas; i++) {
        for (var j = 0; j < colunas; j++) {
            if (matriz[i][j] === -1) {
                tabela.rows[i].cells[j].innerHTML = "&#128163;";
            } else {
                tabela.rows[i].cells[j].innerHTML = matriz[i][j];
            }
        }
    }
}
function gerarBombas(lExcluida, cExcluida) {
    for (var i = 0; i < bombas;) {
        var linha = Math.floor((Math.random() * linhas));
        var coluna = Math.floor((Math.random() * colunas));
        if (matriz[linha][coluna] === 0 && (linha !== lExcluida || coluna !== cExcluida)) {
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
            timerEl.innerHTML = tempo.toString().padStart(3, '0');
        }
    }, 1000);
}
function pararTimer() {
    clearInterval(timerInterval);
}
function atualizarPainel() {
    const contador = document.getElementById("contadorBandeiras");
    if (contador) {
        contador.innerHTML = (bombas - bandeirasMarcadas).toString().padStart(3, '0');
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
        // Adiciona o efeito de sacudida na tela
        document.body.classList.add('shake-screen');
        // Remove a classe após a animação (500ms) para poder repetir depois
        setTimeout(() => {
            document.body.classList.remove('shake-screen');
        }, 500);

        tocarSomExplosao();
        mostrarBombas();
        cell.style.backgroundColor = "red";
        pararTimer();
        jogoAtivo = false;
        confeteDerrota();
        
        setTimeout(() => {
            alert("Você perdeu!");
        }, 500);

        const btnJogar = document.getElementById("botaoJogar");
        const btnNovo = document.getElementById("jogarNovamente");
        if (btnJogar) btnJogar.style.display = "none";
        if (btnNovo) btnNovo.style.display = "inline-block";
        
        // Mostra o ranking na derrota
        const highScores = document.querySelector('.high-scores');
        if (highScores) highScores.style.display = 'block';
        
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
        // Proteção contra bloqueio de storage
        const savedData = localStorage.getItem(key);
        let scores = JSON.parse(savedData || '[]');
        
        // Garante que é um array e filtra apenas entradas válidas com a propriedade 'time'
        if (!Array.isArray(scores)) scores = [];
        const validScores = scores.filter(s => s && typeof s.time === 'number');

        // Se tem menos de 10 recordes ou o tempo atual é melhor que o pior do top 10
        const piorTempoNoTop10 = validScores.length > 0 ? validScores[validScores.length - 1].time : Infinity;
        return validScores.length < 10 || tempoFinal < piorTempoNoTop10;
    } catch (e) {
        console.error("Erro ao verificar ranking:", e);
        return true; // Em caso de erro, permite que o jogador tente salvar
    }
}

function abrirPopUpNome(dificuldade, tempoFinal) {
    tempScoreToSave = tempoFinal;
    tempDifficultyToSave = dificuldade;
    const overlay = document.getElementById('name-popup-overlay');
    const titulo = document.querySelector('.modal-content h3');
    const rankInfo = document.getElementById('rankInfo');

    if (overlay) {
        if (titulo) {
            // Se houver dificuldade e tempo, é um fim de jogo vitorioso
            if (dificuldade !== null && tempoFinal !== null) {
                const key = `minesweeper_scores_${dificuldade}`;
                let scores = [];
                try { scores = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) {}
                
                // Calcula a posição comparando com os tempos existentes
                let posicao = scores.findIndex(s => tempoFinal < s.time);
                if (posicao === -1) {
                    posicao = scores.length + 1;
                } else {
                    posicao += 1; // Ajusta de índice 0 para posição 1, 2, 3...
                }

                // Verifica se é o melhor tempo absoluto (1º lugar)
                if (posicao === 1) {
                    titulo.innerText = "🏆 Novo Recorde!";
                    tocarSomNovoRecorde(); // Toca o som de novo recorde
                    titulo.classList.add('new-record-title');
                } else {
                    titulo.innerText = "Fim de Jogo!";
                    titulo.classList.remove('new-record-title');
                }

                if (rankInfo) rankInfo.innerText = `Você ficou em ${posicao}º lugar no ranking!`;
            } else {
                // Caso contrário, é a abertura inicial do site
                titulo.innerText = "Insira seu nome";
                titulo.classList.remove('new-record-title');
                if (rankInfo) rankInfo.innerText = "";
            }
        }
        overlay.style.display = 'flex';
        const input = document.getElementById('playerNameInput');
        if (input) {
            input.value = nomeJogador; // Preenche com o nome salvo
            input.focus();
        }
    }
}

function salvarNomeEScore() {
    const nomeInput = document.getElementById('playerNameInput');
    if (!nomeInput) return;
    
    nomeJogador = nomeInput.value.trim() || "Anônimo";
    
    try {
        localStorage.setItem("minesweeper_player_name", nomeJogador);
    } catch (e) { console.warn("Erro ao persistir nome do jogador"); }
    
    if (tempScoreToSave !== null && tempDifficultyToSave !== null) {
        try {
            salvarHighScore(tempDifficultyToSave, tempScoreToSave, nomeJogador);
        } catch (e) {
            console.error("Não foi possível salvar o recorde permanentemente:", e);
            alert("Recorde atingido! (Nota: O navegador bloqueou o salvamento no ranking)");
        }
    }
    
    // Limpa e fecha o modal
    document.getElementById('name-popup-overlay').style.display = 'none';
}

function salvarHighScore(dificuldade, tempoFinal, nome) {
    const key = `minesweeper_scores_${dificuldade}`;
    const savedData = localStorage.getItem(key);
    let scores = JSON.parse(savedData || '[]');

    // Adiciona o novo objeto, ordena por tempo e limita aos 10 melhores
    scores.push({ name: nome, time: tempoFinal });
    scores.sort((a, b) => a.time - b.time);
    scores = scores.slice(0, 10);

    localStorage.setItem(key, JSON.stringify(scores));

    // Feedback visual (Confete)
    confetti({
        particleCount: 200,
        spread: 80,
        colors: ['#03e9f4', '#FFD700', '#ffffff']
    });

    carregarHighScores();
}

function fimDeJogo(celulaVitoria) {
  const totalCelulas = linhas * colunas;
  if (celulasReveladas >= (totalCelulas - bombas)) {
    jogoAtivo = false;
    pararTimer();

    if (celulaVitoria) {
        celulaVitoria.classList.add("win-glow");
    }

    // Envolvemos efeitos visuais em try-catch para não travar a lógica do pop-up
    try {
        tocarSomVitoria();
        confeteVitoria();
    } catch (e) { console.log("Erro nos efeitos:", e); }

    if (isTop10(diffAtual, tempo)) {
        // Chamada imediata para garantir que o pop-up apareça
        abrirPopUpNome(diffAtual, tempo);
    } else {
        setTimeout(() => {
            alert("Você venceu! Mas não foi rápido o suficiente para o Top 10.");
        }, 500);
    }

    const btnJogar = document.getElementById("botaoJogar");
    const btnNovo = document.getElementById("jogarNovamente");
    if (btnJogar) btnJogar.style.display = "none";
    if (btnNovo) btnNovo.style.display = "inline-block";

    // Mostra o ranking na vitória
    const highScores = document.querySelector('.high-scores');
    if (highScores) highScores.style.display = 'block';
  }
}

function carregarHighScores() {
    for (let i = 0; i <= 2; i++) {
        const key = `minesweeper_scores_${i}`;
        let scores = [];
        try {
            scores = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) { console.warn("Acesso ao ranking bloqueado."); }

        const container = document.getElementById(`scores-list-${i}`); // Contêiner da lista de scores
        if (container) {
            container.innerHTML = ''; // Limpa os scores anteriores
            if (scores.length === 0) {
                container.innerHTML = '<div class="score-entry">--</div>'; // Exibe placeholder se não houver scores
            } else {
                scores.forEach((scoreEntry, index) => { // scoreEntry é agora um objeto {name, time}
                    const scoreEl = document.createElement('div');
                    scoreEl.classList.add('score-entry');
                    scoreEl.id = `score-${i}-${index}`; // ID único para cada entrada de score
                    scoreEl.innerHTML = `${index + 1}. ${scoreEntry.name} - ${scoreEntry.time}s`; // Exibe nome e tempo
                    container.appendChild(scoreEl);
                });
            }
        }
    }
}



function registerEvents() {
  // Tenta carregar o nome salvo anteriormente
  try {
    nomeJogador = localStorage.getItem("minesweeper_player_name") || "";
  } catch(e) { nomeJogador = ""; }

  // Abre o pop-up imediatamente ao entrar no site
  abrirPopUpNome(null, null);

  const diff = document.getElementById("dificuldade");
  diff.onchange = init;

  const temaSelect = document.getElementById("tema");
  if (temaSelect) {
    temaSelect.onchange = mudarTema;
    carregarTema();
  }

  // Permite salvar o nome ao pressionar "Enter"
  const nameInput = document.getElementById('playerNameInput');
  if (nameInput) {
    nameInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') salvarNomeEScore();
    });
  }

  try { carregarHighScores(); } catch(e) {}
}

function mudarTema() {
    const tema = document.getElementById("tema").value;
    // Remove temas anteriores antes de aplicar o novo
    document.body.classList.remove('theme-classico', 'theme-cyberpunk');
    if (tema !== "neon") {
        document.body.classList.add(`theme-${tema}`);
    }
    try { localStorage.setItem("minesweeper_theme", tema); } catch(e) {}
}

function carregarTema() {
    try {
        const temaSalvo = localStorage.getItem("minesweeper_theme") || "neon";
        const temaSelect = document.getElementById("tema");
        if (temaSelect) {
            temaSelect.value = temaSalvo;
            mudarTema();
        }
    } catch (e) { console.warn("Temas não puderam ser carregados."); }
}

window.onload = registerEvents;