let newWords = [];
let indexPosition;
let scoreValue;

const now = new Date();
let savedMidnight = new Date(localStorage.getItem("midnight"));

if (savedMidnight.getTime() < now.getTime()) {
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
  } else {
    indexPosition = 0;
  }
  document.getElementById("counter").innerHTML = indexPosition;

  const storedScore = localStorage.getItem("currentScore");
  if (storedScore) {
    scoreValue = JSON.parse(storedScore);
  } else {
    scoreValue = 0;
  }
  document.getElementById("score").innerHTML = scoreValue;
}

function onlineData(callback) {
  const apiUrl = "https://api.jsonbin.io/v3/b/646e08b29d312622a364787e";
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$8RTwTXIW08NAev7bHuiPd.MUJff7.e3zn3StonuOdR2tnE1dYrbG2",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const storedData = data["record"][0];
      callback(storedData);
    })
    .catch((error) => console.error(error));
}

function handleData(data) {
  const firstWord = data["one"];
  const secondWord = data["two"];
  const thirdWord = data["three"];
  const fourthWord = data["four"];
  const fifthWord = data["five"];
  wordList = [firstWord, secondWord, thirdWord, fourthWord, fifthWord];
}


function gameOver() {
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

function answerInput() {
  const answer = document.getElementById("answer");
  const anagramLetters = document.getElementById("anagram").childNodes;
  anagramLetters.forEach((letter) => {
    letter.addEventListener("click", () => {
      const letterLi = document.createElement("li");
      letterLi.innerText += letter.innerHTML;
      answer.appendChild(letterLi);
      letter.classList.add("hide");
      letterLi.className = "letter";
    });
  });
}

function handleClick() {
  const letterLi = document.createElement("li");
  letterLi.textContent = this.textContent;
  answer.appendChild(letterLi);
  this.classList.add("hide");
  letterLi.classList.add("letter");
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
refreshButton.addEventListener("click", () => {
  const hidden = document.querySelectorAll("#anagram .hide");
  hidden.forEach((element) => {
    element.classList.remove("hide");
    element.removeEventListener("click", handleClick);
  });
  document.getElementById("answer").innerHTML = "";
  answerInput();
});

displayStart = () => {
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
};

window.onload = () => {
  onlineData(handleData);
  displayStart();
};

const shuffle = document.getElementById("shuffle");
shuffle.addEventListener("click", () => {
  const ul = document.getElementById("anagram");
  const lettersArray = Array.from(ul.children);
  for (let i = lettersArray.length - 1; i >= 0; i--) {
    ul.appendChild(ul.children[Math.floor(Math.random() * (i + 1))]);
  }
});

refresh = () => {
  document.getElementById("anagram").innerHTML = "";
  document.getElementById("answer").innerHTML = "";
  anagram();
  answerInput();
  submitButton.disabled = true;
};

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

function checkAnswer() {
  if (indexPosition === 5) {
    gameOver();
  } else {
    const submit = document.getElementById("submit");
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
}

document.addEventListener("DOMContentLoaded", () => {
  checkAnswer();
});
