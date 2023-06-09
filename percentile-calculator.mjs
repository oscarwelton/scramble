let scores = [];
let scoreIndex;
scores.sort();


function calculatePercentiles(score) {
  scores.push(score);
  scores.sort();

  if (scores.length <= 1) {
    scoreIndex = 1
  } else {
    scoreIndex = scores.indexOf(score);
  }

  const numberOfScores = scores.length;

  let percentile = ((scoreIndex) / numberOfScores) * 100;
  const updatedPercentile = Math.round(percentile);

  return updatedPercentile;
}


function recalculatePercentiles(score) {
  scores.sort();

  const numberOfScores = scores.length;

  if (scores.length <= 1) {
    scoreIndex = 1
  } else {
    scoreIndex = scores.indexOf(score);
  }

  let percentile = ((scoreIndex) / numberOfScores) * 100;
  const recalculatedPercentile = Math.round(percentile);

  return recalculatedPercentile;
}

export { calculatePercentiles, recalculatePercentiles };
