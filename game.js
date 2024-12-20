// Получаем доступ к canvas и контексту для рисования
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Размеры канваса
canvas.width = 800;
canvas.height = 600;

// Начальные параметры игры
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

let bullets = [];
let enemies = [];
let gameOver = false;
let score = 0;

// Обработчик ввода (движение игрока)
document.addEventListener("keydown", movePlayer);
document.addEventListener("keyup", stopPlayer);

// Функции управления игроком
function movePlayer(e) {
    if (e.key === "ArrowLeft" || e.key === "a") {
        player.dx = -player.speed;
    } else if (e.key === "ArrowRight" || e.key === "d") {
        player.dx = player.speed;
    } else if (e.key === " ") {
        shoot();
    }
}

function stopPlayer(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "a" || e.key === "d") {
        player.dx = 0;
    }
}

// Функция для движения игрока
function updatePlayer() {
    player.x += player.dx;

    // Ограничение движения игрока по оси X
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Функция для создания пуль
function shoot() {
    let bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 4
    };
    bullets.push(bullet);
}

// Функция для движения пуль
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;

        // Удаление пуль, если они выходят за пределы канваса
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Функция для создания врагов
function createEnemy() {
    let enemy = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        speed: Math.random() * 2 + 1
    };
    enemies.push(enemy);
}

// Функция для движения врагов
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;

        // Если враг выходит за пределы канваса
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }

        // Проверка на столкновение с пулями
        for (let j = 0; j < bullets.length; j++) {
            if (bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y) {

                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                i--;
                break;
            }
        }

        // Проверка на столкновение с игроком (Game Over)
        if (enemies[i].x < player.x + player.width &&
            enemies[i].x + enemies[i].width > player.x &&
            enemies[i].y < player.y + player.height &&
            enemies[i].y + enemies[i].height > player.y) {
            gameOver = true;
            showGameOver();
        }
    }
}

// Функция для рисования объектов на канвасе
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем игрока
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Рисуем пули
    ctx.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }

    // Рисуем врагов
    ctx.fillStyle = "green";
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    // Рисуем очки
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Функция для обновления состояния игры
function update() {
    if (!gameOver) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        draw();
        requestAnimationFrame(update);
    }
}

// Функция для показа экрана Game Over
function showGameOver() {
    document.getElementById("gameOver").classList.remove("hidden");
}

// Функция для перезапуска игры
document.getElementById("restartButton").addEventListener("click", () => {
    // Сбрасываем состояние игры
    gameOver = false;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    player.dx = 0;
    bullets = [];
    enemies = [];
    score = 0;
    document.getElementById("gameOver").classList.add("hidden");

    // Запускаем игру заново
    update();
});

// Генерация врагов
setInterval(createEnemy, 1000);

// Начать игру
update();