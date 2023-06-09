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

export { shuffle }
