// Elementos do DOM
const submarine = document.getElementById('submarine');
const gameContainer = document.getElementById('game');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const restartBtn = document.getElementById('restartBtn');
const shootBtn = document.getElementById('shootBtn');
const scoreDisplay = document.getElementById('score');
const gameOverlay = document.getElementById('gameOverlay');

// Áudio
const bgMusic = document.getElementById('bgMusic');
const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');

// Variáveis globais
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isGameOver = false;
let isGamePaused = false;
let animationId;
let submarinePosition;
const submarineSpeed = 2;
let movingRight = false;

// Função para movimentar o submarino
function moveSubmarine() {
    const containerWidth = gameContainer.offsetWidth;
    const submarineWidth = submarine.offsetWidth;

    if (movingRight) {
        submarinePosition += submarineSpeed;
        if (submarinePosition + submarineWidth >= containerWidth) {
            movingRight = false;
        }
    } else {
        submarinePosition -= submarineSpeed;
        if (submarinePosition <= 0) {
            movingRight = true;
        }
    }

    submarine.style.left = `${submarinePosition}px`;

    if (!isGameOver && !isGamePaused) {
        animationId = requestAnimationFrame(moveSubmarine);
    }
}

// Função para iniciar o jogo
function startGame() {
    resetGame();
    isGameOver = false;
    isGamePaused = false;
    score = 0;

    const containerWidth = gameContainer.offsetWidth;
    submarinePosition = containerWidth - submarine.offsetWidth;
    submarine.style.left = `${submarinePosition}px`;

    scoreDisplay.textContent = `Acertos: ${score} | Recorde: ${highScore}`;
    const gameOverlay = document.getElementById('gameOverlay');
    gameOverlay.style.display = 'none';

    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    shootBtn.style.display = 'inline-block';
    restartBtn.style.display = 'inline-block';

    createShips();
    moveSubmarine();
    bgMusic.play();
}

// Função para criar navios
function createShips() {
    const shipsData = [
        { id: 'ship', top: '5%', left: '10%' },
        { id: 'ship1', top: '35%', left: '30%' },
        { id: 'ship2', top: '10%', left: '70%' },
        { id: 'ship3', top: '25%', left: '10%' },
    ];

    document.querySelectorAll('.ship').forEach(ship => ship.remove());

    shipsData.forEach(shipData => {
        const ship = document.createElement('div');
        ship.className = 'ship';
        ship.id = shipData.id;
        ship.style.top = shipData.top;
        ship.style.left = shipData.left;
        ship.style.position = 'absolute';
        ship.style.width = '80px';
        ship.style.height = '80px';
        ship.style.backgroundImage = `url('imagem/${shipData.id}.jpeg')`;
        ship.style.backgroundSize = 'contain';
        ship.style.backgroundRepeat = 'no-repeat';
        gameContainer.appendChild(ship);
    });
}

// Função para disparar torpedos
function shootTorpedo() {
    const torpedo = document.createElement('div');
    torpedo.className = 'torpedo';
    gameContainer.appendChild(torpedo);

    torpedo.style.left = `${submarine.offsetLeft + submarine.offsetWidth / 2 - 5}px`;
    torpedo.style.top = `${submarine.offsetTop}px`;
    torpedo.style.display = 'block';

    let interval = setInterval(() => {
        const currentTop = parseInt(torpedo.style.top);
        torpedo.style.top = `${currentTop - 10}px`;

        document.querySelectorAll('.ship').forEach(ship => {
            if (checkCollision(torpedo, ship)) {
                ship.remove();
                score++;
                scoreDisplay.textContent = `Acertos: ${score} | Recorde: ${highScore}`;

                // Reproduzir o som de impacto para cada navio abatido
                const impactSound = new Audio(hitSound.src);
                impactSound.play();

                clearInterval(interval);
                torpedo.remove();

                // Checa se todos os navios foram destruídos
                if (document.querySelectorAll('.ship').length === 0) {
                    endGame();
                }
            }
        });

        if (currentTop <= 0) {
            clearInterval(interval);
            torpedo.remove();
            missSound.currentTime = 0;
            missSound.play();
        }
    }, 50);
}

// Função para checar colisão
function checkCollision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Finalizar o jogo
function endGame() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameOverlay.innerHTML = `<span>Parabéns! Todos os navios foram atingidos</span>`;
    gameOverlay.style.display = 'flex';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    shootBtn.style.display = 'none';
    restartBtn.style.display = 'none';
}

// Função para parar o jogo
function stopGame() {
    isGamePaused = true;
    cancelAnimationFrame(animationId);
    bgMusic.pause();
    stopBtn.style.display = 'none';
    shootBtn.style.display = 'inline-block';
}

// Função para reiniciar o jogo
function restartGame() {
    if (!isGamePaused) return;
    isGamePaused = false;
    stopBtn.style.display = 'inline-block';
    moveSubmarine();
    bgMusic.play();
}

// Função para resetar o jogo
function resetGame() {
    document.querySelectorAll('.ship').forEach(ship => ship.remove());
    isGameOver = false;
}

// Eventos
startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);
restartBtn.addEventListener('click', restartGame);
shootBtn.addEventListener('click', shootTorpedo);





