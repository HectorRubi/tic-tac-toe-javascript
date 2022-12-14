class Game {
  constructor(board, player1, player2) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.turn = true;
    this.turnCounter = 0;
    this.winner;
    this.winCombinations = [
      '012','345', '678',   // Horizontal
      '036', '147', '258',  // Vertical
      '048', '246'          // Diagonal
    ];
    this.init();
  }

  init() {
    this.player1.setTurn(true);
    this.board.setOnBoxClickedFn(this.changeTurn.bind(this));
  }

  start() {
    this.printPlayer();
  }

  stop() {
    this.board.finish();
    // const winnerSlide = document.getElementById('winnerSlide');
    // winnerSlide.classList.add('active');
  }

  reset() {
    this.board.clear();
    this.player1.reset();
    this.player1.setTurn(true);
    this.player2.reset();
    this.turn = true;
    this.turnCounter = 0;
    this.winner = undefined;
    this.printPlayer();
  }

  changeTurn() {
    this.turnCounter += 1;
    this.player1.setTurn(!this.player1.getTurn());
    this.player2.setTurn(!this.player2.getTurn());

    this.turn = !this.turn;
    this.printPlayer();

    this.board.setCurrentContent(this.turn ? "O" : "X");
    if (this.turnCounter > 4) {
      this.validateWinner();
    }
  }

  validateWinner() {
    const boardContent = this.board.getBoxListContent();

    let movesO = '';
    let movesX = '';

    boardContent.forEach((boxContent, index) => {
      if (boxContent === 'O') {
        movesO += index.toString();
      }
      if (boxContent === 'X') {
        movesX += index.toString();
      }
    });

    this.player1.isWinner = this.checkCombinations(movesO);
    this.player2.isWinner = this.checkCombinations(movesX);

    const winnerText = document.getElementById('winnerText');
    if (this.player1.isWinner) {
      winnerText.innerHTML = 'Player 1 is winner';
      this.winner = this.player1;
    } else if (this.player2.isWinner) {
      winnerText.innerHTML = 'Player 2 is winner';
      this.winner = this.player2;
    }

    if (this.winner) {
      this.stop();
    }
  }

  checkCombinations(moves) {
    let isWinner = false;
    this.winCombinations.forEach(combination => {
      const combArr = combination.split('');
      if (moves.match(`(?=.*${combArr[0]})(?=.*${combArr[1]})(?=.*${combArr[2]})`)) {
        isWinner = true;
      }
    });
    return isWinner;
  }

  printPlayer() {
    const turnText = document.getElementById("turnText");
    turnText.innerHTML = this.turn ? "Player 1" : "Player 2";
    
    const scoreTurn = document.querySelector('.score__turn');
    const scorePlayer = document.querySelector('.score__player');
    scoreTurn.style.width = `${scorePlayer.offsetWidth}px`;
    if (this.turn) {
      scoreTurn.classList.add('score__turn--player1');
      scoreTurn.classList.remove('score__turn--player2');
    } else {
      scoreTurn.classList.add('score__turn--player2');
      scoreTurn.classList.remove('score__turn--player1');
    }
  }
}
