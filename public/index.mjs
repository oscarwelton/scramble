import { loadHtml } from "./js-modules/load.mjs";
import { startHtml } from "./js-modules/start.mjs";
import { endHtml } from "./js-modules/end.mjs";
import { gameHtml } from "./js-modules/game.mjs";
import { hintPrompt, resetHint } from "./js-modules/hint.mjs";
import { share } from "./js-modules/share.mjs";
import { shuffle } from "./js-modules/shuffle.mjs";
import { grades } from "./js-modules/grade.mjs";
import { timeUntilMidnight } from "./js-modules/midnight-timer.mjs";
import { calculatePercentiles } from "./js-modules/percentiles.mjs";

// localStorage.clear();

let indexPosition = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let countdownTime = localStorage.getItem("timer") || 300;
let scoreValue = JSON.parse(localStorage.getItem("currentScore")) || 0;
let savedMidnight = new Date(localStorage.getItem("midnight"));
let storedPercentile = parseInt(localStorage.getItem("percentile")) || null;
let wordList, definitions;
let now = new Date();
let letterIndex = 0;
let day = 0;
let scores = [];

async function getData() {
  await fetch("/wordList")
    .then((response) => response.json())
    .then((data) => {
      wordList = Object.keys(data);
      definitions = Object.values(data);
    })
    .catch((error) => {
      console.error(error);
    });

  await fetch("/day")
    .then((response) => response.json())
    .then((data) => {
      day = parseInt(data.day);
    })
    .catch((error) => {
      console.error(error);
    });

  await fetch("/scores")
    .then((response) => response.json())
    .then((data) => {
      scores = JSON.parse(data)["scores"];
    });
}

await getData();

async function loadScreen(loadHtml) {
  const container = document.querySelector(".container");
  container.innerHTML = loadHtml;

  const loadScreen = document.querySelector(".load-screen");
  loadScreen.classList.add("wave");

}

function renderStart(startHtml) {
  document.querySelector(".title").classList.remove("d-none");
  document.querySelector(".loader").remove();
  document.querySelector(".container").innerHTML = startHtml;
}

if (indexPosition === 5 || countdownTime <= 0) {
  gameOver(wordList);
} else {
  await loadScreen(loadHtml);

  setTimeout(() => {
    renderStart(startHtml);
    const startButton = document.querySelector(".start");
    const container = document.querySelector(".container");
    if (indexPosition != 0 || countdownTime != 300) {
      startButton.innerText = "Resume";
    }
    startButton.addEventListener("click", () => {




      document.querySelector(".start-screen").remove();
      container.insertAdjacentHTML(
        "afterbegin",
        gameHtml(scoreValue, indexPosition)
      );
      refresh();
      startClock();
      resetHint(definitions, indexPosition);
      hintPrompt(definitions, indexPosition, wordList);
    });
  }, 1400);
}

if (isNaN(savedMidnight.getTime())) {
  localStorage.removeItem(
    "midnight",
    "currentIndex",
    "currentScore",
    "countdownTime",
    "percentile"
  );

  savedMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  localStorage.setItem("midnight", savedMidnight.toISOString());

  indexPosition = 0;
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));

  scoreValue = 0;
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
  console.log("incorrect format, data reset.");

  countdownTime = 300;
  localStorage.setItem("timer", JSON.stringify(countdownTime));
} else if (
  (savedMidnight instanceof Date) &
  (savedMidnight.getTime() < now.getTime())
) {
  localStorage.removeItem(
    "midnight",
    "currentIndex",
    "currentScore",
    "countdownTime",
    "percentile"
  );
  savedMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  indexPosition = 0;
  countdownTime = 300;
  scoreValue = 0;

  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
  localStorage.setItem("midnight", savedMidnight.toISOString());
  localStorage.setItem("timer", JSON.stringify(countdownTime));
}

document.addEventListener("click", () => {
  let answerListItems = document.getElementById("answer");

  if (answerListItems) {
    answerListItems = answerListItems.querySelectorAll("li");

    if (
      indexPosition < 5 &&
      answerListItems.length === wordList[indexPosition].length
    ) {
      const submitButton = document.getElementById("submit");
      submitButton.disabled = false;
      if (submitButton) {
        submitButton.removeEventListener("click", submitButtonClick);
        submitButton.addEventListener("click", submitButtonClick);
      }
    }

    const clickHandler = () => {
      refresh();
    };

    const clearButton = document.getElementById("clear");
    clearButton.removeEventListener("click", clickHandler);
    clearButton.addEventListener("click", clickHandler);
  }
});

function startClock() {
  function updateTimer() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    if (countdownTime <= 30) {
      clock.classList.add("red");
      setTimeout(() => {
        clock.classList.remove("red");
      }, 400);
    }

    const clockInnerHTML = `${minutes.toString().padStart(1, "0")}:
    ${seconds.toString().padStart(2, "0")}`;
    return clockInnerHTML;
  }
  const clock = document.getElementById("clock");
  clock.innerHTML = updateTimer(countdownTime);

  const gameIntervalTimer = setInterval(() => {
    countdownTime--;
    if (countdownTime <= 0) {
      gameOver(wordList);
      clearInterval(gameIntervalTimer);
    }
    localStorage.setItem("timer", countdownTime);
    clock.innerHTML = updateTimer();
  }, 1000);
}

async function percentiles() {
  const percentileValue = await calculatePercentiles(
    scores,
    scoreValue,
    storedPercentile
  );
  return percentileValue;
}

async function gameOver() {
  let percentileValue = await percentiles();
  localStorage.setItem(Math.abs(percentileValue), "percentile");
  let times = localStorage.getItem("timer");

  times = 300 - times;
  if (times > 300) {
    times = 300;
  }
  var minutes = Math.floor(times / 60);
  var seconds = times % 60;
  const timeTaken =
    minutes.toString().padStart(1, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  document.querySelector(".start-screen")?.remove();
  document.querySelector(".game")?.remove();
  document.querySelector(".container").innerHTML = endHtml(
    wordList,
    definitions,
    indexPosition,
    scoreValue,
    timeTaken,
    percentileValue,
    day
  );

  const grade = grades(scoreValue);
  const gradeValue = grade["grade"];
  const gradeEmoji = grade["emoji"];
  share(day, indexPosition, scoreValue, timeTaken, gradeEmoji, gradeValue);

  const time = document.getElementById("time");
  setInterval(() => {
    time.innerHTML = timeUntilMidnight(savedMidnight, time);
  }, 1000);

  const marks = Array.from(document.querySelectorAll("span.mark"));
  marks.slice(0, indexPosition).forEach((mark) => {
    mark.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    mark.style.color = "green";
  });

  const showWordList = document.getElementById("show-list");
  const wordListDiv = document.querySelector(".word-list");
  showWordList.addEventListener("click", () => {
    wordListDiv.classList.remove("slide-to-bottom");
    wordListDiv.classList.remove("d-none");
    wordListDiv.classList.add("slide-in-from-bottom");
    document.getElementById("share").disabled = true;
  });

  const closeList = document.getElementById("close-list");
  closeList.addEventListener("click", () => {
    wordListDiv.classList.remove("slide-in-from-bottom");
    wordListDiv.classList.add("slide-to-bottom");
    setTimeout(() => {
      wordListDiv.classList.add("d-none");
    }, 1000);
    document.getElementById("share").disabled = false;
  });
}

function anagram() {
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
}

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

function refresh() {
  document.getElementById("answer").innerHTML = "";
  document.getElementById("anagram").innerHTML = "";

  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;

  letterIndex = 0;

  const hidden = document.querySelectorAll("#anagram .hide");
  hidden.forEach((element) => {
    element.classList.remove("hide");
    element.removeEventListener("click", handleClick);
  });
  anagram();
  answerInput();
  shuffle();
}

function updateValues() {
  const score = document.getElementById("score");
  const counter = document.getElementById("counter");
  const counterValue = parseInt(counter.innerHTML);

  indexPosition += 1;

  if (document.querySelector(".hint").innerText === "") {
    scoreValue += countdownTime + 100;
  } else {
    scoreValue += 100;
  }

  counter.innerHTML = counterValue + 1;
  counter.classList.add("score-animation");
  setTimeout(() => {
    counter.classList.remove("score-animation");
  }, 1000);

  score.innerHTML = scoreValue;
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
}

function submitButtonClick() {
  const correctAnswer = wordList[indexPosition];
  const answer = document.getElementById("answer");
  const correct = new Audio("/resources/audio/correct.mp3");
  const wrong = new Audio("/resources/audio/error.mp3");
  const answerString = Array.from(answer.childNodes)
    .map((letter) => letter.innerHTML)
    .join("");

  if (answerString != correctAnswer) {
    wrong.play();
    answer.classList.add("shake");
    setTimeout(() => {
      answer.classList.remove("shake");
    }, 400);
    refresh();
  } else if (answerString == correctAnswer && indexPosition === 4) {
    updateValues();
    answer.classList.add("correct");
    correct.play();
    setTimeout(() => {
      answer.classList.remove("correct");
    }, 800);
    gameOver(wordList);
  } else {
    updateValues();
    answer.classList.add("correct");
    correct.play();
    setTimeout(() => {
      answer.classList.remove("correct");
      refresh();
    }, 800);
    resetHint(definitions, indexPosition);
    hintPrompt(definitions, indexPosition, wordList);
  }
}

export { wordList };
