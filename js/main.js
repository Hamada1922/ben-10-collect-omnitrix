// called Elements
let selectBenDiv = document.querySelector('.start-screen .imgs');
let startBtn = document.querySelector(".start-screen div button");
let userNameInput = document.querySelector(".start-screen div input");
let startScreen = document.querySelector(".start-screen");
//
let resultScreen = document.querySelector(".result-screen");
let replayBtn = document.querySelector(".result-screen .replay");
let resultSentence = document.querySelector(".result-screen h1");
//
let gameScreen = document.querySelector(".game-screen");
let pic = document.querySelector(".pic img");
let gameFeild = document.querySelector(".stage .field");
let userName = document.querySelector(".user-name");
let score = document.querySelector(".score");
let progressTab = document.querySelector(".holder span");
let lives = document.querySelector(".lives");
let basket = document.querySelector(".basket");
let left = document.querySelector(".control .left");
let right = document.querySelector(".control .right");
// variables
let currentPosition = 40;
let currentAlien = 1;
// functions
let request = new XMLHttpRequest();
request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
        let aliensObj = JSON.parse(request.responseText);
        // Add Bens
        addBenImgs(aliensObj);
        // Select Ben
        let bens = Array.from(selectBenDiv.children);
        selectBen(bens);
        // start
        startBtn.onclick = () => {
            let benFilter = bens.filter((ben) => ben.classList.contains("selected"));
            if (!userNameInput.value || benFilter.length === 0) {
                false;
            } else {
                let objIndex = parseInt(document.querySelector(".imgs .selected").alt);
                startScreen.remove();
                gameScreen.classList.remove("hide");
                //
                userName.innerHTML = userNameInput.value;
                //
                showAlien(aliensObj[objIndex]);
                //
                createOmnitrix(aliensObj[objIndex]);
            }
        }
    }
}
request.open("GET", "aliens.json");
request.send();
//
function addBenImgs(obj) {
    for (let i = 0; i < obj.length; i++) {
        let img = document.createElement("img");
        img.src = `${obj[i].ben}`;
        img.alt = `${obj[i].index}`;
        selectBenDiv.append(img);
    }
}
//
function selectBen(bens) {
    bens.forEach((ben) => {
        ben.onclick = () => {
            bens.forEach((ben) => {
                ben.classList.remove("selected");
            });
            ben.classList.add("selected");
            userNameInput.focus();
        }
    });
}
//
function showAlien(obj) {
    if (currentAlien < 11) {
        let alien = `alien-${currentAlien}`;
        pic.src = obj[alien]
    }
    currentAlien++;
}
//
let dropTime = 20;
let progressHeight = 0;
function createOmnitrix(obj) {
    let createOmniRepeat = setInterval(() => {
        let random = Math.floor(Math.random() * 10);
        let omnitrix = document.createElement("img");
        omnitrix.src = `${obj.omnitrix}`;
        omnitrix.classList.add("omni");
        omnitrix.style.left = `${random}0%`
        gameFeild.appendChild(omnitrix);
        let height = gameFeild.clientHeight - 40;
        console.log(random)
        //
        let dropSpeed = 0;

        let dropMove = setInterval(() => {
            dropSpeed += 10;
            omnitrix.style.top = `${dropSpeed}px`
            if (dropSpeed >= height) {
                clearInterval(dropMove);
                omnitrix.remove();
                if (lives.innerHTML > "1") {
                    if ((random * 10) >= currentPosition && (random * 10) <= (currentPosition + 25)) {
                        score.innerHTML = parseInt(score.innerHTML) + 100;
                        for (let i = 1; i <= 10; i++) {
                            if (score.innerHTML === `${i * 5}00`) {
                                progressTab.style.height = `${i * 10}%`;
                                showAlien(obj);
                            }
                        }
                        if (score.innerHTML === "5000") {
                            fin(createOmniRepeat, "Win");
                        }
                    } else {
                        lives.innerHTML = parseInt(lives.innerHTML) - 1;
                    }
                } else {
                    fin(createOmniRepeat, "Lose");
                    lives.innerHTML = "0";
                }
            }
        }, (dropTime * (random + 1)));
    }, 5000);
}
//
function fin(interval, word) {
    clearInterval(interval);
    resultScreen.classList.add("active");
    resultSentence.textContent = `You ${word}`;
    gameScreen.classList.add("hide");
}
//
function gameControl() {
    basket.style.left = `${currentPosition}%`;
    currentPosition === 0
        ? left.classList.add("disabled")
        : left.classList.remove("disabled");
    currentPosition === 70
        ? right.classList.add("disabled")
        : right.classList.remove("disabled");
}
right.onclick = () => {
    if (right.classList.contains("disabled")) {
        false;
    } else {
        currentPosition += 10;
        gameControl();
    }
    console.log(currentPosition)
}
left.onclick = () => {
    if (left.classList.contains("disabled")) {
        false;
    } else {
        currentPosition -= 10;
        gameControl();
    }
    console.log(currentPosition)
}
replayBtn.onclick = () => {
    window.location.reload();
}
