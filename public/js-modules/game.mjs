function gameHtml(scoreValue, indexPosition) {
 return `<div class="game">
<div class="sub-header">
<div class="score">
<h3>
<span id="score">${scoreValue}</span> <i class="fa-solid fa-trophy"></i>
</h3>
</div>
<div class="timer">
<h3>
<span id="clock">0:00</span> <i class="fa-solid fa-hourglass-start"></i>
</h3>
</div>
<div class="counter">
  <h3><span id="counter">${indexPosition}</span> / 5</h3>
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
  </div>`
}

export { gameHtml }
