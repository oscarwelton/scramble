let percentage;
let rank;

function percentile(scores, scoreValue) {
  return fetch("/calculate-percentiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerScores: scores, score: scoreValue }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result["result"];
    });
}

function recalculatePercentile(scores, scoreValue) {
  return fetch("/recalculate-percentiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerScores: scores, score: scoreValue }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result["result"];
    });
}

function toOrdinalSuffix(percentage) {
  const int = parseInt(percentage),
    digits = [int % 10, int % 100],
    ordinals = ["st", "nd", "rd", "th"],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? int + ordinals[digits[0] - 1]
    : int + ordinals[3];
}

async function newRank(scores, scoreValue) {
  scores.push(scoreValue);
  scores.sort((a, b) => a - b);
  const rank = scores.length - (scores.indexOf(scoreValue));
  return toOrdinalSuffix(rank);
}

async function updateRank(scores, scoreValue) {
  scores.sort((a, b) => a - b);
  const rank = scores.length - (scores.indexOf(scoreValue));
  return toOrdinalSuffix(rank);
}

async function calculatePercentiles(scores, scoreValue, storedPercentile) {
  if (storedPercentile == null) {
    percentage = await percentile(scores, scoreValue);
    rank = await newRank(scores, scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return {
      percentile: toOrdinalSuffix(Math.abs(percentage)),
      rank: rank,
    };
  } else if (storedPercentile >= 0 && scoreValue !== null) {
    percentage = await recalculatePercentile(scores, scoreValue);
    rank = await updateRank(scores, scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return {
      percentile: toOrdinalSuffix(Math.abs(percentage)),
      rank: rank,
    };
  } else {
    percentage = await percentile(scores, scoreValue);
    rank = await newRank(scores, scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return {
      percentile: toOrdinalSuffix(Math.abs(percentage)),
      rank: rank,
    };
  }
}

export { calculatePercentiles };
