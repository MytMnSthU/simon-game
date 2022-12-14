let order = [];
let playerOrder = [];
let flash; // number of flash appear in game
let turn; // to keep track what turn
let good; // correct or not
let compTurn; // to keep track computer turn or player turn
let intervalId;
let strict = false; // to keep track strict button on or off
let noise = true; // if we are playing sounds or noise, it is true
let on = false; // power button on or off
let win; // the game is win or not

let green = {
    id: 1,
    sound: "clip1",
    elmName: "topleft",
    color: "lightgreen",
};
let red = {
    id: 2,
    sound: "clip2",
    elmName: "topright",
    color: "tomato",
};
let yellow = {
    id: 3,
    sound: "clip3",
    elmName: "bottomleft",
    color: "yellow",
};
let blue = {
    id: 4,
    sound: "clip4",
    elmName: "bottomright",
    color: "lightskyblue",
};

let unpressColors = ["darkgreen", "darkred", "goldenrod", "darkblue"];
let pressColors = ["lightgreen", "tomato", "yellow", "lightskyblue"];

const turnCounter = document.querySelector("#turn");
const colorBtns = document.querySelectorAll(".btn-color");
const strictBtn = document.querySelector("#strict");
const onBtn = document.querySelector("#on");
const startBtn = document.querySelector("#start");

strictBtn.addEventListener("click", () => {
    if (strictBtn.checked == true) {
        strict = true;
    } else {
        strict = false;
    }
});

onBtn.addEventListener("click", () => {
    if (onBtn.checked == true) {
        on = true;
        turnCounter.innerHTML = "-";
    } else {
        on = false;
        turnCounter.innerHTML = "";

        colorAction("clear");
        clearInterval(intervalId);
    }
});

startBtn.addEventListener("click", () => {
    if (on || win) play();
});

colorBtns.forEach((colorBtn) => {
    colorBtn.addEventListener("click", () => {
        let color = colorBtn.dataset.color;
        
        if (color == "green") action(green, green.id);
        if (color == "red") action(red, red.id);
        if (color == "yellow") action(yellow, yellow.id);
        if (color == "blue") action(blue, blue.id);
    });
});

function play() {
    win = false;
    order = [];
    playerOrder = [];
    flash = 0;
    intervalId = 0;
    turn = 1;
    turnCounter.innerHTML = 1;
    good = true;

    //  to create random order
    for (let i = 0; i < 10; i++) {
        order.push(Math.floor(Math.random() * 4) + 1);
    }

    compTurn = true;

    intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
    on = false;

    if (flash == turn) {
        clearInterval(intervalId);
        compTurn = false;
        colorAction("clear");
        on = true;
    }

    if (compTurn) {
        colorAction("clear");
        setTimeout(() => {
            if (order[flash] == 1) press(green);
            if (order[flash] == 2) press(red);
            if (order[flash] == 3) press(yellow);
            if (order[flash] == 4) press(blue);
            flash++;
        }, 200);
    }
}

function press(name) {
    if (noise) {
        let audio = document.getElementById(name.sound);
        audio.play();
    }
    noise = true;
    document.getElementById(name.elmName).style.backgroundColor = name.color;
}

function colorAction(cmd) {
    if (cmd == "clear") {
        colorBtns.forEach((btn, idx) => {
            btn.style.backgroundColor = unpressColors[idx];
        });
    } else {
        colorBtns.forEach((btn, idx) => {
            btn.style.backgroundColor = pressColors[idx];
        });
    }
}

function action(name,id) {
    if (on) {
        playerOrder.push(id);
        check();
        press(name);
        if (!win) {
            setTimeout(() => {
                colorAction("clear");
            }, 300);
        }
    }
}

function check() {
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
        good = false;

    if (playerOrder.length == 10 && good) winGame();

    if (good == false) {
        colorAction();
        turnCounter.innerHTML = "NO!";

        setTimeout(() => {
            turnCounter.innerHTML = turn;
            colorAction("clear");

            if (strict) {
                play();
            } else {
                compTurn = true;
                flash = 0;
                playerOrder = [];
                good = true;
                intervalId = setInterval(gameTurn, 800);
            }
        }, 800);

        noise = false;
    }

    if (turn == playerOrder.length && good && !win) {
        turn++;
        playerOrder = [];
        compTurn = true;
        flash = 0;
        turnCounter.innerHTML = turn;
        intervalId = setInterval(gameTurn, 800);
    }
}

function winGame() {
    colorAction();
    turnCounter.innerHTML = "WIN!";
    on = false;
    win = true;
}
