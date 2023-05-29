let wordList;
let indexPosition;
let scoreValue;

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    wordList = data;
  })
  .catch((error) => {
    console.log("Error:", error);
  });

let now = new Date();
let savedMidnight = new Date(localStorage.getItem("midnight"));

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
} else {
  console.log("error: unable to read date format.");
}

document.addEventListener("touchend", function (event) {
  now.getTime();
  let lastTouch = event.timeStamp || now;
  let delta = now - lastTouch;
  if (delta < 450 && delta > 0) {
    event.preventDefault();
    event.stopPropagation();
  }
  lastTouch = now;
});

function gameOver() {
  const words = document.getElementById("word-list");
  wordList.forEach((word) => {
    const wor = document.createElement("li");
    wor.innerText = word;
    words.insertAdjacentElement.wor;
  });
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
  const answer = document.getElementById("answer");

  word.forEach((letter) => {
    const lets = document.createElement("span");
    lets.className = "placeholder";
    answer.insertAdjacentElement("beforeend", lets);
    const letterSpan = document.createElement("span");
    letterSpan.innerHTML = letter;
    anagram.appendChild(letterSpan);
    letterSpan.className = "letter";
  });
};

let letterIndex = 0

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

function displayStart() {
  const startHtmlBlock = `<div class="start-screen">
  <h2>Welcome!</h2>
  <p>
    The objective of the game is to solve five anagrams. Simple, right?
  </p>
  <p>
    Earn points for each correctly solved anagram. You have five minutes
    to solve them all and you earn more points the faster you are.
  </p>
  <div class="examples">
    <h4>Anagram:</h4>
    <div class="example">
      <span>c</span><span>l</span><span>a</span><span>m</span
      ><span>b</span> <span>e</span><span>r</span><span>s</span>
    </div>
    <h4>Answer:</h4>
    <div class="example">
      <span>s</span><span>c</span><span>r</span><span>a</span
      ><span>m</span><span>b</span><span>l</span><span>e</span>
    </div>
  </div>
  <p>Compete against your friends and family!</p>
  <p>Ready?</p>
  <div class="start-button">
    <button class="start">Start</button>
  </div>
</div>`;

  const container = document.querySelector(".container");
  container.insertAdjacentHTML("afterbegin", startHtmlBlock);
  const game = document.querySelector(".game")

  const startButton = document.querySelector(".start")
    startButton.addEventListener("click", () => {
      const startDiv = document.querySelector(".start-screen")
      startDiv.remove();
      game.classList.remove("game");
      anagram();
      answerInput();
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
    const children = document.getElementById("answer").childNodes;
    crossOriginIsolated.log(children)
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
if (submitButton) {
  document.addEventListener("click", () => {
    const submitCount = Array.from(
      document.getElementById("answer").childNodes
    ).length;
    if (submitCount === wordList[indexPosition].split("").length)
      submitButton.disabled = false;
  });
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
