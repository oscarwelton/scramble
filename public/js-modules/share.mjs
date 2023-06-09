function share(day, indexPosition, scoreValue, timeTaken, emoji) {
  function createTickString(indexPosition) {
    let tickString = "";
    for (let i = 0; i < indexPosition; i++) {
      tickString += "✅";
    }
    return tickString;
  }

  fetch("/day")
    .then((response) => response.json())
    .then((data) => {
      day = parseInt(data.day);

      var clipboard = `⠀Scrambled. (${day})\n⠀${createTickString(
        indexPosition
      )}\n⠀🏆⠀${scoreValue}⠀⠀🏆\n⠀⌛⠀${timeTaken}⠀⠀⌛\n⠀${emoji}⠀${
        grade.innerText
      }⠀⠀${emoji}`;

      const popupHTML = `<div id="popup"><i class="fa-solid fa-clipboard-check"></i><br>Copied to clipboard!</div>`;

      const share = document.getElementById("share");
      share.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(clipboard);
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
        } catch (error) {
          console.error("Failed to write to clipboard:", error);
        }
      });
    });
}

export { share };
