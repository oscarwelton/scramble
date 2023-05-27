let newWords = [];
let indexPosition;
let counterValue;
let scoreValue;

const now = new Date();
const savedMidnight = new Date(JSON.parse(localStorage.getItem("midnight")));

if (savedMidnight instanceof Date) {
  console.log("Item exists:", savedMidnight);
  if ((savedMidnight - now) < 0) {
    localStorage.clear();
  }
} else {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  console.log("Item did not exist", midnight);
  localStorage.setItem("midnight", JSON.stringify(midnight));
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
  newWords = [firstWord, secondWord, thirdWord, fourthWord, fifthWord];
  console.log(newWords);
  localStorage.setItem("wordList", JSON.stringify(data));
}

const storedWords = localStorage.getItem("wordList");
if (storedWords) {
  newWords = JSON.parse(storedWords);
} else {
  onlineData(handleData);
}

const storedIndex = localStorage.getItem("currentIndex");
if (storedIndex) {
  indexPosition = JSON.parse(storedIndex);
} else {
  indexPosition = 0;
}

const storedCount = localStorage.getItem("currentCount");
if (storedCount) {
  counterValue = JSON.parse(storedCount);
  document.getElementById("counter").innerHTML = counterValue;
} else {
  counterValue = 0;
  document.getElementById("counter").innerHTML = counterValue;
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


const storedScore = localStorage.getItem("currentScore");
if (storedScore) {
  scoreValue = JSON.parse(storedScore);
  document.getElementById("score").innerHTML = scoreValue;
} else {
  scoreValue = 0;
  document.getElementById("score").innerHTML = scoreValue;
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
  const word = shuffleLetters(newWords[indexPosition].split(""));
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
  const anagramLetters = Array.from(document.getElementById("anagram").childNodes);
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
  startButton.className = "start"
  startButton.innerHTML = "Begin!";
  game.insertAdjacentElement("beforeBegin", startButton);
  startButton.addEventListener("click", () => {
    console.log(event);
    game.classList.remove("game");
    startButton.remove();
    anagram();
    answerInput();
  });
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

// const answer = document.getElementById("answer");
// if (answer.childElementCount === 0) {
//   const refreshButton = document.getElementById("refresh")
//   refreshButton.disabled = true
// }

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
  if (submitCount === newWords[indexPosition].split("").length)
    submitButton.disabled = false;
});

// const refreshButton = document.getElementById("refresh");
// refreshButton.addEventListener("click", () => {
//   const hidden = document.querySelectorAll("#anagram .hide");
//   hidden.forEach((element) => {
//     element.classList.remove("hide");
//   });
//   document.getElementById("answer").innerHTML = "";
//   answerInput();
// });

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
  counterValue += 1;
  scoreValue += 1;
  updateCounter();
  updateScore();
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentCount", JSON.stringify(counterValue));
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
      if (answerString === newWords[indexPosition] && indexPosition === 4) {
        updateValues();
        gameOver();
      } else if (answerString === newWords[indexPosition]) {
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

setInterval(() => {
  newWords = [];
  onlineData(handleData);
  indexPosition = 0;
  counterValue = 0;
  scoreValue = 0;
  localStorage.setItem("currentCount", JSON.stringify(counterValue));
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
}, 60 * 60 * 1000);
