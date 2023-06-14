import { Mutex } from "async-mutex";
import fetch from "node-fetch";
import 'dotenv/config'

const mutex = new Mutex();
const url = `https://api.jsonbin.io/v3/b/648702148e4aa6225ead0b60`;
const updateKey = process.env['UPDATE_JSON']
const readKey = process.env['READ_JSON']

async function getScores() {
  return fetch(url, {
    method: "GET",
    headers: {
      "X-Access-Key": readKey,
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
        "X-Access-Key": updateKey,
      },
      body: JSON.stringify({ scores }),
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.error(error));
  }

  function resetScores() {
    const scores = [];
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": updateKey,
      },
      body: JSON.stringify({ scores }),
    })
      .then((response) => response.json())
      .then((data) => data)
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

export { calculatePercentiles, recalculatePercentiles, getScores, resetScores };
