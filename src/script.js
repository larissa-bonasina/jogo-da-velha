const cells = document.querySelectorAll('[data-cell]');
let currentPlayer = 'X';
let gameActive = true;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6] // diagonais
];

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick, { once: true });
});

function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = Array.from(cells).indexOf(cell);
  placeMark(cell, cellIndex);
  if (checkWin(currentPlayer)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    changePlayer();
  }
  
  if (currentPlayer === 'O' && gameActive) {
    makeComputerMove();
  }
}

function placeMark(cell, index) {
  cell.dataset.cell = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => cells[index].dataset.cell === player);
  });
}

function isDraw() {
  return Array.from(cells).every(cell => {
    return cell.dataset.cell === 'X' || cell.dataset.cell === 'O';
  });
}

function endGame(draw) {
  if (draw) {
    alert('Empate!');
  } else {
    alert(`Jogador ${currentPlayer} venceu!`);
  }
  gameActive = false;
}

function makeComputerMove() {
  const availableCells = Array.from(cells).filter(cell => {
    return cell.dataset.cell !== 'X' && cell.dataset.cell !== 'O';
  });
  
  let bestScore = -Infinity;
  let bestMove;

  availableCells.forEach(cell => {
    const cellIndex = Array.from(cells).indexOf(cell);
    cells[cellIndex].dataset.cell = 'O';
    cells[cellIndex].textContent = 'O';

    const score = minimax(cells, 0, false);
    
    cells[cellIndex].dataset.cell = '';
    cells[cellIndex].textContent = '';

    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  });

  setTimeout(() => {
    handleCellClick({ target: bestMove });
  }, 1000);
}

function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -1,
    O: 1,
    draw: 0
  };

  if (checkWin('X')) {
    return scores.X - depth;
  }

  if (checkWin('O')) {
    return scores.O - depth;
  }

  if (isDraw()) {
    return scores.draw;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    Array.from(board).forEach(cell => {
      if (cell.dataset.cell === '') {
        cell.dataset.cell = 'O';
        const score = minimax(board, depth + 1, false);
        cell.dataset.cell = '';

        bestScore = Math.max(score, bestScore);
      }
    });

    return bestScore;
  } else {
    let bestScore = Infinity;

    Array.from(board).forEach(cell => {
      if (cell.dataset.cell === '') {
        cell.dataset.cell = 'X';
        const score = minimax(board, depth + 1, true);
        cell.dataset.cell = '';

        bestScore = Math.min(score, bestScore);
      }
    });

    return bestScore;
  }
}