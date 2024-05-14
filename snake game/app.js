const gameBoard = document.getElementById('gameBoard');
const context = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreVal');
const HighscoreText = document.getElementById('HighscoreVal');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const chooseDif = document.getElementById('dif');
const modal = document.getElementById("myModal"); 
const pauseModal = document.getElementById("pauseMyModal"); 
const resumeModal = document.getElementById("resumeModal");


const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height;
const UNIT = 25;

let snakeCollision=false;
let foodx;
let foody;
let TIMEOUT=200;
let resumeTimeout=800;
let xvel;
let yvel;
let score;
let Hscore = 0;
let active = false;

let snake = [];

// pauseBtn.addEventListener('click', showResumeModal); 
pauseBtn.addEventListener('click', openpauseModal); 
chooseDif.addEventListener('click', openModal); 
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
window.addEventListener('keydown', keypress);
window.addEventListener('keydown', checkSpace);

// startGame();
start();
function start() {
    pauseBtn.textContent = "Pause";
    clearBoard();
    context.font = "bold 50px serif";
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText("Click on start button", WIDTH / 2, HEIGHT / 2);
}
function startGame() {
    snakeCollision=false;
    resumeModal.style.display = "none"; 
    pauseModal.style.display = "none"; 
    if (!active || active) {
        active = true;
        pauseBtn.textContent = active ? "Pause" : "Resume";
        score = 0;
        scoreText.textContent = score;
        snake = [
            { x: UNIT * 3, y: 0 },
            { x: UNIT * 2, y: 0 },
            { x: UNIT, y: 0 },
            { x: 0, y: 0 }
        ];
        xvel = 25;
        yvel = 0;
        createFood();
        nextTick();
    }
}

function pauseGame() {
    if (!checkGameOver()) { // Check if the game is not over
        active = !active;
        pauseBtn.textContent = active ? "Pause" : "Resume";
        if (active) {
            nextTick();
        }

        // Toggle display of pause modal
        if (active) {
            pauseModal.style.display = "none"; 
            resumeModal.style.display = "block"; 
            setTimeout(() => {
                resumeModal.style.display = "none";
            },resumeTimeout);
        } else {
            pauseModal.style.display = "block"; 
        }
    }
}



function clearBoard() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function createFood() {
    do {
        foodx = Math.floor(Math.random() * (WIDTH / UNIT)) * UNIT;
        foody = Math.floor(Math.random() * (HEIGHT / UNIT)) * UNIT;
    } while (checkValidFood());
}


function checkValidFood() {
        for (let i = 0; i < snake.length; i++) {
            if (foodx === snake[i].x && foody === snake[i].y) {
                return true; // Food position is invalid
            }
        }
    return false; // Food position is valid
 }
    

// function displayFood() {
//     context.fillStyle = 'red';
//     context.fillRect(foodx, foody, UNIT, UNIT);
// }
function displayFood() {
    context.fillStyle = 'red';
    context.beginPath(); // Start a new path
    context.arc(foodx + UNIT / 2, foody + UNIT / 2, UNIT / 2, 0, Math.PI * 2); // Draw a circle
    context.fill(); // Fill the circle
}


function drawSnake() {
    context.fillStyle = 'aqua';
    snake.forEach((snakePart) => {
        context.beginPath(); 
        context.arc(snakePart.x + UNIT / 2, snakePart.y + UNIT / 2, UNIT / 2, 0, Math.PI * 2); 
        context.fill(); 
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xvel, y: snake[0].y + yvel };
    snake.unshift(head);
    if (snake[0].x == foodx && snake[0].y == foody) {
        score++;
        scoreText.textContent = score;
        if (score >= Hscore) {
            Hscore = score;
            HighscoreText.textContent = Hscore;
        }
        createFood();
    } else {
        snake.pop();
    }
    drawSnake();
}

function checkSnakeCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true; //snake Collision detected
        }
    }
    return false; // No collision detected
}
function nextTick() {
    if (active) {
        setTimeout(() => {
            clearBoard();
            displayFood();
            moveSnake();
            drawSnake();
            if (checkSnakeCollision()) {
                snakeCollision=true;
                checkGameOver();
                return; // Exit the function early if game over
            }
            checkGameOver();
            nextTick();
        }, TIMEOUT);
    }
}

function keypress(event) {
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    switch (true) {
        case (event.keyCode == left && xvel != UNIT):
            xvel = -UNIT;
            yvel = 0;
            break;
        case (event.keyCode == right && xvel != -UNIT):
            xvel = UNIT;
            yvel = 0;
            break;
        case (event.keyCode == up && yvel != UNIT):
            yvel = -UNIT;
            xvel = 0;
            break;
        case (event.keyCode == down && yvel != -UNIT):
            yvel = UNIT;
            xvel = 0;
            break;
    }
}

function checkGameOver() {
    if (active) {
        switch (true) {
            case (snake[0].x < 0):
            case (snake[0].x >= WIDTH):
            case (snake[0].y < 0):
            case (snake[0].y >= HEIGHT):
            case (snakeCollision):
                active = false;
                clearBoard();
                context.font = "bold 50px serif";
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText("Game Over!!", WIDTH / 2, HEIGHT / 2);
                pauseModal.style.display="none";
                resumeModal.style.display="none";
                resumeTimeout=-1;
                break;
        }
    }
}


function checkSpace(event) {
    if (event.keyCode === 32) {
        pauseGame();
        console.log("Space button is pressed");
    }
}

function openModal() {
    clearBoard();
    // pauseGame();
    // pauseModal.style.display="none";
    modal.style.display = "block"; 
}
function openpauseModal() {
    pauseModal.style.display = "block"; 
}

// Close the modal when clicking the close button (X)
document.getElementsByClassName("close")[0].onclick = function () {
    modal.style.display = "none"; 
}

// Close the modal when clicking outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; 
    }
}

// Function to handle difficulty level selection
function setDif(difficulty) {
    switch (difficulty) {
        case 'easy':
            TIMEOUT = 160;
            break;
            case 'medium':
                TIMEOUT = 110;
                break;
                case 'hard':
                    TIMEOUT = 60;
                    break;
                    default:
                        TIMEOUT = 160; // Default difficulty level is easy
                    }
                    startGame();
                }


document.getElementById("easyBtn").addEventListener("click", function () {
    setDif("easy");
    modal.style.display = "none";
});

document.getElementById("mediumBtn").addEventListener("click", function () {
    setDif("medium");
    modal.style.display = "none"; 
});

document.getElementById("hardBtn").addEventListener("click", function () {
    setDif("hard");
    modal.style.display = "none"; 
});