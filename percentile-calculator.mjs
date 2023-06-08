let scores = [];
scores.sort();

function calculatePercentiles(score) {
  console.log(score, "score pushed")
  scores.push(score);
  scores.sort();
  console.log(scores)

  const scoreIndex = scores.indexOf(score);
  const numberOfScores = scores.length;

  let percentile = ((scoreIndex + 1) / numberOfScores) * 100;
  const updatedPercentile = Math.round(percentile);

  return updatedPercentile;
}


function recalculatePercentiles(score) {
  console.log(score)
  scores.sort();
  console.log("recalc from", scores)

  const scoreIndex = scores.indexOf(score);
  const numberOfScores = scores.length;

  let percentile = ((scoreIndex + 1) / numberOfScores) * 100;
  const recalculatedPercentile = Math.round(percentile);

  return recalculatedPercentile;
}

export { calculatePercentiles, recalculatePercentiles };
