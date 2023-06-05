let scores = [];
scores.sort();

function calculatePercentiles(score) {
  scores.push(score);
  scores.sort();

  const scoreIndex = scores.indexOf(score);
  const numberOfScores = scores.length;

  let percentile = ((scoreIndex + 1) / numberOfScores) * 100;
  percentile = Math.round(percentile);

  const toOrdinalSuffix = (percentile) => {
    const int = parseInt(percentile),
      digits = [int % 10, int % 100],
      ordinals = ['st', 'nd', 'rd', 'th'],
      oPattern = [1, 2, 3, 4],
      tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
      ? int + ordinals[digits[0] - 1]
      : int + ordinals[3];
  };


  const updatedPercentile = toOrdinalSuffix(percentile);

  console.log(updatedPercentile);

  return updatedPercentile;
}

export { calculatePercentiles };
