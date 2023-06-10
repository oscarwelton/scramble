let scores = [];
let scoreIndex;
scores.sort((a, b) => a - b)

function calculatePercentiles(score) {
  console.log(score)
  scores.push(score);
  scores.sort((a, b) => a - b)
  console.log(scores, scores.length, "pushed score")

  if (scores.length <= 1) {
    scoreIndex = 1
  } else {
    scoreIndex = scores.indexOf(score) + 1;
  }

  const numberOfScores = scores.length;

  console.log(scoreIndex, "score Index")
  let percentile = ((scoreIndex) / numberOfScores) * 100;
  console.log("percentile = ", percentile)
  const updatedPercentile = Math.round(percentile);

  return updatedPercentile;
}


function recalculatePercentiles(score) {
  console.log(score)
  console.log("before sort", scores, scores.length)
  scores.sort((a, b) => a - b)
  console.log(scores, scores.length, "did not push score")

  const numberOfScores = scores.length;

  if (scores.length <= 1) {
    scoreIndex = 1
  } else {
    scoreIndex = scores.indexOf(score) + 1;
  }

  let percentile = ((scoreIndex) / numberOfScores) * 100;
  console.log("percentile = ", percentile)
  const recalculatedPercentile = Math.round(percentile);

  return recalculatedPercentile;
}

export { calculatePercentiles, recalculatePercentiles };
