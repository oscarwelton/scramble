let percentage;

function percentile(scoreValue) {
  return fetch("/calculate-percentiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: scoreValue }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result["result"];
    });
}

function recalculatePercentile(scoreValue) {
  return fetch("/recalculate-percentiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: scoreValue }),
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

async function calculatePercentiles(scoreValue, storedPercentile) {
  if (storedPercentile == null) {
    percentage = await percentile(scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return toOrdinalSuffix(percentage);
  } else if (storedPercentile >= 0 && scoreValue !== null) {
    percentage = await recalculatePercentile(scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return toOrdinalSuffix(percentage);
  } else {
    percentage = await percentile(scoreValue);
    localStorage.setItem("percentile", Math.abs(percentage));
    return toOrdinalSuffix(percentage);
  }
}

export { calculatePercentiles };
