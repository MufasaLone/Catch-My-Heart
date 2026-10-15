const openBtn = document.getElementById("openBtn");
const continueBtn = document.getElementById("continueBtn");
const present = document.getElementById("present");
const countdown = document.getElementById("countdown");
const loveMessage = document.getElementById("loveMessage");

const messages = ["Happy Valentine", "Thank you", "For Being Here", "When I Needed", "You The Most", "And", "For The Time", "We Spent", "Together"]
const numMessage = messages.length;

const buttonSound = new Audio("./sound/Button.mp3");
const clickSound = new Audio("./sound/Click pop up.wav");

buttonSound.preload = "auto";
clickSound.preload = "auto";

function spawnHearts() {
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart-particle");
        heart.innerText = "C";

        // Random position
        heart.style.left = Math.random() * window.innerWidth + "px";
        heart.style.top = Math.random() * window.innerHeight + "px";

        // Random size
        heart.style.fontSize = (15 + Math.random() * 25) + "px";

        document.body.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
}

openBtn.addEventListener("click", () => {
    buttonSound.play();

    openBtn.classList.add("hidden");
    present.classList.add("hidden");
    countdown.classList.remove("hidden");

    let count = numMessage + 3;
    const temp_count = count;
    countdown.innerText = 3;

    const timer = setInterval(() => {
        count--;
        if (count > numMessage) {
            countdown.innerText = count + 3 - temp_count;
        } else if (count > 0 && count <= numMessage) {
            countdown.innerText = messages[numMessage - count];
            countdown.style.fontSize = "40px";
            clickSound.play();
        } else if (count === 0) {
            clearInterval(timer);
            spawnHearts();
            countdown.classList.add("hidden");
            loveMessage.classList.remove("hidden");
            loveMessage.style.display = "flex";
            continueBtn.classList.remove("hidden");
        }
        
    }, 1000);
});

continueBtn.addEventListener("click", () => {
    app.resumeGame();   // resume main window
    app.closePopUp();      // close popup
});
