import express from "express";
import path from "path";
import cron from "node-cron";
import { dirname } from "path";
import { exec } from 'child_process';
import { fileURLToPath } from "url";
import { wordList } from './wordgenerator.mjs';
import { calculatePercentiles, recalculatePercentiles, getScores } from "./percentile-calculator.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/wordList', (req, res) => {
  res.json(wordList);
});

let day = 1;
app.get('/day', (req, res) => {
  res.send({ day });
});

app.get('/scores', async (req, res) => {
  const scores = await getScores();
  res.json(scores);
});

app.post('/calculate-percentiles', async (req, res) => {
  const scores = req.body.playerScores
  const scoreValue = req.body.score;
  const result = await calculatePercentiles(scoreValue, scores);

  res.json({ result });
});

app.post('/recalculate-percentiles', async (req, res) => {
  const scores = req.body.playerScores
  const scoreValue = req.body.score;
  const result = await recalculatePercentiles(scoreValue, scores);
  res.json({ result });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  cron.schedule("0 0 * * *", () => {
    day++;
    exec("node wordGenerator.mjs", (error, stdout, stderr) => {
      if (error) {
        console.error(`Script execution error: ${error}`);
        return;
      }
      console.log(`Script output: ${stdout}`);
    });
  });
});
