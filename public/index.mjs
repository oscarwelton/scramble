let htmlBlock = `<div class="game">
<div class="sub-header">
<div class="score">
  <h3>
    <span id="score"></span> <i class="fa-solid fa-trophy"></i>
  </h3>
</div>
<div class="timer">
  <h3>
    <span id="clock">0:00</span> <i class="fa-solid fa-hourglass-start"></i>
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
<button class="hint-button" disabled="disabled"><i class="fa-solid fa-question"></i></button>
<button id="clear"><i class="fa-solid fa-arrows-rotate"></i></button>
</div>
<ul id="anagram"></ul>
<div id="submit-div">
<button id="submit" disabled="">Submit</button>
</div>
</div>`;

let indexPosition = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let scoreValue = JSON.parse(localStorage.getItem("currentScore")) || 0;
let countdownTime = localStorage.getItem("timer") || 300;
let savedMidnight = new Date(localStorage.getItem("midnight"));
let wordList, definitions;
let now = new Date();
let letterIndex = 0;

console.log(savedMidnight);
console.log(now);

// localStorage.clear();
// localStorage.removeItem("percentile");

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
  savedMidnight instanceof Date &&
  savedMidnight.getTime() < now.getTime()
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
  localStorage.setItem("midnight", savedMidnight.toISOString());

  indexPosition = 0;
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));

  scoreValue = 0;
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));

  countdownTime = 300;
  localStorage.setItem("timer", JSON.stringify(countdownTime));

  console.log("correct format but date in the past. Values reset. ");
} else {
  console.log("Saved Midnight is greater than now. No reset needed.");
}

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    wordList = Object.keys(data);
    definitions = Object.values(data);

    const counter = document.getElementById("counter");
    if (counter) {
      counter.innerHTML = indexPosition;
    }

    if (indexPosition === 5 || countdownTime <= 0) {
      gameOver(wordList);
    }

    document.addEventListener("click", () => {
      let answerListItems = document
        .getElementById("answer")
        .querySelectorAll("li");
      if (answerListItems) {
        if (answerListItems.length === wordList[indexPosition].length) {
          const submitButton = document.getElementById("submit");
          submitButton.disabled = false;
        }
        const clearButton = document.getElementById("clear");

        const clickHandler = () => {
          refresh();
        };

        clearButton.removeEventListener("click", clickHandler);
        clearButton.addEventListener("click", clickHandler);
      }
    });

    function startClock() {
      const clock = document.getElementById("clock");

      function updateTimer() {
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        clock.innerHTML = `${minutes.toString().padStart(1, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
        countdownTime--;
        localStorage.setItem("timer", countdownTime);

        if (countdownTime <= 30) {
          clock.classList.add("red");
          setTimeout(() => {
            clock.classList.remove("red");
          }, 400);
        }

        if (countdownTime <= 0) {
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
          container.insertAdjacentHTML("afterbegin", htmlBlock);
          refresh();
          startClock();
          hintPrompt();
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
            localStorage.setItem("percentile", percentage)
            console.log(percentage)
            resolve(percentage);
          });
      });
    }

    function gameOver(wordList) {
      function calc() {
        let percentage = localStorage.getItem("percentile");
        console.log(percentage)
        if (!percentage) {
          return percentile();
        } else {
          return Promise.resolve(percentage);
        }
      }
      calc().then((percentage) => {
        let emoji;
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

        var gameOverHtml = `
          <div class="game-over">
            <div class="results">
              <h2 class="game-over-header">Results</h2>
                <div class="statistics">
                  <div class="stats">
                    <div class="stat">
                      <h4><span class="icon"><i class="fa-solid fa-trophy"></i></span> ${scoreValue}</h4>
                    </div>
                    <div class="stat">
                      <h4><span class="icon"><i class="fa-solid fa-hourglass-end"></i></span> ${timeTaken}</h4>
                    </div>
                    <div class="stat">
                      <h4><span class="icon"><i class="fa-solid fa-ranking-star"></i></span> ${percentage} <span id="percentile">(percentile)</span></h4>
                    </div>
                  </div>
                </div>
            </div>
              <button id="share">Share <i class="fa-solid fa-share-from-square"></i></button>

          <div class="grading">
            <h3 id="grade"></h3>
            <p id="grade-message"></p>
          </div>
        <div class="word-list">
          <ul>
          <li class="word">1. ${wordList[0]} <span class="mark"></li>
            <ul>
              <li class="definition">${definitions[0]}</li>
            </ul>
          <li class="word">2. ${wordList[1]} <span class="mark"><i class="fa-solid fa-circle-xmark"></i></span></li>
            <ul>
              <li class="definition">${definitions[1]}</li>
            </ul>
          <li class="word">3. ${wordList[2]} <span class="mark"><i class="fa-solid fa-circle-xmark"></i></span></li>
            <ul>
              <li class="definition">${definitions[2]}</li>
            </ul>
          <li class="word">4. ${wordList[3]} <span class="mark"><i class="fa-solid fa-circle-xmark"></i></span></li>
            <ul>
              <li class="definition">${definitions[3]}</li>
            </ul>
          <li class="word">5. ${wordList[4]} <span class="mark"><i class="fa-solid fa-circle-xmark"></i></span></li>
            <ul>
              <li class="definition">${definitions[4]}</li>
            </ul>
          </div>
          <div>
            <h4 class="midnight-countdown">Reset in: &nbsp <span id="time"></span></h4>
          </div>
        </div>`;

        document.querySelector(".start-screen")?.remove();
        document.querySelector(".game")?.remove();
        document.querySelector(".container").innerHTML = gameOverHtml;

        const grade = document.getElementById("grade");
        const gradeMessage = document.getElementById("grade-message");

        switch (true) {
          case scoreValue >= 1875:
            grade.innerText = "A++";
            gradeMessage.innerText = "remarkable!";
            emoji = "🥸";
            break;
          case scoreValue >= 1800 && scoreValue <= 1875:
            grade.innerText = "A";
            gradeMessage.innerText = "outstanding!";
            emoji = "🤓";
            break;
          case scoreValue >= 1700 && scoreValue <= 1799:
            grade.innerText = "A-";
            gradeMessage.innerText = "marvelous!";
            emoji = "😎";
            break;
          case scoreValue >= 1600 && scoreValue <= 1699:
            grade.innerText = "B+";
            gradeMessage.innerText = "brilliant!";
            emoji = "😇";
            break;
          case scoreValue >= 1500 && scoreValue <= 1599:
            grade.innerText = "B";
            gradeMessage.innerText = "impressive!";
            emoji = "😆";
            break;
          case scoreValue >= 1400 && scoreValue <= 1499:
            grade.innerText = "B-";
            gradeMessage.innerText = "encouraging!";
            emoji = "😃";
            break;
          case scoreValue >= 1300 && scoreValue <= 1399:
            grade.innerText = "C+";
            gradeMessage.innerText = "promising!";
            emoji = "😊";
            break;
          case scoreValue >= 1200 && scoreValue <= 1299:
            grade.innerText = "C";
            gradeMessage.innerText = "satisfactory";
            emoji = "🙂";
            break;
          case scoreValue >= 1100 && scoreValue <= 1199:
            grade.innerText = "C-";
            gradeMessage.innerText = "so-so";
            emoji = "🤔";
            break;
          case scoreValue >= 900 && scoreValue <= 999:
            grade.innerText = "D+";
            gradeMessage.innerText = "hmm...";
            emoji = "😐";
            break;
          case scoreValue >= 800 && scoreValue <= 899:
            grade.innerText = "D";
            gradeMessage.innerText = "substandard";
            emoji = "🫢";
            break;
          case scoreValue >= 700 && scoreValue <= 799:
            grade.innerText = "D-";
            gradeMessage.innerText = "poor";
            emoji = "🥲";
            break;
          case scoreValue >= 600 && scoreValue <= 699:
            grade.innerText = "E+";
            gradeMessage.innerText = "not good";
            emoji = "☹️";
            break;
          case scoreValue >= 500 && scoreValue <= 599:
            grade.innerText = "E";
            gradeMessage.innerText = "just bad";
            emoji = "😰";
            break;
          case scoreValue >= 300 && scoreValue <= 399:
            grade.innerText = "E-";
            gradeMessage.innerText = "really?";
            emoji = "😵";
            break;
          case scoreValue >= 0 && scoreValue <= 299:
            grade.innerText = "F";
            gradeMessage.innerText = "fail!";
            emoji = "🤬";
            break;
          default:
            grade.innerText = "Invalid score value";
            break;
        }

        function share() {
          function createTickString(indexPosition) {
            let tickString = "";
            for (let i = 0; i < indexPosition; i++) {
              tickString += "✅";
            }
            return tickString;
          }

          var clipboard = `Scrambled. (1)\n${createTickString(
            indexPosition
          )}\n🏆 ${scoreValue} \n⌛ ${timeTaken} \n${emoji} ${grade.innerText}`;

          var popupHTML = `<div id="popup">Copied to clipboard!</div>`;

          const share = document.getElementById("share");
          share.addEventListener("click", () => {
            navigator.clipboard.writeText(clipboard);
            document
              .querySelector("body")
              .insertAdjacentHTML("beforeend", popupHTML);
            share.disabled = true;
            document.querySelector(".game-over").style.opacity = 0.8;

            setTimeout(() => {
              const popup = document.getElementById("popup");
              document.querySelector(".game-over").style.opacity = 1;
              share.disabled = false;
              if (popup) {
                popup.parentNode.removeChild(popup);
              }
            }, 1000);
          });
        }

        share();

        const time = document.getElementById("time");

        function timeUntilMidnight() {
          now = new Date();
          const timeUntil = savedMidnight - now;
          const hours = Math.floor(timeUntil / 3600000);
          const minutes = Math.floor((timeUntil % 3600000) / 60000);
          const seconds = Math.floor((timeUntil % 60000) / 1000);
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

    function hintPrompt() {
      const hintSound = new Audio("./resources/audio/hint.mp3");
      const hintButton = document.querySelector(".hint-button");
      const hint = document.querySelector(".hint");
      hint.innerHTML = "";
      hintButton.classList.add("disabled");
      hintButton.classList.remove("used");

      if (countdownTime <= 30) {
        hintButton.disabled = false;
        hintButton.classList.remove("disabled");
        hintButton.addEventListener("click", () => {
          hint.innerHTML = `<span><i>${definitions[indexPosition]}</i></span>`;
          hintButton.classList.add("used");
          hintSound.play();
        });
      } else {
        setInterval(() => {
          hintButton.disabled = false;
          hintButton.classList.remove("disabled");
          hintButton.addEventListener("click", () => {
            hint.innerHTML = `<span><i>${definitions[indexPosition]}</i></span>`;
            hintButton.classList.add("used");
            hintSound.play();
          });
        }, 31000);
      }
    }

    function shuffle() {
      const shuffleButton = document.getElementById("shuffle");
      if (shuffleButton) {
        shuffleButton.addEventListener("click", () => {
          const ul = document.getElementById("anagram");
          const lettersArray = Array.from(ul.children);
          const hiddenLetters = ul.querySelectorAll(".hide");

          hiddenLetters.forEach((element) => {
            element.classList.add("d-none");
            element.classList.remove("hide");
          });

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
      submission();
      document.getElementById("score").innerText = scoreValue;
      document.getElementById("counter").innerText = indexPosition + 1;
    }

    function updateScore() {
      const score = document.getElementById("score");
      const scoreValue = parseInt(score.innerHTML);
      score.innerHTML = scoreValue;
    }

    function updateCounter() {
      const counter = document.getElementById("counter");
      const counterValue = parseInt(counter.innerHTML);
      counter.innerHTML = counterValue + 1;
      counter.classList.add("score-animation");
      setTimeout(() => {
        counter.classList.remove("score-animation");
      }, 1000);
    }

    function updateValues() {
      indexPosition += 1;
      if (document.querySelector(".hint").innerText === "") {
        scoreValue += countdownTime;
        scoreValue += 100;
      } else {
        scoreValue += 100;
      }
      updateCounter();
      updateScore();
      hintPrompt();
      localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
      localStorage.setItem("currentScore", JSON.stringify(scoreValue));
    }

    function submission() {
      const submitButton = document.getElementById("submit");
      if (submitButton) {
        submitButton.removeEventListener("click", submitButtonClick);
        submitButton.addEventListener("click", submitButtonClick);
      }
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
      }
    }
  })

  .catch((error) => {
    console.log("Error:", error);
  });
