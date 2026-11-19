const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let food = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let score = 0;
let gameInterval;

function main() {
  if (hasGameEnded()) {
    clearInterval(gameInterval);
    alert(`Fim de jogo! Pontuação final: ${score}`);
    return;
  }

  clearCanvas();
  drawFood();
  moveSnake();
  drawSnake();
}

function clearCanvas() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#4CAF50" : "#8BC34A";
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Comer a comida
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  // Evitar que a comida nasça em cima da cobra
  snake.forEach(part => {
    if (part.x === food.x && part.y === food.y) {
      generateFood();
    }
  });
}

function drawFood() {
  ctx.fillStyle = "#FF5722";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function hasGameEnded() {
  // Colisão com as paredes
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= tileCount;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= tileCount;

  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
    return true;
  }

  // Colisão com o próprio corpo
  for (let i = 4; i < snake.snakeLength; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  return false;
}

window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

// Iniciar o jogo (atualiza a cada 100ms)
gameInterval = setInterval(main, 100);
