import { htmlBlock } from "./js-modules/game.mjs";
import { endHtml } from "./js-modules/end.mjs";
import { toOrdinalSuffix } from "./js-modules/ordinal.mjs";
import { hintPrompt } from "./js-modules/hint.mjs";
import { share } from "./js-modules/share.mjs";
import { shuffle } from "./js-modules/shuffle.mjs"
import { grades } from "./js-modules/grade.mjs"

let indexPosition = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let countdownTime = localStorage.getItem("timer") || 300;
let scoreValue = JSON.parse(localStorage.getItem("currentScore")) || 0;
let savedMidnight = new Date(localStorage.getItem("midnight"));
let storedPercentile = localStorage.getItem("percentile");
let wordList, definitions;
let now = new Date();
let letterIndex = 0;
let percentageShow;
let day = 0;

// localStorage.clear();

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    wordList = Object.keys(data);
    definitions = Object.values(data);
    if (indexPosition === 5 || countdownTime <= 0) {
      gameOver(wordList);
    }
  })
  .catch((error) => {
    console.error(error);
  });

  fetch("/day")
  .then((response) => response.json())
  .then((data) => {
    day = parseInt(data.day)
  })
  .catch ((error) => {
    console.error(error);
  });


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

    if (indexPosition < 5 && answerListItems.length === wordList[indexPosition].length) {
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
  const clock = document.getElementById("clock");

  function updateTimer() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    clock.innerHTML = `
      ${minutes.toString().padStart(1, "0")}:
      ${seconds.toString().padStart(2, "0")}`;
    countdownTime--;
    localStorage.setItem("timer", countdownTime);

    if (countdownTime <= 30) {
      clock.classList.add("red");
      setTimeout(() => {
        clock.classList.remove("red");
      }, 400);
    }

    if (countdownTime <= 0 || indexPosition === 5) {
      clearInterval(intervalId);
      gameOver(wordList);
    }
  }
  const intervalId = setInterval(updateTimer, 1000);
}

const startButton = document.querySelector(".start");
if (startButton) {
  const container = document.querySelector(".container");
  startButton.addEventListener("click", () => {
    if (indexPosition === 5) {
      gameOver(wordList);
    } else {
      document.querySelector(".start-screen").remove();
      container.insertAdjacentHTML("afterbegin", htmlBlock(indexPosition));
      refresh();
      startClock();
      hintPrompt(definitions, countdownTime, indexPosition);
    }
  });
}

function percentile() {
  return new Promise((resolve, reject) => {
    fetch("/calculate-percentiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: scoreValue }),
    })
      .then((response) => response.json())
      .then((result) => {
        const percentage = result["result"];
        resolve(percentage);
      });
  });
}

function recalculatePercentile() {
  return new Promise((resolve, reject) => {
    fetch("/recalculate-percentiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: scoreValue }),
    })
      .then((response) => response.json())
      .then((result) => {
        const percentage = result["result"];
        resolve(percentage);
      });
  });
}

function calc() {
  return new Promise((resolve, reject) => {
    if (storedPercentile === null) {
      percentile()
        .then((percentage) => {
          localStorage.setItem("percentile", percentage);
          percentageShow = toOrdinalSuffix(percentage);
          resolve(percentage);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (storedPercentile >= 0) {
      recalculatePercentile()
        .then((percentage) => {
          localStorage.setItem("percentile", percentage);
          percentageShow = toOrdinalSuffix(percentage);
          resolve(percentage);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      percentile()
        .then((percentage) => {
          localStorage.setItem("percentile", percentage);
          percentageShow = toOrdinalSuffix(percentage);
          resolve(percentage);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

function gameOver() {
  calc().then((percentage) => {
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
      percentageShow
    );

    const grade = grades(scoreValue);
    const gradeValue = grade['grade']
    const gradeEmoji = grade['emoji']
    share(day, indexPosition, scoreValue, timeTaken, gradeEmoji, gradeValue);

    const time = document.getElementById("time");
    function timeUntilMidnight() {
      now = new Date();
      const timeUntil = savedMidnight - now;
      const seconds = Math.floor((timeUntil % 60000) / 1000);
      const minutes = Math.floor((timeUntil % 3600000) / 60000);
      const hours = Math.floor(timeUntil / 3600000);
      time.innerHTML = `
          ${hours
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}:
          ${minutes
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}:
          ${seconds
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}`;
    }

    setInterval(() => {
      timeUntilMidnight();
    }, 1000);

    const marks = Array.from(document.querySelectorAll("span.mark"));
    marks.slice(0, indexPosition).forEach((mark) => {
      mark.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      mark.style.color = "green";
    });
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
  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;

  document.getElementById("answer").innerHTML = "";
  document.getElementById("anagram").innerHTML = "";

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
    scoreValue += (countdownTime + 100);
  } else {
    scoreValue += 100;
  }

  counter.innerHTML = counterValue + 1;
  counter.classList.add("score-animation");
  setTimeout(() => {
    counter.classList.remove("score-animation");
  }, 1000);

  console.log(scoreValue)
  score.innerHTML = scoreValue;

  hintPrompt(definitions, countdownTime, indexPosition);
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
}

function submitButtonClick() {
  const correctAnswer = wordList[indexPosition];
  const answer = document.getElementById("answer");
  const correct = new Audio("/resources/audio/correct.mp3");
  const wrong = new Audio("/resources/audio/error.mp3");
  const answerString = Array.from(answer.childNodes).map((letter) => letter.innerHTML).join("");

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
  }
}
