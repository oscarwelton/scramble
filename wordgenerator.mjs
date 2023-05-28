import fetch from "node-fetch";
import { faker } from '@faker-js/faker';

let wordList = [];

async function lookUpWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const data = await response.json();
    const definition = data[0]["meanings"][0]["definitions"][0]["definition"];
    return word;
  } catch (error) {
    console.log("Error:", error.message);
    console.log("Type Error. Rerunning lookUpWord...");
    return generateWord(5, 8);
  }
}

async function generateWord(minLength, maxLength) {
  const word = faker.word.sample({
    length: { min: minLength, max: maxLength },
    strategy: "fail",
  });
  const regex = /^[a-zA-Z]+$/;
  return regex.test(word) ? lookUpWord(word) : generateWord(minLength, maxLength);
}

async function addToObject(index) {
  const one = await generateWord(5, 5);
  wordList.push(one);
  const two = await generateWord(6, 6);
  wordList.push(two);
  const three = await generateWord(6, 6);
  wordList.push(three);
  const four = await generateWord(7, 7);
  wordList.push(four);
  const five = await generateWord(8, 8);
  wordList.push(five);
}

async function runScheduledTask() {
  const times = 1;
  for (let i = 0; i < times; i++) {
    await addToObject(i);
  }
  return wordList;
}

(async () => {
  wordList = await runScheduledTask();
})();

export default wordList;
