function startClock(countdownTime) {
  const clock = document.getElementById("clock");

  function updateTimer() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    clock.innerHTML = `
      ${minutes.toString().padStart(1, "0")}:
      ${seconds.toString().padStart(2, "0")}`;
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

export { startClock }
