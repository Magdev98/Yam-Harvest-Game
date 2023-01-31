// DOM
const gridElement = document.getElementById("grid");
const startButton = document.getElementById("start-button");
const scoreElement = document.getElementById("score");
const rules = document.querySelector(".rules");
const dialogModal = document.getElementById("dialog");
const endMessage = dialogModal.querySelector("#message");
const restartButton = dialogModal.querySelector("button");

const columns = 10;
const rows = 10;
let cells = [];
let currentPosition = 0;
let score = 0;
let countMushroom = 5;
let isKeyQPressed = false; // new learning
const messagesEndGame = [
  "You won! The tribe is proud of you, you are the best farmer of the tribe!",
  "You lost! You've ruined a whole year's harvest, you moron!",
];
let intervalId = null;

// Start the game
function startGame() {
  rules.remove();
  dialogModal.close();
  score = 0;
  displayScore();
  gridElement.innerHTML = "";
  cells = []; // an array of HTML div
  createGrid();
  initFarmer(currentPosition);
  createMushroom(5);
  createYam(1);
  displayTimer();
}

// Create the grid
function createGrid() {
  for (let i = 0; i < columns * rows; i++) createCell();
}

// Create the cells
function createCell() {
  const div = document.createElement("div");
  div.classList.add("cell");
  gridElement.append(div);
  cells.push(div);
}

function initFarmer(position) {
  cells[position].classList.add("farmer");
}

// Move the Kanak farmer or remove a mushroom when it blocks the path (new learning)
function moveFarmer(from, to) {
  // "from, to" parameter instead of hiding the player
  if (isKeyQPressed && cells[to].classList.contains("mushroom")) {
    cells[to].classList.remove("mushroom");
  } else {
    cells[from].classList.remove("farmer");
    cells[to].classList.add("farmer");
    currentPosition = to;
  }
}

// Create yam
function createYam(num) {
  const copyGridYam = [...cells];

  for (let i = 0; i < num; i++) {
    // random position
    let randomIndex = Math.floor(Math.random() * copyGridYam.length);
    const randomCellYam = copyGridYam[randomIndex];
    copyGridYam.splice(randomIndex, 1);
    randomCellYam.classList.add("yam");
  }
}

// Create poisonous mushroom
function createMushroom(num) {
  const copyGridMushroom = [...cells];
  copyGridMushroom.splice(currentPosition, 1);

  for (let i = 0; i < num; i++) {
    let randomIndex = Math.floor(Math.random() * copyGridMushroom.length);
    const randomCellMushroom = copyGridMushroom[randomIndex];
    copyGridMushroom.splice(randomIndex, 1);
    randomCellMushroom.classList.add("mushroom");
  }
}

// Detect a key is pressed
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyQ": // new learning
      isKeyQPressed = true;
      break;

    case "ArrowLeft":
      if (currentPosition % 10 === 0) {
        return;
      }
      moveFarmer(currentPosition, currentPosition - 1); // move player instead of hiding it
      break;

    case "ArrowUp":
      if (currentPosition < 10) {
        return;
      }
      moveFarmer(currentPosition, currentPosition - 10);
      break;

    case "ArrowDown":
      if (currentPosition >= 90) {
        return;
      }
      moveFarmer(currentPosition, currentPosition + 10);
      break;

    case "ArrowRight":
      if ((currentPosition + 1) % 10 === 0) {
        return;
      }
      moveFarmer(currentPosition, currentPosition + 1);
      break;
  }

  if (checkIfYam()) {
    score += 10;
    displayScore();
    removeYam(currentPosition);
    createYam(1);
    removeAllMushrooms();
    countMushroom++;
    createMushroom(countMushroom);
  }

  if (checkIfMushroom(currentPosition) && checkIfYam() === false) {
    displayScore();
    endGame(messagesEndGame[1]);
  }
});

window.addEventListener("keyup", (event) => {
  // new learning
  switch (event.code) {
    case "KeyQ":
      isKeyQPressed = false;
      break;
  }
});

// Check if yam on the grid
function checkIfYam() {
  return cells[currentPosition].classList.contains("yam");
}

// Check if mushroom on the grid
function checkIfMushroom(position) {
  return cells[position].classList.contains("mushroom");
}

// Remove yam
function removeYam(position) {
  cells[position].classList.remove("yam");
}

// Remove mushroom
function removeMushroom(position) {
  cells[position].classList.remove("mushroom");
}

function removeAllMushrooms() {
  cells.forEach((cell) => {
    cell.classList.remove("mushroom");
  });
}

function displayScore() {
  scoreElement.textContent = score;
}

// Create a timer (new learning)
function displayTimer() {
  const startMinutes = 1;
  let time = startMinutes * 60;

  const timerElement = document.getElementById("timer");

  intervalId = setInterval(() => {
    let minutes = parseInt(time / 60, 10);
    let seconds = parseInt(time % 60, 10);
    // The parseInt()function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).
    // it retuns my variables in numbers

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElement.textContent = `${minutes}:${seconds}`;
    time = time <= 0 ? 0 : time - 1;
    if(time <= 0) { // first condition to end the game and win it
      endGame(messagesEndGame[0])
    }
  }, 1000);
}

function endGame(message) { // function to end game with message game over and restart everything with clearInterval
  clearInterval(intervalId)
  endMessage.textContent = message
  setTimeout(() => dialogModal.showModal(), 500)
}

// function displayAudio() {} = next step

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
