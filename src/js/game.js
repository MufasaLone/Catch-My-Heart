const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const message = document.getElementsByClassName("message");
const messageContainer = document.getElementById("message-container");
const restartBtn = document.getElementById("restartButton");
const highscoreDisplay = document.getElementById("highscore");

const catchSound1 = new Audio("./sound/Catch 1.wav");
const catchSound2 = new Audio("./sound/Catch 2.wav");
const catchSound3 = new Audio("./sound/Catch 3.wav");
const catchSound4 = new Audio("./sound/Catch 4.wav");
const catchSound5 = new Audio("./sound/Catch 5.wav");
const catchSounds = [catchSound1, catchSound2, catchSound3, catchSound4, catchSound5];

catchSound1.preload = "auto";
catchSound2.preload = "auto";
catchSound3.preload = "auto";
catchSound4.preload = "auto";
catchSound5.preload = "auto";

const popUpOpen_Sound = new Audio("./sound/Pop up open.mp3");
const popUpClose_Sound = new Audio("./sound/Pop up close.mp3");
const gameOverSound = new Audio("./sound/Game over.wav");
const highscoreSound = new Audio("./sound/Highscore.wav");
const buttonSound = new Audio("./sound/Button.mp3");


popUpOpen_Sound.preload = "auto";
popUpClose_Sound.preload = "auto";
gameOverSound.preload = "auto";
highscoreSound.preload = "auto";
buttonSound.preload = "auto";

const surprise_score = 50;

let catchSound;
let popUp = false;
let gameRunning = true;
let score = 0;
let basketX = window.innerWidth / 2;
let highscore = localStorage.getItem("highscore") || 0;
highscore = parseInt(highscore);

highscoreDisplay.innerText = "High Score: " + highscore;

basket.style.left = basketX + "px";

restartBtn.addEventListener('click', restartGame)

// Move basket with mouse
document.addEventListener("mousemove", (e) => {
    if (!gameRunning) return;
    
    basketX = e.clientX;

    if (basketX > window.innerWidth - basket.offsetWidth) {
        basketX = window.innerWidth - basket.offsetWidth;
    };

    basket.style.left = basketX + "px";
});

function createHeart() {
    const heart = document.createElement("div");
    const heartWidth = 40;
    heart.classList.add("heart");
    heart.style.left = Math.random() * (window.innerWidth - heartWidth) + "px";
    heart.style.animationDuration = 3 + Math.random() * 2 + "s";

    document.getElementById("game").appendChild(heart);

    start_fallInterval(heart);
}

function start_fallInterval(heart) {
    const fallInterval = setInterval(() => {
        if (!gameRunning) {
            return;
        }

        const heartRect = heart.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();
        if (
            heartRect.bottom >= basketRect.top &&
            heartRect.left < basketRect.right &&
            heartRect.right > basketRect.left
        ) {
            score++;
            scoreDisplay.innerText = "Score: " + score;
            
            catchSound = catchSounds[Math.floor(Math.random() * 5)];
            catchSound.currentTime = 0; // reset so it can spam
            catchSound.play();
            if (score === surprise_score && popUp) {
                catchSound.pause();
                catchSound.currentTime = 0;
            }

            heart.remove();
            clearInterval(fallInterval);
            
            if (score === surprise_score && !popUp) {
                messageContainer.style.display = "flex";
                
                gameRunning = false;
                clearInterval(gameInterval);
                
                
                document.querySelectorAll(".heart").forEach(h => {
                    h.style.animationPlayState = "paused";
                });

                popUpOpen_Sound.play();
                popUp = true;
                app.openPopUp();
            }
        }
        
        if (heartRect.bottom > window.innerHeight) {
            clearInterval(fallInterval);
            clearInterval(gameInterval);
            document.querySelectorAll(".heart").forEach(h => h.remove());
            
            message[0].innerText = "Game over";
            message[1].innerText = "l"
            restartBtn.style.display = "block";
            messageContainer.style.display = "flex";

            if (score > highscore) {
                highscore = score;
                localStorage.setItem("highscore", highscore);
                highscoreDisplay.innerText = "High Score: " + highscore;
                message[0].innerText = "NEW HIGH SCORE!";
                highscoreSound.play();
            } else {
                gameOverSound.play();
            }

        }
    }, 50);
}

    
let gameInterval = setInterval(createHeart, 800);

function resumeGame() {
    gameRunning = true;

    clearInterval(gameInterval);
    createHeart()
    document.querySelectorAll(".heart").forEach(h => {
        h.style.animationPlayState = "running";
    });
    gameInterval = setInterval(createHeart, 800);

}

function restartGame() {
    score = 0;
    gameRunning = false;
    document.querySelectorAll(".heart").forEach(h => h.remove());

    // Hide popup
    messageContainer.style.display = "none";
    restartBtn.style.display = "none";
    scoreDisplay.innerText = "Score: 0";
    resumeGame();

    buttonSound.play();
}


window.resumeGame = resumeGame;

window.appReceive = window.appReceive || {};

window.app.onResumeGame(() => {
    popUpClose_Sound.play();
    resumeGame();
});
