const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 50,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    score: 0,
    isJumping: false,
    rotation: 0 // Nova propriedade para rotação
};

let obstacles = [];
let obstacleFrequency = 1500; // milliseconds
let gameOver = false;

let clouds = Array.from({length: 3}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 100,
    width: 60,
    speed: 1
}));

let trees = Array.from({length: 4}, () => ({
    x: Math.random() * canvas.width,
    width: 40,
    height: 60
}));

let gameStarted = false;
const startMessage = document.getElementById('startMessage');

let obstacleInterval;

function startGame() {
    if (!gameStarted) {
        document.addEventListener('keydown', handleKeydown);
        drawInitialScene();
    }
}

function handleKeydown(e) {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            startMessage.classList.add('hidden');
            obstacleInterval = setInterval(generateObstacle, obstacleFrequency);
            requestAnimationFrame(gameLoop);
        } else if (!player.isJumping) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
    }
}

function drawInitialScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o céu
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o chão
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Desenha o jogador
    drawPlayer();
}

function generateObstacle() {
    const difficultyFactor = Math.floor(player.score / 10); // Aumenta a cada 10 pontos
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 20 + (difficultyFactor * 2), // Aumenta a largura
        height: 40 + (difficultyFactor * 3), // Aumenta a altura
        speed: 5 + (difficultyFactor * 0.5) // Aumenta a velocidade
    };
    obstacles.push(obstacle);
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o céu
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha as nuvens
    drawClouds();
    
    // Desenha o chão
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Desenha as árvores
    drawTrees();
    
    updatePlayer();
    updateObstacles();
    checkCollisions();
    drawPlayer();
    drawObstacles();
    updateScore();
    
    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height - 30) {
        player.y = canvas.height - 60;
        player.dy = 0;
        player.isJumping = false;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacles[i].speed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            player.score++;
            
            // Ajusta a frequência de geração de obstáculos
            if (player.score % 10 === 0) {
                obstacleFrequency = Math.max(1000, obstacleFrequency - 100);
                // Reinicia o intervalo com nova frequência
                clearInterval(obstacleInterval);
                obstacleInterval = setInterval(generateObstacle, obstacleFrequency);
            }
        }
    }
}

function checkCollisions() {
    for (let obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
            startMessage.textContent = 'Game Over! Pressione ESPAÇO para reiniciar';
            startMessage.classList.remove('hidden');
            setTimeout(() => {
                document.location.reload();
            }, 2000);
        }
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    
    // Rotação baseada no movimento vertical
    if (player.isJumping) {
        player.rotation = player.dy * 2; // Rotação proporcional à velocidade vertical
    } else {
        player.rotation = 0;
    }
    ctx.rotate(player.rotation * Math.PI / 180);
    
    // Corpo principal
    ctx.fillStyle = 'blue';
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    
    // Efeito de "propulsão" quando pulando
    if (player.isJumping) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-player.width/2, player.height/2);
        ctx.lineTo(0, player.height/2 + 15);
        ctx.lineTo(player.width/2, player.height/2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function drawClouds() {
    ctx.fillStyle = 'white';
    for (let cloud of clouds) {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
        ctx.arc(cloud.x - 15, cloud.y + 10, 15, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15, cloud.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        cloud.x -= cloud.speed;
        if (cloud.x < -60) {
            cloud.x = canvas.width + 60;
            cloud.y = Math.random() * 100;
        }
    }
}

function drawTrees() {
    for (let tree of trees) {
        // Tronco
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(tree.x, canvas.height - tree.height - 30, 20, tree.height);
        
        // Copa
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(tree.x - 20, canvas.height - tree.height - 30);
        ctx.lineTo(tree.x + 40, canvas.height - tree.height - 30);
        ctx.lineTo(tree.x + 10, canvas.height - tree.height - 70);
        ctx.fill();
        
        tree.x -= 2;
        if (tree.x < -40) {
            tree.x = canvas.width + 40;
        }
    }
}

function updateScore() {
    document.getElementById('scoreDisplay').textContent = player.score;
}

startGame();