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

<img width="292" height="195" alt="Tela de vitoria do Campo Minado" src="<img width="1280" height="921" alt="ranking" src="https://github.com/user-attachments/assets/75890936-01d1-4685-b02e-2281ebd1bf2c"/>" />
<br>

<img width="457" height="489" alt="Partida de Campo Minado" src="<img width="1280" height="921" alt="cronometro" src="https://github.com/user-attachments/assets/89843b61-fc7f-4284-b1f5-673128bbff93" />
<br>

<img width="445" height="485" alt="Resultado de uma partida" src="https://github.com/user-attachments/assets/b1abec2b-8a83-45b4-89ba-1eeae4b9af76" />

## Autor

Desenvolvido por [JoaoVMouraDev](https://github.com/JoaoVMouraDev).
