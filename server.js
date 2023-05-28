import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import cron from "node-cron";
import { exec } from 'child_process';
import wordList from './wordgenerator.mjs';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public"));
});

app.get('/wordList', (req, res) => {
  res.json(wordList);
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
