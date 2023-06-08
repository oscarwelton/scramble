let scores = [];
scores.sort();

function calculatePercentiles(score) {
  scores.push(score);
  scores.sort();

  const scoreIndex = scores.indexOf(score);
  const numberOfScores = scores.length;

  let percentile = ((scoreIndex + 1) / numberOfScores) * 100;
  const updatedPercentile = Math.round(percentile);

  return updatedPercentile;
}


function recalculatePercentiles(score) {
  scores.sort();

  const scoreIndex = scores.indexOf(score);
  const numberOfScores = scores.length;

  let percentile = ((scoreIndex + 1) / numberOfScores) * 100;
  const recalculatedPercentile = Math.round(percentile);

  return recalculatedPercentile;
}

export { calculatePercentiles, recalculatePercentiles };
