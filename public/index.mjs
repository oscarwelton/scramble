let wordList;
let definitions;
let indexPosition;
let scoreValue;
let now = new Date();
let savedMidnight = new Date(localStorage.getItem("midnight"));
let letterIndex = 0;
let timeTaken = 0;
let timeLeft;

// localStorage.clear();

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    wordList = Object.keys(data);
    definitions = Object.values(data);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

if (isNaN(savedMidnight.getTime())) {
  savedMidnight = new Date();
  savedMidnight.setHours(0, 0, 0, 0);
  localStorage.setItem("midnight", savedMidnight.toISOString());
}

if (savedMidnight instanceof Date) {
  if (savedMidnight.getTime() < now.getTime()) {
    localStorage.clear();
    console.log("Time was updated and indexes reset.");
    savedMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    localStorage.setItem("midnight", savedMidnight);
    indexPosition = 0;
    scoreValue = 0;
    localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
    localStorage.setItem("currentScore", JSON.stringify(scoreValue));
  } else {
    const counter = document.getElementById("counter");
    if (counter) {
      counter.innerHTML = indexPosition;
    }
    const storedScore = JSON.parse(localStorage.getItem("currentScore"));
    scoreValue = storedScore;
    const storedIndex = JSON.parse(localStorage.getItem("currentIndex"));
    indexPosition = storedIndex;

    if (indexPosition === 5) {
      gameOver();
    }
  }
} else {
  console.log("error: unable to read date format.");
}

document.addEventListener("click", () => {
  const answerListItems = document
    .getElementById("answer")
    .querySelectorAll("li");
  if (answerListItems.length === wordList[indexPosition].length) {
    const submitButton = document.getElementById("submit");
    submitButton.disabled = false;
  }
});

document.addEventListener("touchend", function (event) {
  now.getTime();
  let lastTouch = event.timeStamp || now;
  let delta = now - lastTouch;

  if (delta < 250 && delta > 0) {
    event.preventDefault();
    event.stopPropagation();
  }
  lastTouch = now;
});

var htmlBlock = `<div class="game">
  <div class="sub-header">
    <div class="score">
      <h3>
        <span id="score"></span> <i class="fa-solid fa-trophy"></i>
      </h3>
    </div>
    <div class="timer">
      <h3>
        <span id="clock">5:00</span> <i class="fa-solid fa-hourglass-start"></i>
      </h3>
    </div>
    <div class="counter">
      <h3><span id="counter"></span> / 5</h3>
    </div>
  </div>

  <div class="answer-string">
    <ul id="answer"></ul>
  </div>
    <h5 class="hint"></h5>
  <div class="actions">
    <button id="shuffle"><i class="fa-solid fa-shuffle"></i></button>
    <button id="clear">
      <i class="fa-solid fa-arrows-rotate"></i>
    </button>
  </div>
  <ul id="anagram"></ul>
  <div id="submit-div">
    <button id="submit" disabled="disabled">Submit</button>
  </div>
  </div>`;

function startClock() {
  var countdownTime = 299;
  const clock = document.getElementById("clock");

  function updateTimer() {
    var minutes = Math.floor(countdownTime / 60);
    var seconds = countdownTime % 60;

    clock.innerHTML =
      minutes.toString().padStart(1, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    countdownTime--;
    timeTaken++;

    if (countdownTime <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }

  setInterval(updateTimer, 1000);
}

const startButton = document.querySelector(".start");
if (startButton) {
  const container = document.querySelector(".container");
  startButton.addEventListener("click", () => {
    document.querySelector(".start-screen").remove();
    container.insertAdjacentHTML("afterbegin", htmlBlock);
    refresh();
    startClock();
  });
}

function gameOver() {
  var minutes = Math.floor(timeTaken / 60);
  var seconds = timeTaken % 60;
  timeTaken =
    minutes.toString().padStart(1, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  var gameOverHtml = `<div class="game-over">
  <h2>Stats: </h2>
  <h3><i class="fa-solid fa-clock"></i> <span>${timeTaken}</span></h3>
  <h3>Completed: <span>${indexPosition}/5</span></h3>
  <h3><i class="fa-solid fa-trophy"></i> <span>${scoreValue}</span></h3>

  <ul>

  </ul>

  <p>Come back tomorrow for another challenge!</p>
  <button>Share <i class="fa-solid fa-share"></i></button>
</div>`;
  const start = document.querySelector(".start-screen");
  if (start) start.remove();
  const game = document.querySelector(".game");
  if (game) game.remove();
  document.querySelector(".container").innerHTML = gameOverHtml;
}

const anagram = () => {
  function shuffleLetters(letters) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = letters[i];
      letters[i] = letters[j];
      letters[j] = temp;
    }
    return letters;
  }
  const word = shuffleLetters(wordList[indexPosition].split(""));
  const anagram = document.getElementById("anagram");
  const answer = document.getElementById("answer");

  word.forEach((letter) => {
    const letterSpan = document.createElement("span");
    letterSpan.innerHTML = letter;
    letterSpan.className = "letter";
    anagram.appendChild(letterSpan);

    const placeholder = document.createElement("span");
    placeholder.className = "placeholder";
    answer.insertAdjacentElement("beforeend", placeholder);
  });
  // hintPrompt();
};

function handleClick() {
  const answer = document.getElementById("answer");
  const currentChild = answer.childNodes[letterIndex];
  const letterLi = document.createElement("li");
  letterLi.textContent = this.textContent;
  letterLi.className = "answer-letter";
  answer.replaceChild(letterLi, currentChild);
  letterIndex++;
  this.classList.add("hide");
}

function answerInput() {
  const anagramLetters = Array.from(
    document.getElementById("anagram").childNodes
  );
  anagramLetters.forEach((letter) => {
    letter.addEventListener("click", handleClick);
  });
}

function hintPrompt() {
  const define = definitions[indexPosition]["definition"];
  console.log(define);
  const speech = definitions[indexPosition]["partOfSpeech"];
  console.log(speech);
  const hint = document.querySelector(".hint");
  hint.innerHTML = `<span>Hint: <i>(${speech})<i> ${define}</span>`;
}

function clear() {
  const clearButton = document.getElementById("clear");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      refresh();
    });
  } else {
    console.log("not found");
  }
}

function shuffle() {
  const shuffle = document.getElementById("shuffle");
  if (shuffle) {
    shuffle.addEventListener("click", () => {
      const ul = document.getElementById("anagram");
      const lettersArray = Array.from(ul.children);
      for (let i = lettersArray.length - 1; i >= 0; i--) {
        ul.appendChild(ul.children[Math.floor(Math.random() * (i + 1))]);
      }
    });
  }
}

function refresh() {
  letterIndex = 0;
  const hidden = document.querySelectorAll("#anagram .hide");
  hidden.forEach((element) => {
    element.classList.remove("hide");
    element.removeEventListener("click", handleClick);
  });
  document.getElementById("answer").innerHTML = "";
  document.getElementById("anagram").innerHTML = "";
  anagram();
  answerInput();
  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;
  shuffle();
  clear();
  submission();
  document.getElementById("score").innerText = scoreValue;
  document.getElementById("counter").innerText = indexPosition + 1;
}

function updateScore() {
  const score = document.getElementById("score");
  const scoreValue = parseInt(score.innerHTML);
  score.innerHTML = scoreValue + 1;
}

function updateCounter() {
  const counter = document.getElementById("counter");
  const counterValue = parseInt(counter.innerHTML);
  counter.innerHTML = counterValue + 1;
}

function updateValues() {
  indexPosition += 1;
  scoreValue += 1;
  updateCounter();
  updateScore();
  document.querySelector(".hint").innerText = "";
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
}

function submission() {
  const submitButton = document.getElementById("submit");
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      const answer = document.getElementById("answer").childNodes;
      const correct = new Audio('/resources/audio/correct.mp3')
      const wrong = new Audio('/resources/audio/error.mp3')
      const answerString = Array.from(answer)
        .map((letter) => letter.innerHTML)
        .join("");
      if (answerString === wordList[indexPosition] && indexPosition === 4) {
        updateValues();
        correct.play();
        gameOver();
      } else if (answerString === wordList[indexPosition]) {
        updateValues();
        correct.play();
        document.querySelector(".hint").innerText = "";
        refresh();
      } else ((answerString != wordList[indexPosition]))
        wrong.play();
        refresh();
      }
    );
  }
}
