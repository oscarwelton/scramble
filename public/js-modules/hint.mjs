import { wordList } from "../index.mjs";

let hintTimer;

function definitionCensor(definitions, indexPosition, wordList) {
  let hintDefinition = definitions[indexPosition];
  const word = wordList[indexPosition]
  const regex = new RegExp('\\b' + word + '\\b', 'g');
  const stars = '*'.repeat(word.length)

  hintDefinition = hintDefinition.replace(regex, `${stars}`)
  return hintDefinition
}

function hintHandler(definitions, indexPosition, wordList) {
  const hintButton = document.querySelector(".hint-button");
  const hint = document.querySelector(".hint");
  let hintDefinition = definitionCensor(definitions, indexPosition, wordList)
  if (hintDefinition.length >= 110) {
    hintDefinition = `${hintDefinition.substring(0, 110)}...`
  }
  hintButton.classList.add("used");
  hint.innerHTML = `<span><i>${hintDefinition}</i></span>`;
  hintButton.classList.add("used");
  hintSound.play(new Audio("../resources/audio/hint.mp3"));
}

function callHint(definitions, indexPosition, wordList) {
  hintHandler(definitions, indexPosition, wordList);
}

function resetHint(definitions, indexPosition) {
  clearTimeout(hintTimer);
  const hint = document.querySelector(".hint");
  hint.innerHTML = "";
  const hintButton = document.querySelector(".hint-button");
  hintButton.removeEventListener("click", () => callHint(definitions, indexPosition, wordList));
  hintButton.disabled = true;
  hintButton.classList.add("disabled");
  hintButton.classList.remove("used");
}

function hintPrompt(definitions, indexPosition) {
  const hint = document.querySelector(".hint");
  hint.innerHTML = "";
  const hintButton = document.querySelector(".hint-button");
  hintTimer = setTimeout(() => {
    hintButton.classList.remove("disabled");
    hintButton.disabled = false;
    hintButton.addEventListener("click", () => callHint(definitions, indexPosition, wordList))
  }, 30000);
}

export { resetHint, hintPrompt };
