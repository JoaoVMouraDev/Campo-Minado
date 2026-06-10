# Campo Minado

Uma versão web do clássico Campo Minado, desenvolvida com HTML, CSS e JavaScript puro.

O objetivo é revelar todas as células seguras sem clicar em uma bomba. Use os números exibidos no tabuleiro para descobrir quantas bombas existem nas células vizinhas.

## Funcionalidades

- Três níveis de dificuldade: Fácil, Médio e Difícil
- Primeiro clique sempre seguro
- Marcação e remoção de bandeiras com o botão direito
- Cronômetro e contador de bombas
- Expansão automática de áreas vazias
- Ranking com os 10 melhores tempos de cada dificuldade
- Nome do jogador e recordes salvos no navegador
- Temas Neon, Clássico e Cyberpunk
- Efeitos sonoros e animações de vitória e derrota
- Botão para reiniciar a partida

## Como jogar

1. Escolha a dificuldade e o tema.
2. Clique em **Jogar** para iniciar.
3. Use o botão esquerdo para revelar uma célula.
4. Use o botão direito para colocar ou remover uma bandeira.
5. Revele todas as células que não possuem bombas para vencer.

## Executar localmente

Clone o repositório:

```bash
git clone https://github.com/JoaoVMouraDev/Campo-Minado.git
cd Campo-Minado
```

Abra o arquivo `index.html` no navegador.

Também é possível iniciar um servidor local:

```bash
npx serve .
```

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Canvas Confetti
- Party.js

## Armazenamento

Os melhores tempos, o nome do jogador e o tema selecionado ficam salvos no `localStorage` do navegador. Por isso, os recordes são individuais para cada navegador/dispositivo.

## Pré-visualização

Tela do Ranking: 
<img width="1280" height="921" alt="ranking" src="https://github.com/user-attachments/assets/75890936-01d1-4685-b02e-2281ebd1bf2c"/>
<br>

Tela de Vitoria: 
<img width="1280" height="921" alt="vitoria" src="https://github.com/user-attachments/assets/a863a465-a544-49ab-843b-ad8d98104957" />

<br>
Tela de derrota<img width="1287" height="934" alt="derrota" src="https://github.com/user-attachments/assets/066d3950-7d6e-4deb-a184-853a0b863b27" />

<br>
Tela mostrando o cronometro:
<img width="1280" height="921" alt="cronometro" src="https://github.com/user-attachments/assets/a850bc03-1669-468d-8bdc-c8cbb45a2f2e" />

<br>
TEMAS:
<br>
<br>
<br>

Tema classico:
<img width="1280" height="921" alt="tema-classico" src="https://github.com/user-attachments/assets/09085b17-d3bf-4da7-bbe3-4325ca82e336" />
<br>
Tema neon: 
<img width="1280" height="921" alt="tema-neon" src="https://github.com/user-attachments/assets/1ab6bc11-238a-404b-a0d3-ff7181759153" />
<br>
Tema cyberpunk: 
<img width="1280" height="921" alt="tema-cyberpunk" src="https://github.com/user-attachments/assets/821f8046-3803-4325-887a-4eccb04ed0db" />
<br>

## Autor

Desenvolvido por [JoaoVMouraDev](https://github.com/JoaoVMouraDev).
