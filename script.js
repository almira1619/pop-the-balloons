// =============================
// Pop the Balloons
// Part 1
// =============================

const menu = document.getElementById("menu");
const game = document.getElementById("game");

const playBtn = document.getElementById("playBtn");
const againBtn = document.getElementById("againBtn");

const instruction = document.getElementById("instruction");
const points = document.getElementById("points");

const finger = document.getElementById("finger");

const winScreen = document.getElementById("winScreen");

const pop = new Audio("assets/sounds/pop.mp4");
const wrong = new Audio("assets/sounds/wrong.mp4");
const win = new Audio("assets/sounds/win.mp3");

const balloons = document.querySelectorAll(".balloon");

const colours = [
"purple",
"brown",
"pink",
"white",
"black",
"grey"
];

let score = 0;

let currentColour = "";

let balloonData = [];

// =============================
// Voice
// =============================

function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "en-US";

speech.rate = 0.85;

speech.pitch = 1;

speech.volume = 1;

speechSynthesis.cancel();

speechSynthesis.speak(speech);

}

// =============================
// Random colour
// =============================

function randomColour(){

const alive = balloonData.filter(
b=>b.el.style.display!=="none"
);

const aliveColours = alive.map(
b=>[...b.el.classList].find(
c=>colours.includes(c)
)
);

currentColour =
aliveColours[
Math.floor(
Math.random()*aliveColours.length
)
];

instruction.innerHTML =
"Pop the <b>" +
currentColour.toUpperCase() +
"</b> balloon!";

speak(
"Pop the " +
currentColour +
" balloon"
);

}

// =============================
// Start game
// =============================

playBtn.addEventListener("click",()=>{

menu.style.display="none";

game.style.display="block";

score=0;

points.textContent=0;

});

// =============================
// Part 2
// =============================

// Подготовка шариков

balloons.forEach(balloon=>{

balloonData.push({

el:balloon,

x:Math.random()*(window.innerWidth-150),

y:window.innerHeight+Math.random()*500,

dx:(Math.random()*0.6-0.3),

dy:-(Math.random()*0.8+0.8)

});

});

// =============================
// Finger
// =============================

document.addEventListener("mousemove",(e)=>{

finger.style.left=e.clientX+"px";

finger.style.top=e.clientY+"px";

});

document.addEventListener("touchmove",(e)=>{

const touch=e.touches[0];

finger.style.left=touch.clientX+"px";

finger.style.top=touch.clientY+"px";

},{passive:true});

// =============================
// Balloon movement
// =============================

function moveBalloons(){

balloonData.forEach(b=>{

if(b.el.style.display==="none") return;

b.x+=b.dx;

b.y+=b.dy;

// лёгкое покачивание

if(b.x<20 || b.x>window.innerWidth-120){

b.dx*=-1;

}

// если шарик улетел вверх,
// появляется снизу

if(b.y<-180){

b.y=window.innerHeight+100;

b.x=Math.random()*(window.innerWidth-120);

}

b.el.style.left=b.x+"px";

b.el.style.top=b.y+"px";

});

requestAnimationFrame(moveBalloons);

}

// =============================
// Start animation
// =============================

playBtn.addEventListener("click",()=>{

balloonData.forEach(b=>{

b.el.style.display="block";

b.el.style.opacity="1";

b.el.style.transform="scale(1)";

b.el.style.pointerEvents="auto";

});

randomColour();

moveBalloons();

});

// =============================
// Part 3
// =============================

function createConfetti(x,y,color){

for(let i=0;i<14;i++){

const piece=document.createElement("div");

piece.className="confetti";

piece.style.background=color;

piece.style.left=x+"px";

piece.style.top=y+"px";

piece.style.setProperty(
"--x",
(Math.random()*180-90)+"px"
);

piece.style.setProperty(
"--y",
(Math.random()*180-40)+"px"
);

document.body.appendChild(piece);

setTimeout(()=>{

piece.remove();

},700);

}

}

function checkPop(){

    const fingerRect = finger.getBoundingClientRect();

    for(let b of balloonData){

        if(
            b.el.style.display==="none" ||
            b.el.dataset.popped==="1"
        ) continue;

        const balloonRect = b.el.getBoundingClientRect();

        const hit =

        fingerRect.left < balloonRect.right &&
        fingerRect.right > balloonRect.left &&
        fingerRect.top < balloonRect.bottom &&
        fingerRect.bottom > balloonRect.top;

        if(!hit) continue;

        const balloonColour =
        [...b.el.classList].find(
            c=>colours.includes(c)
        );

        if(balloonColour===currentColour){

            b.el.dataset.popped="1";

            pop.currentTime=0;
            pop.play();

const rect=b.el.getBoundingClientRect();

createConfetti(

rect.left+rect.width/2,

rect.top+rect.height/2,

balloonColour

);

            // красивое увеличение

            b.el.style.transition=
            "transform .18s, opacity .25s";

            b.el.style.transform="scale(1.25)";

            setTimeout(()=>{

                b.el.style.opacity="0";

            },120);

            setTimeout(()=>{

                b.el.style.display="none";

                score++;

                points.textContent=score;

                if(score>=balloonData.length){

                    win.currentTime=0;
                    win.play();

                    winScreen.style.display="flex";

                    return;

                }

                randomColour();

            },250);

        }else{

            wrong.currentTime=0;
            wrong.play();

        }

        break;

    }

}

// =============================
// Click
// =============================

document.addEventListener("click",()=>{

    checkPop();

});

document.addEventListener("touchstart",()=>{

    checkPop();

});

// =============================
// Play Again
// =============================

againBtn.addEventListener("click",()=>{

menu.style.display = "flex";
game.style.display = "none";    
winScreen.style.display="none";

    score=0;

    points.textContent=0;

    balloonData.forEach(b=>{

        b.el.style.display="block";
        b.el.style.opacity="1";
        b.el.style.transform="scale(1)";

        delete b.el.dataset.popped;

        b.y=window.innerHeight+Math.random()*500;
        b.x=Math.random()*(window.innerWidth-120);

    });

});