const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverBtn = document.getElementById('gameOverBtn');
const highScoreEl = document.getElementById('highScore');

let gamePaused = false;
let gameOver = false;
let highScore = localStorage.getItem('highScore') || 0;
highScoreEl.innerText = highScore;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

let bullets = [];
let enemies = [];
let wave = 1;
let enemySpeed = 1;
let score = 0;
let health = 3;

const playerImg = new Image();
playerImg.src = 'https://via.placeholder.com/50/000000/FFFFFF?text=P';
playerImg.onerror = () => console.error("Failed to load player image");

const enemyImg = new Image();
enemyImg.src = 'https://via.placeholder.com/50/FF0000/FFFFFF?text=E';
enemyImg.onerror = () => console.error("Failed to load enemy image");

const bulletImg = new Image();
bulletImg.src = 'https://via.placeholder.com/5/FFFFFF/FFFFFF?text=|';
bulletImg.onerror = () => console.error("Failed to load bullet image");

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawBullet(bullet) {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawEnemy(enemy) {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
}

function update() {
    if (gamePaused || gameOver) return;
    console.log("Game updating...");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        if (enemy.y + enemy.height > canvas.height) {
            health -= 1;
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });

    console.log("Enemies count: ", enemies.length);
    drawPlayer();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);

    if (health <= 0) {
        gameOver = true;
        gameOverBtn.disabled = false;
        updateHighScore();
        return;
    }

    if (enemies.length === 0) {
        spawnEnemies();
        wave++;
    }

    requestAnimationFrame(update);
}

function spawnEnemies() {
    console.log("Spawning enemies...");
    const rows = 3;
    const cols = 5;
    const width = 50;
    const height = 50;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            enemies.push({
                x: j * (width + 10),
                y: i * (height + 10),
                width,
                height
            });
        }
    }
}

document.addEventListener('keydown', (e) => {
    console.log("Key Down:", e.key);
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === ' ') {
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 20, speed: 5 });
        console.log("Bullet fired!");
    }
});

document.addEventListener('keyup', (e) => {
    console.log("Key Up:", e.key);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

pauseBtn.addEventListener('click', () => {
    gamePaused = !gamePaused;
    pauseBtn.innerText = gamePaused ? 'Resume' : 'Pause';
    console.log("Game Paused:", gamePaused);
});

gameOverBtn.addEventListener('click', () => location.reload());
spawnEnemies();
update();
