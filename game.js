// game.js - 贪吃蛇游戏核心代码（简化版）

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 100, y: 100 }];
let direction = { x: 10, y: 0 };
let food = { x: 200, y: 200 };

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let part of snake) {
        ctx.fillRect(part.x, part.y, 10, 10);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function updateSnake() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        food.x = Math.floor(Math.random() * 40) * 10;
        food.y = Math.floor(Math.random() * 40) * 10;
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    updateSnake();
}

function controlSnake(e) {
    if (e.key === 'ArrowUp') direction = { x: 0, y: -10 };
    if (e.key === 'ArrowDown') direction = { x: 0, y: 10 };
    if (e.key === 'ArrowLeft') direction = { x: -10, y: 0 };
    if (e.key === 'ArrowRight') direction = { x: 10, y: 0 };
}

document.addEventListener('keydown', controlSnake);

setInterval(draw, 100);
