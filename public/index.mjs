let wordList;
let indexPosition;
let scoreValue;
let now = new Date();
let savedMidnight = new Date(localStorage.getItem("midnight"));

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    wordList = data;
  })
  .catch((error) => {
    console.log("Error:", error);
  });

function displayStart() {
  const startButton = document.createElement("button");
  const game = document.querySelector(".game");
  if (game) {
    startButton.className = "start";
    startButton.innerHTML = "Begin!";
    game.insertAdjacentElement("beforeBegin", startButton);
    startButton.addEventListener("click", () => {
      game.classList.remove("game");
      startButton.remove();
      anagram();
      answerInput();
    });
  }
}

if (savedMidnight.getTime() < now.getTime()) {
  console.log("Time was updated and indexes reset.")
  localStorage.clear();
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
  const storedIndex = localStorage.getItem("currentIndex");
  if (storedIndex) {
    indexPosition = JSON.parse(storedIndex);
    if (indexPosition === 5) {
      gameOver();
    } else {
      displayStart();
    }
  } else {
    indexPosition = 0;
    localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  }

  console.log(savedMidnight)
  console.log(now)

  const counter = document.getElementById("counter");
  if (counter) {
    counter.innerHTML = indexPosition;
  }

  const storedScore = localStorage.getItem("currentScore");
  const score = document.getElementById("score");
  if (storedScore) {
    scoreValue = JSON.parse(storedScore);
  } else {
    scoreValue = 0;
  }
  if (score) {
    score.innerHTML = scoreValue;
  }
}

function gameOver() {
  const index = document.getElementById("index");
  index.innerText = indexPosition;
  const nowDiv = document.getElementById("now");
  nowDiv.innerText = now;
  const mid = document.getElementById("midnight")
  mid.innerText = savedMidnight

  const game = document.querySelector(".game");
  game.parentNode.removeChild(game);
  const gameOver = document.createElement("h1");
  gameOver.innerHTML = "Game Over";
  const submit = document.getElementById("submit-div");
  if (submit) {
    submit.innerHTML = "";
  }
  const container = document.querySelector(".container");
  container.appendChild(gameOver);
}

function shuffleLetters(letters) {
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = letters[i];
    letters[i] = letters[j];
    letters[j] = temp;
  }
  return letters;
}

const anagram = () => {
  const word = shuffleLetters(wordList[indexPosition].split(""));
  const anagram = document.getElementById("anagram");
  word.forEach((letter) => {
    const letterSpan = document.createElement("span");
    letterSpan.innerHTML = letter;
    anagram.appendChild(letterSpan);
    letterSpan.className = "letter";
  });
};

function handleClick() {
  const letterLi = document.createElement("li");
  letterLi.textContent = this.textContent;
  answer.appendChild(letterLi);
  this.classList.add("hide");
  letterLi.className = "letter";
}

function answerInput() {
  const anagramLetters = Array.from(
    document.getElementById("anagram").childNodes
  );
  anagramLetters.forEach((letter) => {
    letter.addEventListener("click", handleClick);
  });
}

const refreshButton = document.getElementById("refresh");
if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    const hidden = document.querySelectorAll("#anagram .hide");
    hidden.forEach((element) => {
      element.classList.remove("hide");
      element.removeEventListener("click", handleClick);
    });
    document.getElementById("answer").innerHTML = "";
    answerInput();
  });
}

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

function refresh() {
  document.getElementById("anagram").innerHTML = "";
  document.getElementById("answer").innerHTML = "";
  anagram();
  answerInput();
  submitButton.disabled = true;
}

const submitButton = document.getElementById("submit");
document.addEventListener("click", () => {
  const submitCount = Array.from(
    document.getElementById("answer").childNodes
  ).length;
  if (submitCount === wordList[indexPosition].split("").length)
    submitButton.disabled = false;
});

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
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
}

const submit = document.getElementById("submit");
if (submit) {
  submit.addEventListener("click", () => {
    const answer = document.getElementById("answer").childNodes;
    const answerString = Array.from(answer)
      .map((letter) => letter.innerHTML)
      .join("");
    if (answerString === wordList[indexPosition] && indexPosition === 4) {
      updateValues();
      gameOver();
    } else if (answerString === wordList[indexPosition]) {
      updateValues();
      refresh();
    } else {
      refresh();
    }
  });
}
