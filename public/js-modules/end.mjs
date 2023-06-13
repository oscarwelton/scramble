function endHtml(wordList, definitions, indexPosition, scoreValue, timeTaken, percentageShow, day) {
  const gameOverHtml = `
      <div class="game-over slide-in-from-bottom">
        <div class="results">
          <h2 class="game-over-header">Results <span class="day-count">(${day})</span></h2>
            <div class="statistics">
              <div class="stats">
                  <div class="stat">
                    <h4><span class="icon"><i class="fa-solid fa-square-check"></i></span> ${indexPosition} / 5 </h4>
                  </div>
                  <div class="stat">
                    <h4><span class="icon"><i class="fa-solid fa-trophy"></i></span> ${scoreValue}</h4>
                  </div>
                  <div class="stat">
                    <h4><span class="icon"><i class="fa-solid fa-hourglass-end"></i></span> ${timeTaken}</h4>
                  </div>
                  <div class="stat">
                    <h4><span class="icon"><i class="fa-solid fa-ranking-star"></i></span> ${percentageShow} <span id="percentile">(percentile)</span></h4>
                  </div>
              </div>
            </div>
        </div>
      <div class="grading">
        <h3 id="grade"></h3>
        <p id="grade-message"></p>
      </div>
      <div class="end">
        <button id="show-list">Words <i class="fa-solid fa-list-check"></i></i></button>
        <button id="share">Share <i class="fa-solid fa-share-from-square"></i></button>
      </div>
      <div>
        <h4 class="fade midnight-countdown">Reset in: &nbsp <span id="time"></span></h4>
      </div>
    </div>
  </div>


    <div class="word-list d-none">
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
      <button id="close-list"><i class="fa-solid fa-circle-xmark"> Close</i></button>
    </div>`;
    return gameOverHtml
}

export { endHtml }
