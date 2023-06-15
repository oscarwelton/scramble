async function reset(now, savedMidnight, scoreValue, indexPosition, countdownTime) {
  localStorage.removeItem(
    "midnight",
    "currentIndex",
    "currentScore",
    "countdownTime",
    "percentile"
  );

  savedMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  scoreValue = 0;
  indexPosition = 0;
  countdownTime = 300;

  localStorage.setItem("midnight", savedMidnight.toISOString());
  localStorage.setItem("currentScore", JSON.stringify(scoreValue));
  localStorage.setItem("currentIndex", JSON.stringify(indexPosition));
  localStorage.setItem("timer", JSON.stringify(countdownTime));
}

export { reset }
