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

const enemyImg = new Image();
enemyImg.src = 'https://via.placeholder.com/50/FF0000/FFFFFF?text=E';

const bulletImg = new Image();
bulletImg.src = 'https://via.placeholder.com/5/FFFFFF/FFFFFF?text=|';

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Move enemies
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        if (enemy.y + enemy.height > canvas.height) {
            health -= 1;
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });

    // Check for collisions
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                score += 10;
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });

    // Draw everything
    drawPlayer();
    bullets.forEach(bullet => drawBullet(bullet));
    enemies.forEach(enemy => drawEnemy(enemy));

    // Check for game over
    if (health <= 0) {
        gameOver = true;
        gameOverBtn.disabled = false;
        updateHighScore();
        return;
    }

    // Spawn new wave of enemies if needed
    if (enemies.length === 0) {
        spawnEnemies();
        wave++;
    }

    requestAnimationFrame(update);
}

function spawnEnemies() {
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

function movePlayer() {
    if (player.dx !== 0) {
        player.x += player.dx;
    }
}

function keyDown(e) {
    if (gameOver || gamePaused) return;

    if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === ' ') {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 20,
            speed: 5
        });
    }
}

function keyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
    }
}

function pauseGame() {
    gamePaused = !gamePaused;
    pauseBtn.innerText = gamePaused ? 'Resume' : 'Pause';
}

function gameOverHandler() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreEl.innerText = highScore;
    }
    gameOver = true;
    gameOverBtn.disabled = false;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreEl.innerText = highScore;
    }
}

pauseBtn.addEventListener('click', pauseGame);
gameOverBtn.addEventListener('click', () => location.reload());

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

spawnEnemies();
update();
