import { Mutex } from "async-mutex";
import fetch from "node-fetch";

const mutex = new Mutex();
const url = `https://api.jsonbin.io/v3/b/648702148e4aa6225ead0b60`;
const apiKey = `$2b$10$8RTwTXIW08NAev7bHuiPd.MUJff7.e3zn3StonuOdR2tnE1dYrbG2`;

async function getScores() {
  return fetch(url, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
      "X-Bin-Meta": false,
    },
  })
    .then((response) => response.text())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }

  function postScores(scores) {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify({ scores }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }


async function calculatePercentiles(scoreValue, scores) {
  const release = await mutex.acquire();
  try {
    scores.push(scoreValue)
    scores.sort((a, b) => a - b);
    const scoreIndex = scores.indexOf(scoreValue) + 1;
    const numberOfScores = scores.length;
    let percentile = (scoreIndex / numberOfScores) * 100;
    const updatedPercentile = Math.round(percentile);
    postScores(scores)
    return updatedPercentile;
  } finally {
    release();
  }
}

async function recalculatePercentiles(scoreValue, scores) {
  const release = await mutex.acquire();

  try {
    scores.sort((a, b) => a - b);
    const numberOfScores = scores.length;
    const scoreIndex = scores.indexOf(scoreValue) + 1;
    let percentile = (scoreIndex / numberOfScores) * 100;
    const recalculatedPercentile = Math.round(percentile);
    return recalculatedPercentile;
  } finally {
    release();
  }
}

export { calculatePercentiles, recalculatePercentiles, getScores };
