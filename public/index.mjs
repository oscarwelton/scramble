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
<button id="submit" disabled="disabled">Submit</button>
</div>
</div>`;

let indexPosition = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let scoreValue = JSON.parse(localStorage.getItem("currentScore")) || 0;
let countdownTime = localStorage.getItem("timer") || 300;
let gamesPlayed = localStorage.getItem("games") || 1;
let savedMidnight = new Date(localStorage.getItem("midnight"));
if (isNaN(savedMidnight.getTime())) {
  savedMidnight = new Date();
  savedMidnight.setHours(0, 0, 0, 0);
  localStorage.setItem("midnight", savedMidnight.toISOString());
}
let wordList, definitions;
let now = new Date();
let letterIndex = 0;

// localStorage.clear();

fetch("/wordList")
  .then((response) => response.json())
  .then((data) => {
    wordList = Object.keys(data);
    definitions = Object.values(data);
    console.log(wordList);

    if (
      savedMidnight instanceof Date &&
      savedMidnight.getTime() < now.getTime()
    ) {
      localStorage.removeItem("midnight", "currentIndex", "currentScore");
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
      localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
      scoreValue = 0;
      localStorage.setItem("currentScore", JSON.stringify(scoreValue));
      gamesPlayed += 1;
      localStorage.setItem("games", gamesPlayed);
    } else if (!(savedMidnight instanceof Date)) {
      console.log("Error: Invalid date format.");
    } else {
      console.log("No action needed.");
    }

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

    function gameOver(wordList) {
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
      var gameOverHtml = `<div class="game-over">
      <h2 class="center">Congratulations!</h2>
      <div class="statistics">
        <div class="stat">
      <h3><i class="fa-solid fa-clock"></i></h3>
      <h3 id="time-taken">${timeTaken} </h3>
      </div>
      <div class="stat">
      <h3><i class="fa-solid fa-trophy"></i></h3>
      <h3>${scoreValue}</h3>
      </div>
      <div class="stat">
      <h3><i class="fa-solid fa-fire"></i></h3>
      <h3 id="time-taken">${gamesPlayed} days</h3>
      </div>
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
        </ul>
        </div>

      <h5 class="center">Come back tomorrow for another challenge!</h4>
      <div class="share">
      <button id="share">Invite <i class="fa-brands fa-whatsapp"></i>
                                <i class="fa-brands fa-twitter"></i>
                                <i class="fa-brands fa-instagram"></i>
                                <i class="fa-brands fa-square-facebook"></i>
                                </button>
        </div>
      </div>`;

      document.querySelector(".start-screen")?.remove();
      document.querySelector(".game")?.remove();
      document.querySelector(".container").innerHTML = gameOverHtml;

      const marks = Array.from(document.querySelectorAll("span.mark"));
      marks.slice(0, indexPosition).forEach((mark) => {
        mark.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        mark.style.color = "green";
      });

      // const shareButton = document.getElementById("share");
      // shareButton.addEventListener("click", function () {
      //   const urlToCopy = "https://anagrams.herokuapp.com";
      //   const tempInput = document.createElement("input");
      //   tempInput.value = urlToCopy;
      //   document.body.appendChild(tempInput);
      //   tempInput.select();
      //   tempInput.setSelectionRange(0, 99999);
      //   document.execCommand("copy");
      //   document.body.removeChild(tempInput);
      //   alert("URL copied to clipboard!");
      // });
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
      const hintButton = document.querySelector(".hint-button");
      hintButton.disabled = true;
      hintButton.classList.add("disabled");
      const hint = document.querySelector(".hint");
      hint.innerHTML = "";

      hintButton.addEventListener("click", () => {
        hint.innerHTML = `<span><i>${definitions[indexPosition]}</i></span>`;
      });

      if (countdownTime < 30) {
        hintButton.disabled = false;
        hintButton.classList.remove("disabled");
      } else {
        setInterval(() => {}, 30000);
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
