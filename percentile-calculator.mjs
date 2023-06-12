import { Mutex } from "async-mutex";

let scores = [];
let scoreIndex;
const mutex = new Mutex();

async function calculatePercentiles(score) {
  const release = await mutex.acquire();

  try {
    scores.push(score);
    scores.sort((a, b) => a - b);

    if (scores.length <= 1) {
      scoreIndex = 1;
    } else {
      scoreIndex = scores.indexOf(score) + 1;
    }

    const numberOfScores = scores.length;

    let percentile = (scoreIndex / numberOfScores) * 100;
    const updatedPercentile = Math.round(percentile);
    return updatedPercentile
  } finally {
    release();
  }
}

async function recalculatePercentiles(score) {
  const release = await mutex.acquire();

  try {
    scores.sort((a, b) => a - b);

    const numberOfScores = scores.length;

    if (scores.length <= 1) {
      scoreIndex = 1;
    } else {
      scoreIndex = scores.indexOf(score) + 1;
    }

    let percentile = (scoreIndex / numberOfScores) * 100;
    const recalculatedPercentile = Math.round(percentile);
    return recalculatedPercentile;
  } finally {
    release();
  }
}

export { calculatePercentiles, recalculatePercentiles, scores };
