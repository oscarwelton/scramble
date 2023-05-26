const express = require("express");
const app = express();
const path = require("path");
const cron = require("node-cron");
const { faker } = require("@faker-js/faker");
const fetch = require("node-fetch-commonjs");


app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});



function schedluedTask() {
  const wordList = {};

  function generateWord(minLength, maxLength) {
    const word = faker.word.sample({
      length: { min: minLength, max: maxLength },
      strategy: "fail",
    });
    const regex = /^[a-zA-Z]+$/;
    return regex.test(word) ? word : generateWord(minLength, maxLength);
  }

  function addToObject(index) {
    const one = generateWord(4, 4);
    const two = generateWord(5, 5);
    const three = generateWord(5, 5);
    const four = generateWord(6, 6);
    const five = generateWord(7, 8);

    const result = { one, two, three, four, five };

    wordList[index] = result;
  }

  const times = 1;
  for (let i = 0; i < times; i++) {
    addToObject(i);
  }

  fetch("https://api.jsonbin.io/v3/b/646e08b29d312622a364787e", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$8RTwTXIW08NAev7bHuiPd.MUJff7.e3zn3StonuOdR2tnE1dYrbG2",
    },
    body: JSON.stringify(wordList),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  cron.schedule("0 0 * * *", () => {
    console.log("Executing scheduled task...");
    schedluedTask();
  });
  console.log("Press Ctrl+C to quit.");
});
