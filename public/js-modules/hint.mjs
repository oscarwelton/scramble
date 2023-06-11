let hintTimer;

function hintHandler(definitions, indexPosition) {
  const hintSound = new Audio("../resources/audio/hint.mp3");
  const hintButton = document.querySelector(".hint-button");
  const hint = document.querySelector(".hint");
  let hintDefinition = definitions[indexPosition];
  if (hintDefinition.length >= 110) {
    hintDefinition = `${hintDefinition.substring(0, 110)}...`
  }
  hintButton.classList.add("used");
  hint.innerHTML = `<span><i>${hintDefinition}</i></span>`;
  hintButton.classList.add("used");
  hintSound.play();
}

function callHint(definitions, indexPosition) {
  hintHandler(definitions, indexPosition);
}

function resetHint(definitions, indexPosition) {
  clearTimeout(hintTimer);
  const hint = document.querySelector(".hint");
  hint.innerHTML = "";
  const hintButton = document.querySelector(".hint-button");
  hintButton.removeEventListener("click", () => callHint(definitions, indexPosition));
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
    hintButton.addEventListener("click", () => callHint(definitions, indexPosition))
  }, 30000);
}

export { resetHint, hintPrompt };
