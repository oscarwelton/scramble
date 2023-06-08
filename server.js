import express from "express";
import path from "path";
import cron from "node-cron";
import { dirname } from "path";
import { exec } from 'child_process';
import { fileURLToPath } from "url";
import { wordList, dayCount } from './wordgenerator.mjs';
import { calculatePercentiles, recalculatePercentiles } from "./percentile-calculator.mjs";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/wordList', (req, res) => {
  res.json(wordList);
});

app.get('/day', (req, res) => {
  const day = dayCount();
  res.send({ day });
});

app.use(express.json());

app.post('/calculate-percentiles', (req, res) => {
  const score = req.body.score;
  const result = calculatePercentiles(score);

  res.json({ result });
});

app.post('/recalculate-percentiles', (req, res) => {
  const score = req.body.score;
  const result = recalculatePercentiles(score);

  res.json({ result });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  cron.schedule("0 0 * * *", () => {
    console.log("Executing scheduled task...");
    exec("node wordGenerator.mjs", (error, stdout, stderr) => {
      if (error) {
        console.error(`Script execution error: ${error}`);
        return;
      }
      console.log(`Script output: ${stdout}`);
    });
  });
  console.log("Press Ctrl+C to quit.");
});
