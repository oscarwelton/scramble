function createTickString(indexPosition) {
  let tickString = "";
  for (let i = 0; i < indexPosition; i++) {
    tickString += "✅";
  }
  return tickString;
}

function share(day, indexPosition, scoreValue, timeTaken, gradeEmoji, gradeValue) {
  const popupHTML = `<div id="popup"><i class="fa-solid fa-clipboard-check"></i><br>Copied to clipboard!</div>`;
  const share = document.getElementById("share");

  var clipboard = `⠀Scrambled. (${day})
      \n⠀${createTickString(indexPosition)}
      \n⠀🏆⠀${scoreValue}🏆
      \n⠀⌛⠀${timeTaken}⠀⠀⌛
      \n⠀${gradeEmoji}⠀${gradeValue}⠀⠀${gradeEmoji}`;

  share.addEventListener("click", (event) => {
    console.log(event)
    console.log(clipboard)
    navigator.clipboard.writeText(clipboard);
    document.querySelector("body").insertAdjacentHTML("beforeend", popupHTML);
    document.querySelector(".game-over").style.opacity = 0.8;
    share.disabled = true;

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

export { share };
